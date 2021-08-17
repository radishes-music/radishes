import { defineComponent } from 'vue'
import README from 'root/README.md'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--about" data-location="about">
        <h2>{$t('src__pages__setting__view__about___7', VERSION)}</h2>
        <README />
      </div>
    )
  }
})
