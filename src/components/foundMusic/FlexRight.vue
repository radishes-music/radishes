<template>

  <div class="right">


    <div class="right_title" v-show="views & isTop">
      <ul>
        <li class="elect_li" v-for="item in items_title" v-bind:class="items_title.indexOf(item)===index ? 'elect' : 'no_elect'" @click="elect_index(items_title.indexOf(item), true)">{{ item }}</li>
      </ul>
    </div>

    <component :is="view" v-show="views" SLD="A" v-on:listenChild="showChild"></component>
    
    <component :is="otherView" v-show="!views"></component>

  </div>
</template>

<script>
import FlexRightBottom from './FlexRight_recommendation'
import FlexRightPlaylist from './FlexRight_playlist'
import FlexRightLeaderboard from './FlexRight_leaderboard'
import FlexRightSinger from './FlexRight_singer'
import FlexRightLatestMusic from './FlexRight_latest_music'
import FlexRightDownFile from '../downFile/downLoad'
import PersonalList from '../SongListDetails/PersonalList'
import wyListDetails from '../SongListDetails/wyListDetails'
import Fm from '../FM/Fm'
import Mv from '../MV/Mv'
import Friend from '../Friend/Friend'

import bus from '../../router/eventBus'

export default {
  name: 'right',
  data () {
    return {
      views: true,
      isTop: true,
      isFlexDown: false,
      isSongList: false,
      view: 'FlexRightBottom',
      otherView: '',
      index: 0,
      items_title: ['个性推荐', '歌单', '排行榜', '歌手', '最新音乐']
    }
  },
  components: {
    'FlexRightBottom': FlexRightBottom,
    'FlexRightPlaylist': FlexRightPlaylist,
    'FlexRightLeaderboard': FlexRightLeaderboard,
    'FlexRightSinger': FlexRightSinger,
    'FlexRightLatestMusic': FlexRightLatestMusic,
    'FlexRightDownFile': FlexRightDownFile,
    'PersonalList': PersonalList,
    'wyListDetails': wyListDetails,
    'Fm': Fm,
    'Mv': Mv,
    'Friend': Friend
  },
  methods: {
    elect_index: function (i, c) {
      global.layoutValue = i
      let electLi = document.querySelectorAll('.elect_li')
      for (let j = 0; j < electLi.length; j++) {
        if (j === i) {
          electLi[j].style.color = global.colors
          electLi[j].style.borderBottom = '2px solid ' + global.colors
        } else {
          electLi[j].style.color = ''
          electLi[j].style.borderBottom = ''
          electLi[j].style.paddingBottom = ''
        }
      }
      if (c) {
        // 防止顶部返回与前进出现bug
        if (i !== this.index) global.userRecord.push(i)
        // console.log(global.userRecord)
        bus.$emit('updata', true)
      }
      this.views = true
      this.index = i
    },
    // 监听子组件
    // 取消顶部导航栏
    showChild: function () {
      this.views = false
    }
  },
  mounted: function () {
    bus.$on('hideTop', (e) => {
      e ? this.isTop = false : this.isTop = true
    })
    bus.$on('title_listen', (e) => {
      // console.log('listen', e)
      this.elect_index(e, false)
    })
    bus.$on('left_listen', (e) => {
      this.isTop = true
      if (e[0] === 0) {
        this.views = true
        this.view = 'FlexRightBottom'
        // this.index = 0 // 回归到第一个位置
      } else if (e[0] === 1) {
        this.views = false
        this.otherView = 'Fm'
      } else if (e[0] === 2) {
        this.views = false
        this.otherView = 'Mv'
      } else if (e[0] === 3) {
        this.views = false
        this.otherView = 'Friend'
      } else if (e[0] >= 9) {
        this.views = false
        if (e[1]) {
          console.log(e[2])
          bus.$emit('Wyindex', e[2])
          this.otherView = 'wyListDetails'
        } else {
          this.otherView = 'PersonalList'
        }
      } else {
        this.views = false
        this.otherView = 'FlexRightDownFile'
      }
    })
    bus.$on('setColor', (e) => {
      this.color = e[1]
    })
    let electLi = document.querySelectorAll('.elect_li')
    electLi[0].style.color = global.colors
    electLi[0].style.borderBottom = '2px solid ' + global.colors
    bus.$on('updataPlay', () => {
      for (let j = 0; j < electLi.length; j++) {
        if (j === this.index) {
          electLi[j].style.color = global.colors
          electLi[j].style.borderBottom = '2px solid ' + global.colors
        } else {
          electLi[j].style.color = ''
          electLi[j].style.borderBottom = ''
          electLi[j].style.paddingBottom = ''
        }
      }
    })
    this.index = global.layoutValue
  },
  updated: function () {
    this.index = global.layoutValue
    switch (this.index) {
      case 0 : this.view = 'FlexRightBottom'; break
      case 1 : this.view = 'FlexRightPlaylist'; break
      case 2 : this.view = 'FlexRightLeaderboard'; break
      case 3 : this.view = 'FlexRightSinger'; break
      case 4 : this.view = 'FlexRightLatestMusic'; break
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes mymove {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.right {
  position: relative;
  float: right;
  width: 820px;
  height: 520px;
  opacity: 1;
  animation: mymove .4s;
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
</style>
