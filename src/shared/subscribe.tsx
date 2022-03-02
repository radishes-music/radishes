/* eslint-disable @typescript-eslint/no-unused-vars */
import { subscribePlaylist, subscribeSingle, userPlaylist } from '@/api'
import { isLogin } from '@/helpers/index'
import { useAuthView, useAuth } from '@/hooks/index'
import { success } from '@/hooks'
import { syncToAsync } from '@/utils/index'
import { Modal } from 'ant-design-vue'
import { Song } from '@/interface'
import { ref } from 'vue'
import classnames from 'classnames'
import './subscribe.less'

export type SubscribeActionType = '1' | '2'

export const useSubscribe = (isSingle: boolean) => {
  const viewLogin = useAuthView()
  const user = useAuth()

  return async (type: SubscribeActionType, id: number) => {
    if (!isLogin()) {
      viewLogin(true)
      return false
    }
    if (isSingle) {
      const userSub = await userPlaylist(user.account.value.id)
      // const selected = await syncToAsync(resolve => {
      //   const select = ref({
      //     id: -1
      //   })
      //   const modal = Modal.confirm({
      //     title: '添加到歌单',
      //     icon: '',
      //     centered: true,
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk: () => {
      //       resolve(select.value)
      //       modal.destroy()
      //     },
      //     content: (
      //       <ul class="optional-playlist">
      //         {userSub.map(item => (
      //           <li
      //             data-id={String(item.id)}
      //             class={classnames({
      //               'active-selected': item.id === select.value.id
      //             })}
      //             onClick={() => {
      //               select.value = item
      //               document
      //                 .querySelector('.active-selected')
      //                 ?.classList.remove('active-selected')
      //               document
      //                 .querySelector(
      //                   `.optional-playlist li[data-id="${item.id}"]`
      //                 )
      //                 ?.classList.add('active-selected')
      //             }}
      //           >
      //             {item.name}
      //           </li>
      //         ))}
      //       </ul>
      //     )
      //   })
      // })
      // console.log(selected)
      // if (selected) {
      //   await subscribeSingle(type, (selected as Song).id, [id])
      // }
      const like = userSub.find(o => o.specialType === 5)
      if (like) {
        await subscribeSingle(type, like.id, [id])
      }
    } else {
      await subscribePlaylist(type, id)
    }
    success(type === '1' ? '收藏成功' : '取消收藏成功')
    return true
  }
}
