import { defineComponent } from 'vue'
import './logo.less'

export const Logo = defineComponent({
  name: 'Logo',
  render() {
    return (
      <div class="logo">
        <icon icon="logo-fill" size={132} height={40}></icon>
      </div>
    )
  }
})
