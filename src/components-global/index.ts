import { App } from 'vue'
import Icon from './icon/index'

export interface Component {
  name: string
}

export const components: Component[] = [Icon]

const install = (app: App) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install
}
