import { defineComponent } from 'vue'
import { mapMutations, LayoutActions, mapState } from '@/layout/module'
import './index.less'

export const Footer = defineComponent({
  name: 'Footer',
  computed: {
    ...mapState(['rebackSize'])
  },
  methods: {
    ...mapMutations({
      changeWindowSize: LayoutActions.CHANGE_WINDOW_SIZE
    })
  },
  render() {
    return (
      <footer class="footer">
        <div class="footer-reduction">
          <ve-button
            size="small"
            onClick={() => this.changeWindowSize(this.rebackSize)}
          >
            <icon icon="fullscreen2" color="#000"></icon>
          </ve-button>
        </div>
      </footer>
    )
  }
})
