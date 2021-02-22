/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent } from 'vue'
import { Button, Image, Tag } from 'vant'
import Icon from '@/components-global/icon/main'
import './index.less'

export const FollowCard = defineComponent({
  name: 'FollowCard',
  props: ['info'],
  setup() {
    return function(this: any) {
      const { info } = this

      return (
        <div class="follow-card">
          <div class="follow-card__avatar">
            <Image
              width="90"
              height="90"
              round
              fit="cover"
              src={info.avatar}
            ></Image>
            {info.avatarIcon && (
              <Image
                width="22"
                height="22"
                src={info.avatarIcon}
                class="follow-card__avataricon"
              ></Image>
            )}
          </div>
          <div class="follow-card__info">
            <div class="follow-card__title">
              <div class="follow-card__name">{info.nickname}</div>
              {info.vip > 0 && (
                <Tag color="#131313" text-color="#ffe3df">
                  vip {info.vip}
                </Tag>
              )}
            </div>
            <div class="follow-card__desc">{info.signature}</div>
            <div>
              歌单：{info.playlistCount} | 粉丝：{info.followeds}
            </div>
          </div>
          <Button disabled round class="follow-card__btn">
            <div class="follow-card__btnc">
              <Icon icon="email" color="#333" size={16}></Icon>
              私信
            </div>
          </Button>
        </div>
      )
    }
  }
})
