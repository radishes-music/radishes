import { App } from 'vue'
import main from './main/index'

main.install = (app: App) => {
  app.component(main.name, main)
}

export default main
