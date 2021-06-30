import { defineComponent, ref } from 'vue'
import { Checkbox } from 'vant'
import { Button } from 'ant-design-vue'
import { useSettingModule } from '@/modules'
import { SettingMutations } from '../interface'
import { asyncIpc, asyncIpcOrigin } from '@/electron/event/ipc-browser'
import { AutoDownload } from '@/electron/event/action-types'
import { newsVersion, isBrowser, isElectron } from '@/utils/index'

export default defineComponent({
  name: 'Upgrade',
  setup() {
    const newUpgrade = ref(false)
    const upgrading = ref(false)
    const { useState, useMutations } = useSettingModule()
    const state = useState()

    if (isElectron) {
      asyncIpcOrigin().then(ipc => {
        ipc.on(AutoDownload.CHECK_UPGRADE, (e, v) => {
          upgrading.value = false
          if (!newsVersion(v.version, VERSION)) {
            newUpgrade.value = true
          }
        })
      })
    }

    const handleChangeUpgrade = (checked: boolean) => {
      useMutations(SettingMutations.SET_UPGRADE, checked)
      asyncIpc().then(v => {
        v.sendAsyncIpcRendererEvent(AutoDownload.IS_UPGRADE, checked)
      })
    }

    const handleCheckUpgrade = () => {
      upgrading.value = true
      asyncIpc().then(v => {
        v.sendAsyncIpcRendererEvent(AutoDownload.CHECK_UPGRADE)
      })
    }

    return () => (
      <div
        class="setting-view-contanier--upgrade"
        data-location="upgrade"
        data-platform="electron"
      >
        <h2>{j18n.load('src__pages__setting__view__upgrade___48')}</h2>
        <div class="setting-view-description">
          {j18n.load('src__pages__setting__view__upgrade___50')}。
        </div>
        <div class="upgrade-basic">
          <Checkbox
            v-model={state.upgrade}
            shape="square"
            checked-color="var(--base-color)"
            icon-size="16px"
            onChange={handleChangeUpgrade}
            disabled={isBrowser}
          >
            {j18n.load('src__pages__setting__view__upgrade___61')}
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
            loading={upgrading.value}
            disabled={isBrowser}
          >
            <span>{j18n.load('src__pages__setting__view__upgrade___75')}</span>
          </Button>
          {newUpgrade.value && (
            <p>{j18n.load('src__pages__setting__view__upgrade___77')}</p>
          )}
        </div>
      </div>
    )
  }
})
