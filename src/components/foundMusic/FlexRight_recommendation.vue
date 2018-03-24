<template>
  <div class="right_bottom">

    <div class="slideshow" v-show="isView">
      <ul>
        <li class="slideshow_li" v-for="item in items_img_src"><img v-bind:src="item"></li>
      </ul>
      <div class="btn btn-left" @click="left"></div>
      <div class="btn btn-right" @click="right"></div>
      <div class="align">
        <ul>
          <li class="align_li" v-for="(item, index) in items_img_src" v-bind:class="index===index_img ? 'onli' : 'offli'"></li>
        </ul>
      </div>
    </div>

    <div class="right_recommend" v-show="isView & !isWyView">
      <p class="right_recommend_title">推荐歌单</p>
      <div class="recommend">
          <li class="recommend_li" v-for="item in recommend" @click="backChild(recommend.indexOf(item))">
            <img class="reImg" v-bind:src="item.user_avatar" alt="图片拉取失败" v-bind:title="item.intro">
            <p>{{ item.specialname }}</p>
          </li>
      </div>
    </div>
    
    <!--登录网易后显示的数据-->
    <div class="right_recommend" v-show="isView & isWyView">
      <p class="right_recommend_title">推荐歌单</p>
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="!isImg">
      <div class="recommend" v-show="isImg">
          <li class="recommend_li" @click="daySong">
            <strong>根据您的音乐口味生成,每日更新</strong>
            <span>{{ new Date().getDate() }}</span>
            <p>每日歌曲推荐</p>
          </li>
          <li class="recommend_li" v-for="(item, index) in recommendList" @click="wyList(index)">
            <strong>{{ item.copywriter }}</strong>
            <img class="reImg" v-bind:src="item.picUrl" alt="图片拉取失败" v-bind:title="item.copywriter">
            <a><img class="reRT" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png"><p>{{ parseInt(item.playCount / 10000) + '万' }}</p></a>
            <p>{{ item.name }}</p>
          </li>
      </div>
    </div>

    <SongListDetails v-show="!isView & !isWyList & !isWyDay"></SongListDetails>

    <WyListDetails v-show="!isView & isWyList & !isWyDay"></WyListDetails>

    <WyDay v-show="!isView & !isWyList & isWyDay"></WyDay>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import SongListDetails from '../SongListDetails/SongListDetails'
import WyListDetails from '../SongListDetails/wyListDetails'
import WyDay from '../SongListDetails/wyDay'
import publicFn from '../Data/getData'
import GetMvData from '../Data/WyGetData'

