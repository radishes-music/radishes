import { Dialog } from '@/electron/event/action-types'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { DownloadMutations, SettingMutations } from '@/interface'
import { useDownloadModule, useSettingModule } from '@/modules'
import { RadioGroup, Radio } from 'vant'
import { defineComponent } from 'vue'
import { isBrowser } from '@/utils'

export default defineComponent({
  setup() {
    const { useState, useMutations } = useSettingModule()
    const downloadModule = useDownloadModule()
    const state = useState()
    const downloadState = downloadModule.useState()

    const bitRateAll = [
      {
        bit: 1.28e5,
        name: '128K'
      },
      {
        bit: 3.2e5,
        name: '320K'
      }
    ]

    const handleOpenDialog = async () => {
      const ipc = await asyncIpc()
      const dir = ipc.sendSyncIpcRendererEvent(
        Dialog.SHOW_DIALOG
      ) as Electron.OpenDialogReturnValue
      if (!dir.canceled) {
        const path = dir.filePaths[0]
        downloadModule.useMutations(DownloadMutations.SET_DOWNLOAD_PATH, path)
      }
    }

    const handleChangeBit = (bit: number) => {
      useMutations(SettingMutations.SET_BIT_RATE, bit)
    }

    return () => (
      <div
        class="setting-view-contanier--setting"
        data-location="download"
        data-platform="electron"
      >
        <h2>下载设置</h2>
        <div class="setting-view-description">
          下载设置可以帮助你选择不同的文件夹以保存下载的歌曲，还可以选择不同音质的歌曲进行下载。（目前只支持网易云的播放源）
        </div>
        <div class="download-quality vchj">
          下载品质：
          <RadioGroup
            direction="horizontal"
            v-model={state.bitRate}
            onChange={handleChangeBit}
          >
            {bitRateAll.map(item => (
              <Radio
                name={item.bit}
                shape="square"
                checked-color="var(--base-color)"
                icon-size="12px"
              >
                {item.name}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div class="download-path">
          下载目录：{downloadState.downloadPath}
          <ve-button
            type="text"
            onClick={handleOpenDialog}
            disabled={isBrowser}
          >
            更改目录
          </ve-button>
        </div>
      </div>
    )
  }
})
