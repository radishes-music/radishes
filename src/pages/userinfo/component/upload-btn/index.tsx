/**
 * Created by buddy on 2021/2/22.
 */
import { defineComponent, reactive } from 'vue'
import { Button } from 'ant-design-vue'
import { UploadWrapper } from '@/pages/userinfo/component/upload-avatar/UploadWrapper'
import { UploadAvatar } from '@/pages/userinfo/component/upload-avatar'

// local
export const UploadBtn = defineComponent({
  name: 'UploadBtn',
  setup() {
    const state = reactive({
      file: undefined
    })

    return function () {
      return (
        <>
          <UploadWrapper
            onFile={(file: any) => {
              state.file = file[0]
            }}
          >
            <Button shape="round">修改头像</Button>
          </UploadWrapper>
          {state.file && (
            <UploadAvatar
              defaultImg={state.file}
              onComplete={() => {
                state.file = undefined
              }}
            ></UploadAvatar>
          )}
        </>
      )
    }
  }
})
