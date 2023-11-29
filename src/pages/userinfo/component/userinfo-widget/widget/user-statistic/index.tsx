/**
 * Created by buddy on 2021/2/25.
 */
import { defineComponent } from 'vue'
import { useRouter } from '@/hooks'
import './index.less'

const Item = ({ info }: any) => {
  if (!info) {
    return <div class="user-statistic__space"></div>
  }
  const { key, value, onClick } = info

  return (
    <div class="user-statistic__box" onClick={onClick}>
      <div class="user-statistic__boxnum">{value}</div>
      <div class="user-statistic__boxtext">{key}</div>
    </div>
  )
}

export const UserStatistic = defineComponent({
  name: 'UserStatistic',
  props: ['eventCount', 'follows', 'followeds', 'uid'],
  setup(props: any) {
    const $router = useRouter()

    const goEvent = () => {
      $router.push(`/eventView/${props.uid}`)
    }

    const goFollow = () => {
      $router.push(`/followList/${props.uid}`)
    }

    const goFollowed = () => {
      $router.push(`/fansView/${props.uid}`)
    }

    return function () {
      const { eventCount, follows, followeds } = props

      return (
        <div class="user-statistic">
          {[
            {
              key: '动态',
              value: eventCount,
              onClick: goEvent
            },
            null,
            {
              key: '关注',
              value: follows,
              onClick: goFollow
            },
            null,
            {
              key: '粉丝',
              value: followeds,
              onClick: goFollowed
            }
          ].map((info: any, index: number) => (
            <Item info={info} key={index}></Item>
          ))}
        </div>
      )
    }
  }
})
