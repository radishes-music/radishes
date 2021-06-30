/**
 * Created by buddy on 2021/2/25.
 */
import { useRouter } from '@/hooks'
import { Button } from 'ant-design-vue'
import Icon from '@/components-global/icon/main'

import './index.less'

// TODO edit 按钮操作
export const EditBtn = () => {
  const $router = useRouter()
  const toEdit = () => {
    $router.push('/userSetting')
  }
  return (
    <Button shape="round" class="user-btn" onClick={toEdit}>
      <Icon icon="qianbi" color="auto" size={20}></Icon>
      {j18n.load(
        'src__pages__userinfo__component__userinfo-widget__widget__btn__index___18'
      )}
    </Button>
  )
}

// TODO 私信按钮
export const SmsBtn = () => {
  return (
    <Button shape="round" class="user-btn">
      <Icon icon="email" color="auto" size={20}></Icon>
      {j18n.load(
        'src__pages__userinfo__component__userinfo-widget__widget__btn__index___28'
      )}
    </Button>
  )
}

// TODO 关注，这里需要控制查看人员与用户之间的关系
// TODO 一个打钩 一个+
export const FollowBtn = ({ checked, onClick }: any) => {
  return (
    <Button shape="round" class="user-btn" onClick={onClick}>
      <Icon icon={checked ? 'tick' : 'add'} color="auto" size={20}></Icon>
      {checked
        ? j18n.load(
            'src__pages__userinfo__component__userinfo-widget__widget__btn__index___39____2'
          )
        : j18n.load(
            'src__pages__userinfo__component__userinfo-widget__widget__btn__index___39'
          )}
    </Button>
  )
}

export const MoreBtn = () => (
  <Button shape="round" class="user-btn user-btn__more">
    ...
  </Button>
)

// TODO 由于暂时不清楚歌手页的判断标志，所以暂时不显示该按钮
export const SingerBtn = () => (
  <Button shape="round" class="user-btn">
    {j18n.load(
      'src__pages__userinfo__component__userinfo-widget__widget__btn__index___53'
    )}
  </Button>
)
