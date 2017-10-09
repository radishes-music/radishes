<template>

  <div class="right">


    <div class="right_title" v-show="views">
      <ul>
        <li class="elect_li" v-for="item in items_title" v-bind:class="items_title.indexOf(item)===index ? 'elect' : 'no_elect'" @click="elect_index(items_title.indexOf(item))">{{ item }}</li>
      </ul>
      
    </div>

    <component :is="view" SLD="A" v-on:listenChild="showChild"></component>

  </div>
</template>

<script>
import FlexRightBottom from './FlexRight_recommendation'
import FlexRightPlaylist from './FlexRight_playlist'
import FlexRightLeaderboard from './FlexRight_leaderboard'
import FlexRightSinger from './FlexRight_singer'
import FlexRightLatestMusic from './FlexRight_latest_music'

import bus from '../../router/eventBus'

export default {
  name: 'right',
  data () {
    return {
      views: true,
      view: 'FlexRightBottom',
      index: 0,
      items_title: ['个性推荐', '歌单', '排行榜', '歌手', '最新音乐']
    }
  },
  components: {
    'FlexRightBottom': FlexRightBottom,
    'FlexRightPlaylist': FlexRightPlaylist,
    'FlexRightLeaderboard': FlexRightLeaderboard,
    'FlexRightSinger': FlexRightSinger,
    'FlexRightLatestMusic': FlexRightLatestMusic
  },
  methods: {
    elect_index: function (i) {
      bus.$emit('updata', true)
      this.views = true
      this.index = i
      if (i === 0) {
        this.view = 'FlexRightBottom'
      } else if (i === 1) {
        this.view = 'FlexRightPlaylist'
      } else if (i === 2) {
        this.view = 'FlexRightLeaderboard'
      } else if (i === 3) {
        this.view = 'FlexRightSinger'
      } else {
        this.view = 'FlexRightLatestMusic'
      }
    },
    // 监听子组件
    // 取消顶部导航栏
    showChild: function () {
      this.views = false
    }
  },
  mounted: function () {
    bus.$on('left_listen', () => {
      this.views = true
      this.view = 'FlexRightBottom'
      this.index = 0 // 回归到第一个位置
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right {
  position: relative;
  float: right;
  width: 820px;
  height: 520px;
  background-color: rgb(250,250,250);
  overflow: auto;
}

.right_title {
  width: 92%;
  height: 42px;
  margin: 0 auto 0;
  border-bottom: .5px solid #D3D3D3;
}
.right_title ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 60%;
  margin: 0 auto 0;
  padding-top: 12px;
  font-size: 11pt;
  list-style-type: none;
}
.elect_li {
  margin-left: 44px;
  padding-bottom: 8px;
  cursor: pointer;
}
.elect {
  color: rgb(59,168,125);
  padding-bottom: 8px;
  border-bottom: 2px solid rgb(59,168,125);
}

</style>
