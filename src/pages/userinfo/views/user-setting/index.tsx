/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Created by buddy on 2021/2/18.
 */
import { computed, defineComponent, reactive, watch } from 'vue'
import { Image, Toast } from 'vant'
import { Button, Input } from 'ant-design-vue'
import { BirthSelect } from '@/pages/userinfo/views/user-setting/birth-select'
import { SexSelect } from '@/pages/userinfo/views/user-setting/sex-select'
import { useAuthProfile, useRouter, useUpdateProfile } from '@/hooks'

import { UploadBtn } from '@/pages/userinfo/component/upload-btn'
import './index.less'
import { updateProfile } from '@/pages/userinfo/api'

/*
  TODO 由于网易云有自己的区号标准，所以暂不支持该功能
    - 海外
    - 特别行政区
    - 台湾省
*/

export const UserSetting = defineComponent({
  name: 'UserSetting',
  setup() {
    const $router = useRouter()

    const authProfile: any = useAuthProfile()
    const updateProfileAction = useUpdateProfile()

    const { nickname, signature, gender, birthday, avatarUrl, city, province } =
      authProfile.value

    const state: any = reactive({
      nickname,
      desc: signature,
      sex: gender,
      birth: birthday,
      avatar: avatarUrl,
      loading: false
    })

    const canSubmit = computed(() => {
      const {
        nickname,
        signature,
        gender,
        birthday,
        avatarUrl,
        city,
        province
      } = authProfile.value

      return (
        state.nickname !== nickname ||
        state.desc !== signature ||
        state.sex !== gender ||
        state.birth !== birthday ||
        state.avatar !== avatarUrl
      )
    })
    ;[
      { key: 'nickname', value: 'nickname' },
      { key: 'signature', value: 'desc' },
      { key: 'gender', value: 'sex' },
      { key: 'birthday', value: 'birth' },
      { key: 'avatarUrl', value: 'avatar' }
    ].forEach(({ key, value }: any) => {
      watch(
        () => authProfile.value[key],
        v => (state[value] = v)
      )
    })

    const onNickName = (e: any) => {
      state.nickname = e.target.value
    }

    const onDesc = (e: any) => {
      state.desc = e.target.value
    }

    const onSex = (value: number) => {
      state.sex = value
    }

    const onBirth = (value: number) => {
      state.birth = value
    }

    const onSubmit = async () => {
      state.loading = true
      try {
        const res: any = await updateProfile({
          gender: state.sex,
          signature: state.desc,
          city,
          province,
          nickname: state.nickname,
          birthday: state.birth
        })
        state.loading = false
        if (res.code === 200) {
          updateProfileAction({
            gender: state.sex,
            signature: state.desc,
            nickname: state.nickname,
            birthday: state.birth
          })
          Toast('修改成功')
        }
      } catch (e) {
        state.loading = false
      }
    }

    return () => {
      return (
        <div class="user-setting">
          <div class="user-setting__form">
            <div class="user-setting__info">
              <div class="user-setting__row">
                <span>昵称：</span>
                <Input value={state.nickname} onChange={onNickName}></Input>
              </div>
              <div class="user-setting__row">
                <span>介绍：</span>
                <Input.TextArea
                  value={state.desc}
                  onChange={onDesc}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                ></Input.TextArea>
              </div>
              <div class="user-setting__row">
                <span>性别：</span>
                <div class="row">
                  <SexSelect value={state.sex} onChange={onSex}></SexSelect>
                </div>
              </div>
              <div class="user-setting__row">
                <span>生日：</span>
                <BirthSelect
                  defaultValue={state.birth}
                  onChange={onBirth}
                ></BirthSelect>
              </div>
              {/*<div class="user-setting__row">*/}
              {/*  <span>地区：</span>*/}
              {/*  <AreaSelect></AreaSelect>*/}
              {/*</div>*/}
            </div>
            <div class="user-setting_avatar">
              <Image width={152} height={152} src={state.avatar}></Image>
              <div class="user-setting_avatarbtn">
                <UploadBtn></UploadBtn>
              </div>
            </div>
          </div>

          <div class="user-setting__submit">
            <Button
              shape="round"
              type="primary"
              disabled={!canSubmit.value}
              onClick={onSubmit}
              loading={state.loading}
            >
              保存
            </Button>
            <Button
              shape="round"
              onClick={() => {
                $router.back()
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )
    }
  }
})
