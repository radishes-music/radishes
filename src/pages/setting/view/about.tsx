import { defineComponent } from 'vue'
import README from 'root/README.md'
import { isElectron } from '@/utils'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--about" data-location="about">
        {/* {isElectron && (
          <>
            <span style="font-weight:bold;font-size:16px;"> 环境版本</span>
            <p>
              <span style="font-weight:bold">Electron</span> v
              {electronAPI.electron()}{' '}
              <span style="font-weight:bold"> Node</span> v{electronAPI.node()}{' '}
              <span style="font-weight:bold">Chrome</span> v
              {electronAPI.chrome()}{' '}
            </p>
          </>
        )} */}
        <p></p>
        <h2>关于Radishes（{__APP_VERSION__}）</h2>
        <README />
      </div>
    )
  }
})
