import { defineComponent } from 'vue'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { Container } from '@/layout/container'
import { FullScreen } from '@/components/full-screen'
import { useRoute } from '@/hooks'

import '../theme/index'
import './app.less'

/* Global Setup */
export default defineComponent({
  name: 'APP',
  setup() {
    const { meta } = useRoute()
    return () => (
      <ErrorBoundary ref="ErrorBoundary">
        {meta.full ? <FullScreen></FullScreen> : <Container></Container>}
      </ErrorBoundary>
    )
  }
})
