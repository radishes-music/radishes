import { defineComponent, computed, reactive } from 'vue'

export const FindMusic = defineComponent({
  render() {
    return (
      <div class="find-music">
        <router-view></router-view>
      </div>
    )
  }
})
