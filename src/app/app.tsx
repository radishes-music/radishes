import { defineComponent } from 'vue'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { Container } from '@/layout/container'

import '@/theme/index'
import './app.less'

/* Global Setup */
export default defineComponent({
  name: 'APP',
  setup() {
    return () => (
      // @ts-expect-error
      <ErrorBoundary ref="ErrorBoundary">
        <Container />
      </ErrorBoundary>
    )
  }
})
