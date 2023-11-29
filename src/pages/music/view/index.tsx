import { defineComponent, nextTick, ref, watch } from 'vue'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import { navRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import { MusicLayout } from '@/layout/music/music'
import { Modal } from 'ant-design-vue'
import { CheckboxGroup, Checkbox, Button } from 'vant'
import { useDrag } from '@/hooks/index'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { Dialog } from '@/electron/event/action-types'
import { useLocalMusicModule } from '@/modules'
import { LocalMusicMutations } from '../interface'
import './index.less'

export const LocalMusic = defineComponent({
  name: 'LocalMusic',
  setup() {
    const { useState, useMutations } = useLocalMusicModule()
    const state = useState()
    const nav = renderNavList(navRouter, LocalMusic.name)
    const modalContanier = ref()
    const visibleDirectory = ref(false)
    const checkPath = ref(
      state.localPath.filter(item => item.check).map(item => item.path)
    )

    watch(visibleDirectory, visible => {
      if (visible) {
        nextTick(() => {
          if (modalContanier.value) {
            const el = modalContanier.value as HTMLElement
            const contanier = el?.parentElement?.parentElement
            const head =
              contanier?.querySelector<HTMLElement>('.ant-modal-header')
            if (contanier && head) {
              const { start } = useDrag(contanier, head, {
                moveCB(x, y) {
                  requestAnimationFrame(() => {
                    if (el.parentElement && el.parentElement.parentElement) {
                      el.parentElement.parentElement.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
                    }
                  })
                }
              })
              start()
            }
          }
        })
      }
    })

    const handleAddDirectory = async () => {
      const ipc = await asyncIpc()
      const dir = ipc.sendSyncIpcRendererEvent(
        Dialog.SHOW_DIALOG
      ) as Electron.OpenDialogReturnValue
      if (!dir.canceled) {
        const path = dir.filePaths[0]
        const pathSingle = {
          name: path,
          path: path,
          check: true
        }
        checkPath.value.push(path)
        useMutations(LocalMusicMutations.SET_LOCAL_INCREMENT_PATH, pathSingle)
      }
    }

    const handleCloseModal = () => {
      visibleDirectory.value = false
    }

    const handleConfirm = async () => {
      const songs = await electronAPI.readPathMusic(checkPath.value)

      useMutations(LocalMusicMutations.SET_LOCAL_MUSIC, songs)
      visibleDirectory.value = false
    }

    return () => (
      <MusicLayout
        v-slots={{
          title: () => (
            <>
              <div>本地音乐</div>
              <ve-button
                type="text"
                onClick={() =>
                  (visibleDirectory.value = !visibleDirectory.value)
                }
              >
                选择目录
              </ve-button>
              <Modal
                title="选择目录"
                footer={null}
                visible={visibleDirectory.value}
                onCancel={handleCloseModal}
                maskClosable={false}
                mask={false}
              >
                <div class="local-music-directory" ref={modalContanier}>
                  <div class="local-music-directory-description">
                    将自动扫描您勾选的目录，文件增删实时同步。
                  </div>
                  <CheckboxGroup
                    v-model={checkPath.value}
                    class="local-music-directory-group"
                  >
                    {state.localPath.map(item => (
                      <Checkbox
                        name={item.path}
                        shape="square"
                        checked-color="var(--base-color)"
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  <div class="local-music-directory-footer">
                    <Button
                      round
                      type="primary"
                      color="var(--base-color)"
                      onClick={handleConfirm}
                    >
                      确认
                    </Button>
                    <Button
                      plain
                      hairline
                      round
                      type="primary"
                      color="var(--base-color)"
                      onClick={handleAddDirectory}
                    >
                      添加文件夹
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          ),
          head: () => <SecondaryBar nav={nav} size="small" />,
          body: () => <RouterView />
        }}
      />
    )
  }
})
