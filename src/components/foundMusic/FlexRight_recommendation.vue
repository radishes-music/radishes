<template>
  <div class="right_bottom">

    <div class="slideshow" v-show="isView">
      <ul>
        <li class="slideshow_li" v-for="item in items_img_src" v-bind:class="items_img_src.indexOf(item)===index_img ? 'on' :'off'" v-on:mouseenter="clenar" v-on:mouseleave="runTimer"><img v-bind:src="item"></li>
      </ul>
      <div class="btn btn-left" @click="left" v-on:mouseenter="clenar" v-on:mouseleave="runTimer"></div>
      <div class="btn btn-right" @click="right" v-on:mouseenter="clenar" v-on:mouseleave="runTimer"></div>
      <div class="align">
        <ul>
          <li class="align_li" v-for="item in items_img_src" v-bind:class="items_img_src.indexOf(item)===index_img ? 'onli' : 'offli'" v-on:mouseover="onclick(items_img_src.indexOf(item))" v-on:mouseenter="clenar" v-on:mouseleave="runTimer"></li>
        </ul>
      </div>
    </div>

    <div class="right_recommend" v-show="isView">
      <p class="right_recommend_title">推荐歌单</p>
      <div class="recommend">
          <li class="recommend_li" v-for="item in recommend" @click="backChild(recommend.indexOf(item))">
            <img v-bind:src="item.user_avatar" alt="图片拉取失败" v-bind:title="item.intro">
            <p>{{ item.specialname }}</p>
          </li>
      </div>
    </div>

    <SongListDetails v-show="!isView"></SongListDetails>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import SongListDetails from '../SongListDetails/SongListDetails'
import publicFn from '../Data/getData'

export default {
  data () {
    return {
      // 是否显示当前组件
      isView: true,
      // 记录图片下标
      index: 0,
      // 记录是哪一张
      index_img: 0,
      // 定时器ID
      sWaarp: 1,
      // 图片地址
      items_img_src: [
        'http://www.linkorg.club/onWeb/public/External/testImgr/1.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/2.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/3.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/4.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/5.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/6.jpg',
        'http://www.linkorg.club/onWeb/public/External/testImgr/7.jpg'
      ],
      // 获取到的歌单信息
      recommend: [],
      // 记录歌单ID
      playlistId: []
    }
  },
  // 'SongListDetails': SongListDetails
  components: {
    // 组件实例化
    'SongListDetails': SongListDetails
  },
  methods: {
    // 显示上一张图片
    left: function () {
      this.index_img === 0 ? this.index_img = this.items_img_src.length - 1 : this.index_img--
    },
    // 显示下一张图片
    right: function () {
      this.index_img === this.items_img_src.length - 1 ? this.index_img = 0 : this.index_img++
    },
    // 轮播导航
    onclick: function (i) {
      this.index_img = i
    },
    // 取消定时器
    clenar: function () {
      clearInterval(this.sWaarp)
    },
    // 启动定时器
    runTimer: function () {
      this.sWaarp = setInterval(() => {
        this.index_img === this.ii - 1 ? this.index_img = 0 : this.index_img++
      }, 3000)
    },
    backChild: function (i) {
      this.isView = false
      // 取消顶部导航栏
      bus.$emit('index', [this.playlistId[i], this.recommend[i].user_avatar, this.recommend[i].specialname, this.recommend[i].intro])
    }
  },
  mounted: function () {
    this.ii = this.items_img_src.length
    // 轮播
    this.$nextTick(() => {
      this.sWaarp = setInterval(() => {
        this.index_img === this.ii - 1 ? this.index_img = 0 : this.index_img++
      }, 3000)
    })
    // 防止数据重合
    for (let i = this.recommend.length - 1; i >= 0; i--) {
      this.recommend.splice(i, 1)
    }
    // 封装获取歌单函数
    publicFn.getPlaylist(this.recommend, this.playlistId, true)
    // 监听左边点击是否回到初始窗口
    bus.$on('left_listen', () => {
      this.isView = true
    })
    // 监听是否显示当前组件显示
    bus.$on('updata', (e) => {
      if (e) {
        this.isView = true
      }
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
  height: 572px;
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

.slideshow {
  position: relative;
  margin: 0 auto 0;
  width: 96%;
  height: 210px;
}
.slideshow_li {
  position: absolute;
  width: 540px;
  left: 112px;
  list-style-type: none;
  overflow: hidden;
  transition: all 1s;
  opacity: 0;
}

.btn {
  position: absolute;
  top: 74px;
  cursor: pointer;
  width: 52px;
  height: 54px;
  opacity: .4;
  transition: all .4s;
}
.btn:hover {
  opacity: 1;
}
.btn-left {
  left: 0;
  background: url(../../assets/right/left.png) no-repeat center;
}
.btn-right {
  right: 0;
  background: url(../../assets/right/right.png) no-repeat center;
}

.align {
  position: absolute;
  bottom: 0;
  left: 262px;
}

.align_li {
  float: left;
  margin-left: 4px;
  width: 20px;
  height: 2px;
  transition: all .4s;
  list-style-type: none;
  cursor: pointer;
}

.right_recommend {
  position: relative;
  margin: 0 auto 0;
  width: 96%;
  height: 252px;
}
.right_recommend_title {
  text-align: left;
  color: rgb(51,51,51);
  font-size: 12pt;
  padding-bottom: 8px;
  border-bottom: .5px solid #D3D3D3;
}
.recommend {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 414px;
  margin-bottom: 24px;
}
.recommend_li {
  width: 140px;
  height: 178px;
  list-style-type: none;
  cursor: pointer;
}
.recommend_li img {
  width: 138px;
  height: 138px;
  border: .5px solid #D3D3D3;
}
.recommend_li p {
  text-align: left;
  margin: 0;
  font-size: 10pt;
  font-weight: 500;
}

.on {
  opacity: 1;
}
.off {
  opacity: 0;
}
.offli {
  background-color: #ccc;
}
.onli {
  background-color: rgb(59,168,125);
}
</style>
