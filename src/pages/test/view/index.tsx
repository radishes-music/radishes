import { defineComponent } from 'vue'

export const TestFull = defineComponent({
  render() {
    throw 'runtime error tarck'
    return (
      <div class="test-full">
        <h1>TestFull</h1>
      </div>
    )
  }
})
