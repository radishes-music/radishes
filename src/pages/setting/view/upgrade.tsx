import { defineComponent, ref } from 'vue'
import { Checkbox } from 'vant'
import { Button } from 'ant-design-vue'
import { useSettingModule } from '@/modules'
import { SettingMutations } from '../interface'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { AutoDownload } from '@/electron/event/action-types'

export default defineComponent({
  name: 'Upgrade',
  setup() {
    const newUpgrade = ref(false)
    const { useState, useMutations } = useSettingModule()
    const state = useState()

    const handleChangeUpgrade = (checked: boolean) => {
      useMutations(SettingMutations.SET_UPGRADE, checked)
      asyncIpc().then(v => {
        v.sendAsyncIpcRendererEvent(AutoDownload.IS_UPGRADE, checked)
      })
    }

    const handleCheckUpgrade = () => {
      asyncIpc().then(v => {
        const r = v.sendSyncIpcRendererEvent<{ version: string }>(
          AutoDownload.CHECK_UPGRADE
        )
        if (r.version === VERSION) {
          newUpgrade.value = true
        }
        console.log(r)
      })
    }

    return () => (
      <div
        class="setting-view-contanier--upgrade"
        data-location="upgrade"
        data-platform="electron"
      >
        <h2>自动更新</h2>
        <div class="setting-view-description">
          勾选自动更新可以拥有最完美的体验，还会修复一些已知问题。
        </div>
        <div class="upgrade-basic">
          <Checkbox
            v-model={state.upgrade}
            shape="square"
            checked-color="var(--base-color)"
            icon-size="16px"
            onChange={handleChangeUpgrade}
          >
            自动更新
          </Checkbox>
        </div>
        <div class="upgrade-check">
          <Button
            type="primary"
            size="small"
            v-slots={{
              icon: () => <icon icon="upgrade" size={16} />
            }}
            onClick={handleCheckUpgrade}
          >
            <span>检查更新</span>
          </Button>
          {newUpgrade.value && <p>恭喜，已经是最新版本。</p>}
        </div>
      </div>
    )
  }
})
