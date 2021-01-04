import { isMobile } from '@/utils/index'

if (window) {
  window.isMobile = isMobile()
}

// Import app using asynchronous method
import('./app/index')
