import {
  App,
  ComponentOptions,
  defineComponent,
  nextTick,
  ref,
  reactive,
  PropType
} from 'vue'
import './index.less'

const prefix = 'error'

type This = Options & ComponentOptions

interface Options {
  handler?: () => void
  error: boolean
}

interface Methods extends Options {
  handleError: (
    this: This,
    error: boolean,
    runtimeProps: RuntimeErrorComponentProps
  ) => void
}

interface RuntimeErrorComponentProps {
  title: string
  message: string | unknown
}

export function errorHandle(app: App): void {
  app.config.errorHandler = (err, vm, info) => {
    nextTick(() => {
      if (vm && vm.$root) {
        const ErrorBoundary = (vm.$root.$refs
          .ErrorBoundary as unknown) as Methods
        ErrorBoundary.handleError(true, {
          title: info,
          message: err
        })
      }
    })
  }
}

export const RuntimeErrorComponent = defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      required: true
    },
    message: {
      type: Object as PropType<RuntimeErrorComponentProps>,
      required: true
    }
  },
  render(this: RuntimeErrorComponentProps & ComponentOptions) {
    const { title, message } = this.$props
    return (
      <div class={`${prefix}-boundary`}>
        <h1 class={`${prefix}-boundary-title`}>{title}</h1>
        <div class={`${prefix}-boundary-content`}>{message.message}</div>
        <pre class={`${prefix}-boundary-content`}>{message.stack}</pre>
      </div>
    )
  }
})

export const ErrorBoundary = defineComponent<Options>({
  name: 'ErrorBoundary',
  components: {
    RuntimeErrorComponent
  },
  setup() {
    const error = ref(false)
    const runtimeProps = reactive({})
    return {
      error,
      runtimeProps
    }
  },
  methods: {
    handleError(
      this: This,
      error: boolean,
      runtimeProps: RuntimeErrorComponentProps
    ) {
      this.error = error
      this.runtimeProps = runtimeProps
    }
  } as Methods,
  render(this: This) {
    const { error, runtimeProps } = this
    if (error) {
      return (
        <RuntimeErrorComponent
          title={runtimeProps.title}
          message={runtimeProps.message}
        ></RuntimeErrorComponent>
      )
    }
    return this.$slots.default && this.$slots.default()
  }
})