export default {
  data () {
    return {
      // 是否显示当前组件
      isView: true,
      // 登录后显示
      isWyView: false,
      // 是否显示网易歌单详细信息
      isWyList: false,
      // 每日推荐歌曲
      isWyDay: false,
      isImg: false,
      // 记录图片下标
      index: 0,
      // 记录是哪一张
      index_img: 0,
      // 定时器ID
      sWaarp: 1,
      // 图片地址
      items_img_src: ['http://p4.music.126.net/tGPljf-IMOCyPvumoWLOTg==/7987951976374270.jpg'],
      // 获取到的歌单信息
      recommend: [],
      // 记录歌单ID
      playlistId: [],
      // 网易音乐数据保存
      daySongs: [], // 每日歌曲
      recommendList: [] // 推荐歌单
    }
  },
  // 'SongListDetails': SongListDetails
  components: {
    // 组件实例化
    'SongListDetails': SongListDetails,
    'WyListDetails': WyListDetails,
    'WyDay': WyDay
  },
  watch: {
    index_img: {
      handler (curVal, oldVal) {
        let alignLi = document.querySelectorAll('.align_li')
        alignLi[oldVal].style.background = '#cccccc'
        alignLi[curVal].style.background = global.colors
      },
      deep: true
    }
  },
  methods: {
    // 显示上一张图片
    left: function () {
      this.index_img === 0 ? this.index_img = this.items_img_src.length - 1 : this.index_img--
      this.fuck3()
    },
    // 显示下一张图片
    right: function () {
      this.index_img === this.items_img_src.length - 1 ? this.index_img = 0 : this.index_img++
      this.fuck3()
    },
    // 轮播导航
    onclick: function (i) {
      this.index_img = i
      this.fuck3()
    },
    // 取消定时器
    clenar: function () {
      clearInterval(this.sWaarp)
    },
    // 启动定时器
    runTimer: function () {
      this.sWaarp = setInterval(() => {
        this.index_img === this.items_img_src.length - 1 ? this.index_img = 0 : this.index_img++
        this.fuck3()
      }, 3000)
    },
    // 进入网易歌单
    wyList: function (i) {
      this.isWyList = true
      this.isView = false
      this.isWyDay = false
      bus.$emit('hideTop', true)
      bus.$emit('Wyindex', this.recommendList[i].id)
    },
    daySong: function () {
      // 进入网易每日推荐歌曲
      console.log('go day recommend songs')
      bus.$emit('hideTop', true)
      bus.$emit('goDay', true)
      this.isWyList = false
      this.isView = false
      this.isWyDay = true
    },
    backChild: function (i) {
      this.isView = false
      bus.$emit('hideTop', true)
      // 取消顶部导航栏
      bus.$emit('index', [this.playlistId[i], this.recommend[i].user_avatar, this.recommend[i].specialname, this.recommend[i].intro])
    },
    fuck: function (i) {
      let slideshowLi = document.querySelectorAll('.slideshow_li')
      slideshowLi[i].style.left = '-60px'
      slideshowLi[i].style.opacity = '0.6'
      slideshowLi[i].style.zIndex = '-1'
      slideshowLi[i].style.transform = 'scale(0.8)'
    },
    fuck1: function (i) {
      let slideshowLi = document.querySelectorAll('.slideshow_li')
      slideshowLi[i].style.left = '100px'
      slideshowLi[i].style.opacity = '1'
      slideshowLi[i].style.zIndex = '1'
      slideshowLi[i].style.transform = 'scale(1)'
    },
    fuck2: function (i) {
      let slideshowLi = document.querySelectorAll('.slideshow_li')
      slideshowLi[i].style.left = '258px'
      slideshowLi[i].style.opacity = '0.6'
      slideshowLi[i].style.zIndex = '0'
      slideshowLi[i].style.transform = 'scale(0.8)'
    },
    fuck3: function () {
      let slideshowLi = document.querySelectorAll('.slideshow_li')
      for (var i = 0; i < 6; i++) {
        slideshowLi[i].style.opacity = '0'
        slideshowLi[i].style.left = '100px'
        slideshowLi[i].style.zIndex = '-1'
      }
      switch (this.index_img) {
        case 0: this.fuck(0); this.fuck1(1); this.fuck2(2); slideshowLi[6].style.opacity = '0'; break
        case 1: this.fuck(1); this.fuck1(2); this.fuck2(3); break
        case 2: this.fuck(2); this.fuck1(3); this.fuck2(4); break
        case 3: this.fuck(3); this.fuck1(4); this.fuck2(5); break
        case 4: this.fuck(4); this.fuck1(5); this.fuck2(6); break
        case 5: this.fuck(5); this.fuck1(6); this.fuck2(0); break
        case 6: this.fuck(6); this.fuck1(0); this.fuck2(1); break
      }
    },
    changColor: function () {
      document.querySelector('.btn-left').style.background = global.Img
      document.querySelector('.btn-right').style.background = global.Imgs
      document.querySelector('.recommend_li span').style.color = global.colors
    },
    wyGetData: function () {
      // 获取每日推荐歌单
      GetMvData.dayRecommendList()
      // 获取推荐歌单
      GetMvData.reCommendListSong(this.recommendList)
    }
  },
  mounted: function () {
    GetMvData.getHomePageImg(this.items_img_src)
    bus.$on('LongIn', (e) => {
      this.wyGetData()
      setTimeout(() => {
        this.isWyView = true
      }, 500)
      setTimeout(() => {
        this.isImg = true
      }, 1400)
    })
    if (global.isLong) {
      this.isWyView = true
      this.isImg = true
      this.wyGetData()
    } else {
      this.isImg = false
    }
    // 轮播
    setTimeout(() => {
      this.fuck(0)
      this.fuck1(1)
      this.fuck2(2)
      this.$nextTick(() => {
        this.sWaarp = setInterval(() => {
          this.index_img === this.items_img_src.length - 1 ? this.index_img = 0 : this.index_img++
          this.fuck3()
        }, 3000)
      })
    }, 500)
    // 防止数据重合
    for (let i = this.recommend.length - 1; i >= 0; i--) {
      this.recommend.splice(i, 1)
    }
    // 封装获取歌单函数
    publicFn.getPlaylist(this.recommend, this.playlistId, true)
    setTimeout(() => {
      global.fmId = this.playlistId
    }, 500)
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
    this.changColor()
    bus.$on('updataPlay', () => {
      try {
        this.changColor()
      } catch (e) {
        console.log('%c 手动抛错((<页面未加载>/推荐/))', 'color: red')
      }
    })
  },
  destroyed: function () {
    this.clenar()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes init {
  0% {
    left: 1022px;
  }
  100% {
    opacity: 1;
    left: 12px;
  }
}
.right_bottom {
  position: absolute;
  opacity: 0;
  width: 790px;
  animation: init 1s;
  animation-fill-mode: forwards;
}
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
.slideshow ul {
  position: relative;
}
.slideshow_li {
  position: absolute;
  width: 540px;
  list-style-type: none;
  overflow: hidden;
  transition: all .5s;
  z-index: 0;
  opacity: 0;
}
.slideshow_li img {
  width: 542px;
  height: 200px;
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
  left: -22px;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/left-4.png') no-repeat center;
}
.btn-right {
  right: 0;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/right-4.png') no-repeat center;
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
  background-color: #cccccc;
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
  position: relative;
  width: 140px;
  height: 178px;
  margin-top: 24px;
  list-style-type: none;
  cursor: pointer;
  overflow: hidden;
}
.recommend_li strong {
  position: absolute;
  display: flex;
  align-items: center;
  width: 138.5px;
  height: 52px;
  top: -52px;
  left: 0;
  color: white;
  font-weight: normal;
  font-size: 10pt;
  text-align: left;
  transition: top .5s;
  background-image: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/listBg.png');
}
.recommend_li a {
  position: absolute;
  right: 1px;
  top: 0;
  transition: all .5s;
}
.recommend_li a img {
  display: inline;
}
.recommend_li a p {
  position: absolute;
  right: 12px;
  top: 4px;
  display: inline;
  color: white;
  margin: 0;
}
.recommend_li:hover strong {
  top: 0;
}
.recommend_li:hover a {
  opacity: 0;
}
.recommend_li span {
  color: rgb(198,47,47);
  font-size: 5rem;
  font-weight: bold;
  letter-spacing: 4px;
  line-height: 138px;
}
.recommend_li .reImg, span {
  display: block;
  width: 138px;
  height: 138px;
  border: .5px solid #D3D3D3;
}
.recommend_li p {
  text-align: left;
  margin: 0;
  margin-top: 4px;
  font-size: 10pt;
  font-weight: 500;
}

</style>
