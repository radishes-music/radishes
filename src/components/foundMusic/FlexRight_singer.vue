<template>
  <div class="right_singer">
    
    <p class="right_singer_title" v-show="isView">歌手分类</p>
    <div class="singer" v-show="isView">
        <li class="singer_li" v-for="item in singer" @click="goList(singer.indexOf(item))">
          <img v-bind:src="item.imgurl" alt="图片拉取失败" v-bind:title="item.classname">
          <p>{{ item.classname }}</p>
        </li>
    </div>

    <singerList v-show="!isView"></singerList>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import singerList from '../SongListDetails/SingerList'
import publicFn from '../Data/getData'

export default {
  data () {
    return {
      singer: [],
      isView: true,
      classId: []
    }
  },
  components: {
    'singerList': singerList
  },
  methods: {
    goList: function (i) {
      this.isView = false
      // 取消顶部导航栏
      bus.$emit('singerId', [this.classId[i], this.singer[i]])
    }
  },
  mounted: function () {
    this.type = 'baidu.ting.artist.getSongList'
    this.$http.options.emulateJSON = true
    this.$http.options.emulateHTTP = true
    // 获取歌手分类
    publicFn.getSinger(this.singer, this.classId)
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
@keyframes init {
  0% {
    left: 1022px;
  }
  100% {
    opacity: 1;
    left: 24px;
  }
}
.right_singer {
  position: absolute;
  width: 96%;
  margin: 0 auto 0;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}

.right_singer_title {
  text-align: left;
  font-size: 12pt;
  padding-bottom: 16px;
  border-bottom: .5px solid #D3D3D3;
}

.singer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.singer_li {
  width: 140px;
  height: 198px;
  cursor: pointer;
  list-style-type: none;
}

.singer_li img {
  width: 138px;
  height: 138px;
  border: .5px solid #D3D3D3;
}
.singer_li p {
  text-align: center;
  margin-top: 4px;
  font-size: 10pt;
  font-weight: 500;
}
</style>
