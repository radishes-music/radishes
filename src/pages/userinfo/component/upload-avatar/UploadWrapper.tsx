/**
 * Created by buddy on 2021/2/21.
 */
import { defineComponent, ref } from 'vue'

export const UploadWrapper = defineComponent({
  name: 'UploadWrapper',
  // eslint-disable-next-line vue/require-prop-types
  props: ['onFile'],
  emits: ['file'],
  setup() {
    const input = ref()

    return function (this: any) {
      return (
        <div
          role="button"
          onClick={() => {
            input.value.click()
          }}
        >
          {this.$slots.default?.()}
          <input
            type="file"
            style={{ display: 'none' }}
            ref={input}
            onChange={(e: any) => {
              this.$emit('file', e.target.files)
            }}
          />
        </div>
      )
    }
  }
})
