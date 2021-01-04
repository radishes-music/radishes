import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--author" data-location="author">
        <h2>作者</h2>
        <ul>
          <li>
            <a href="https://github.com/little-buddy" target="_blank">
              Buddy
            </a>
          </li>
          <li>
            <a href="https://github.com/Linkontoask" target="_blank">
              Link
            </a>
          </li>
        </ul>
      </div>
    )
  }
})
