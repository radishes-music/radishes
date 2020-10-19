import { defineComponent } from 'vue'
export { Mv } from '../children/mv/view/index'

export const Video = defineComponent({
  name: 'Video',
  render() {
    return (
      <div class="video">
        <router-view></router-view>
      </div>
    )
  }
})
