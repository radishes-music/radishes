import { defineComponent } from 'vue'
import README from 'root/README.md'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--about" data-location="about">
        <h2>关于Radishes（{__APP_VERSION__}）</h2>
        <README />
      </div>
    )
  }
})
