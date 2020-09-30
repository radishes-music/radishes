import { defineComponent, App } from 'vue'

interface Props {
  handler?: () => void
}

export function errorHandle(app: App): void {
  app.config.errorHandler = (err, vm, info) => {
    console.log(err, vm, info)
  }
}

export const ErrorBoundary = defineComponent<Props>({
  render() {
    return this.$slots.default && this.$slots.default()
  }
})
