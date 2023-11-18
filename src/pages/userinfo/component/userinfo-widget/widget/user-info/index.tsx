/**
 * Created by buddy on 2021/2/27.
 */
import { defineComponent } from 'vue'
import { Image } from 'vant'
import {
  LevelTag,
  SexTag,
  UserTag
} from '@/pages/userinfo/component/userinfo-widget/widget/user-tag/UserTag'
import {
  EditBtn,
  FollowBtn,
  MoreBtn,
  SmsBtn
} from '@/pages/userinfo/component/userinfo-widget/widget/btn'
import { UserStatistic } from '@/pages/userinfo/component/userinfo-widget/widget/user-statistic'
import { OverflowText } from '@/components/overflow-text'
import { useIsSelf } from '@/hooks'
import './index.less'

export const UserInfo = defineComponent({
  name: 'UserInfo',
  props: ['profile'],
  setup(props) {
    const isSelf = useIsSelf(() => props.profile?.userId)

    return function () {
      const { profile } = props

      return (
        <div class="userinfo-view__info">
          <div>
            <Image
              width={200}
              height={200}
              src={profile.avatarUrl}
              round
            ></Image>
          </div>
          <div class="userinfo-view__inforight">
            <div class="userinfo-view__nickname">{profile.nickname}</div>
            <div class="userinfo-view__editview">
              <div class="userinfo-view__tags">
                {(profile.allAuthTypes || []).map(
                  (info: any, index: number) => (
                    <UserTag info={info} key={index}></UserTag>
                  )
                )}
                <LevelTag level={profile.level}></LevelTag>
                <SexTag sex={profile.gender}></SexTag>
              </div>
              <div class="userinfo-view__btns">
                {isSelf.value ? (
                  <EditBtn></EditBtn>
                ) : (
                  <>
                    <SmsBtn></SmsBtn>
                    <FollowBtn></FollowBtn>
                    <MoreBtn></MoreBtn>
                  </>
                )}
              </div>
            </div>
            <UserStatistic
              followeds={profile.followeds}
              follows={profile.follows}
              eventCount={profile.eventCount}
              uid={profile.userId}
            ></UserStatistic>
            {/*TODO 需要了解网易云地区标准*/}
            <div>
              <span>所在地区：</span>
              <span style={{ color: '#777' }}>【TODO】</span>
            </div>
            {/*TODO 不支持*/}
            <div>
              <span>社交网络：</span>
              <span style={{ color: '#777' }}>【TODO】</span>
            </div>
            <OverflowText>
              <span>个人介绍：</span>
              <span style={{ color: '#777' }}>{profile.signature}</span>
            </OverflowText>
          </div>
        </div>
      )
    }
  }
})
