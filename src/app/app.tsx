import { defineComponent } from 'vue'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { Container } from '@/layout/container'
import { FullScreen } from '@/components/full-screen'
import './app.less'

export default defineComponent({
  render() {
    const { meta } = this.$route
    return (
      <ErrorBoundary>
        <Container>{meta.full && <FullScreen></FullScreen>}</Container>
      </ErrorBoundary>
    )
  }
})
