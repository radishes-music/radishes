import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Keyword',
  props: {
    text: {
      type: String as PropType<string>,
      default: ''
    },
    keyword: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    return () => (
      <span
        v-html={props.text.replace(
          props.keyword,
          `<strong class="keyword">${props.keyword}</strong>`
        )}
      ></span>
    )
  }
})
