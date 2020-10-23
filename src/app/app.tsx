import { defineComponent } from 'vue'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { Container } from '@/layout/container'
import { FullScreen } from '@/components/full-screen'
import { allInject, useRoute } from '@/hooks'

import '../theme/index'
import './app.less'

const App = () => {
  const { meta } = useRoute()

  return (
    <ErrorBoundary ref="ErrorBoundary">
      {meta.full ? <FullScreen></FullScreen> : <Container></Container>}
    </ErrorBoundary>
  )
}

/* Global Setup */
export default defineComponent({
  setup() {
    allInject()

    return () => <App />
  }
})
