import { App } from 'vue'
import Icon from './icon/index'

export interface Component {
  name: string
}

export interface Option {
  [key: string]: any
}

export const components: Component[] = [Icon]

const install = (app: App, option: Option) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install
}
