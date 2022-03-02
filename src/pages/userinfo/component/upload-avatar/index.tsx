/**
 * Created by buddy on 2021/2/19.
 */
import { Image, Loading, Toast } from 'vant'
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Button } from 'ant-design-vue'
import Icon from '@/components-global/icon/main'

import './index.less'
import { UploadWrapper } from '@/pages/userinfo/component/upload-avatar/UploadWrapper'
import { measureImg } from '@/utils'
import { uploadAvatar } from '@/pages/userinfo/api'
import { useUpdateProfile } from '@/hooks'

// TODO 点击阴影面积、叉叉取消，加载的时候添加动画
// TODO 很神奇的一点就是，它这里的拖拽会受 document 和 元素之间的影响，document不受容器限制，元素会受容器限制

const CONST_W = 220
export const UploadAvatar = defineComponent({
  name: 'UploadAvatar',
  // eslint-disable-next-line vue/require-prop-types
  props: ['defaultImg', 'onComplete'],
  emits: ['complete'],
  setup(props, { emit }) {
    const updateProfile = useUpdateProfile()

    const state = reactive({
      image: '',
      error: '',
      scale: 0,
      top: 0,
      left: 0,
      loading: false
    })
    const info = ref({
      ratio: 0,
      isVertical: true,
      originH: 0,
      originW: 0,
      imageH: 0,
      imageW: 0,
      scaleMax: 0,
      scaleMin: 0,
      topMin: 0,
      leftMin: 0
    })

    const onFile = async (files: any) => {
      const [file] = files
      if (file.size > 5242880) {
        state.error = '请选择不超过5M的图片'
        return
      }
      if (state.error) {
        state.error = ''
      }
      const img = window.URL.createObjectURL(file)
      const origin: any = await measureImg(img)

      const isVertical = origin.h > origin.w
      const ratio = isVertical ? CONST_W / origin.h : CONST_W / origin.w

      let h = 0
      let w = 0

      if (isVertical) {
        h = CONST_W
        w = origin.w * ratio
      } else {
        w = CONST_W
        h = origin.h * ratio
      }

      info.value = {
        ratio,
        isVertical,
        originH: origin.h,
        originW: origin.w,
        imageH: h,
        imageW: w,
        scaleMax: Math.min(w, h),
        scaleMin: 10,
        topMin: isVertical ? 0 : (220 - h) / 2,
        leftMin: isVertical ? (220 - w) / 2 : 0
      }

      state.image = img
      state.scale = Math.min(w, h)
      state.top = (CONST_W - state.scale) / 2
      state.left = state.top
    }

    const getInnerLeft = () => {
      const { imageW, isVertical } = info.value
      return isVertical ? state.left - (CONST_W - imageW) / 2 : state.left
    }

    const getInnerTop = () => {
      const { imageH, isVertical } = info.value
      return isVertical ? state.top : state.top - (CONST_W - imageH) / 2
    }

    const getOriginInnerLeft = () => {
      const { ratio } = info.value
      return getInnerLeft() / ratio
    }

    const getOriginInnerTop = () => {
      const { ratio } = info.value
      return getInnerTop() / ratio
    }

    const getOuterTopMax = () => {
      const { isVertical, imageH } = info.value
      return isVertical
        ? CONST_W - state.scale
        : (CONST_W + imageH) / 2 - state.scale
    }

    const getOuterLeftMax = () => {
      const { isVertical, imageW } = info.value
      return isVertical
        ? (CONST_W + imageW) / 2 - state.scale
        : CONST_W - state.scale
    }

    const box = ref()
    const scale = ref()
    const drager = ref()
    const point = ref()

    const onSave = () => {
      const LEN = 1024
      const canvas = document.createElement('canvas')

      canvas.width = LEN
      canvas.height = LEN
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')
      img.onload = () => {
        ctx?.drawImage(
          img,
          getOriginInnerLeft(),
          getOriginInnerTop(),
          state.scale / info.value.ratio,
          state.scale / info.value.ratio,
          0,
          0,
          LEN,
          LEN
        )

        canvas.toBlob(async (file: any) => {
          state.loading = true
          try {
            const res: any = await uploadAvatar(file)
            state.loading = false
            if (res && res.code === 200 && res.data.url) {
              updateProfile({
                ['avatarImgIdStr']: res.data.imgId,
                ['avatarImgId_str']: res.data.imgId,
                avatarUrl: res.data.url
              })
              props.onComplete()
              Toast('头像修改成功')
            }
          } catch (e) {
            state.loading = false
          }
        })
      }
      img.src = state.image
    }

    const onDown = (e: MouseEvent) => {
      drager.value = e.target
      point.value = {
        x: e.x,
        y: e.y
      }
    }

    const onUp = () => {
      drager.value = null
      point.value = undefined
    }

    const onMove = (e: MouseEvent) => {
      if (drager.value === box.value) {
        const deltX = e.x - point.value.x
        const deltY = e.y - point.value.y
        const { topMin, leftMin } = info.value

        const topMax = getOuterTopMax()
        const leftMax = getOuterLeftMax()

        state.top = Math.max(topMin, Math.min(topMax, state.top + deltY))

        state.left = Math.max(leftMin, Math.min(leftMax, state.left + deltX))
      }
      if (drager.value === scale.value) {
        const { scaleMax, scaleMin, isVertical, imageW, imageH } = info.value
        const { scale } = state

        const delt = e.x - point.value.x

        state.scale = Math.max(
          scaleMin,
          Math.min(
            Math.min(
              scaleMax,
              isVertical
                ? (CONST_W + imageW) / 2 - state.left
                : (CONST_W + imageH) / 2 - state.top
            ),
            scale + delt
          )
        )
      }

      point.value = {
        x: e.x,
        y: e.y
      }
    }

    onMounted(() => {
      onFile([props.defaultImg])
      document.addEventListener('mousedown', onDown)
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    })

    return () => {
      const bigRatio = 100 / state.scale
      const smallRatio = 60 / state.scale
      const left = getInnerLeft()
      const top = getInnerTop()

      return (
        <div class="upload-avatar__masker">
          <div class="upload-avatar">
            <div class="upload-avatar__move">
              <div
                class="upload-avatar__close"
                onClick={() => {
                  emit('complete')
                }}
              >
                <Icon icon="cross" color="auto"></Icon>
              </div>
              <div class="upload-avatar__title">上传头像</div>
            </div>
            <div class="upload-avatar__box">
              <div class="upload-avatar__poster">
                <div>
                  {state.image && (
                    <Image
                      src={state.image}
                      width={info.value.imageW}
                      height={info.value.imageH}
                      style={{ display: 'block' }}
                    ></Image>
                  )}
                  {state.error && (
                    <span class="upload-avatar__error">{state.error}</span>
                  )}
                </div>
                {/* 图片正常情况下可以有蒙版 */}
                <div
                  ref={box}
                  class="upload-avatar__postermover"
                  style={{
                    opacity: state.image ? 1 : 0,
                    height: state.scale + 'px',
                    width: state.scale + 'px',
                    top: state.top + 'px',
                    left: state.left + 'px'
                  }}
                >
                  <div ref={scale} class="upload-avatar__posterscaler"></div>
                </div>
              </div>
              <div>
                <div class="upload-avatar__poster1">
                  <Image
                    src={state.image}
                    width={info.value.imageW * bigRatio}
                    height={info.value.imageH * bigRatio}
                    style={{
                      position: 'absolute',
                      top: -top * bigRatio + 'px',
                      left: -left * bigRatio + 'px'
                    }}
                  ></Image>
                </div>
                <div class="upload-avatar__postertext">大尺寸封面</div>
                <div class="upload-avatar__poster2">
                  <Image
                    src={state.image}
                    width={info.value.imageW * smallRatio}
                    height={info.value.imageH * smallRatio}
                    style={{
                      position: 'absolute',
                      top: -top * smallRatio + 'px',
                      left: -left * smallRatio + 'px'
                    }}
                  ></Image>
                </div>
                <div class="upload-avatar__postertext">小尺寸封面</div>
              </div>
            </div>

            <div class="upload-avatar__submit">
              <UploadWrapper onFile={onFile}>
                <Button shape="round">重新选择</Button>
              </UploadWrapper>

              <Button
                shape="round"
                type="primary"
                onClick={() => {
                  onSave()
                }}
              >
                保存并关闭
              </Button>
            </div>
          </div>
          {state.loading && (
            <div class="upload-avatar__masker center">
              <Loading type="spinner" color="#d3d8dd"></Loading>
            </div>
          )}
        </div>
      )
    }
  }
})
