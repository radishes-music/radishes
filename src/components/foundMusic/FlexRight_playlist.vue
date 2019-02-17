<template>
  <div class="right_playlist">

    <p class="right_playlist_title" v-show="isView">歌单</p>
    <div class="recommend" v-show="isView">
        <li class="recommend_li" v-for="(item, index) in recommendList" :key="index" @click="wyList(index)">
            <strong>{{ item.copywriter }}</strong>
            <img class="reImg" v-bind:src="item.picUrl" alt="图片拉取失败" v-bind:title="item.copywriter">
            <a><img class="reRT" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png"><p>{{ parseInt(item.playCount / 10000) + '万' }}</p></a>
            <p>{{ item.name }}</p>
          </li>
    </div>

    <SongListDetails v-show="!isView"></SongListDetails>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import SongListDetails from '../SongListDetails/SongListDetails'
import publicFn from '../Data/getData'
import GetMvData from '../Data/WyGetData'

export default {
  data () {
    return {
      isView: true,
      recommend: [],
      spaceId: [],
      recommendList: []
    }
  },
  methods: {
    wyList: function (i) {
      this.isView = false
      this.$emit('hideTop', true)
      // 取消顶部导航栏
      // this.$emit('listenChild', false)
      bus.$emit('index', [this.spaceId[i], this.recommend[i].user_avatar, this.recommend[i].specialname, this.recommend[i].intro])
    }
  },
  components: {
    'SongListDetails': SongListDetails
  },
  mounted: function () {
    // 防止数据重合
    for (let i = this.recommend.length - 1; i >= 0; i--) {
      this.recommend.splice(i, 1)
    }
    publicFn.getPlaylist(this.recommend, this.spaceId, false)
    bus.$on('left_listen', () => {
      this.isView = true
    })
    bus.$on('updata', (e) => {
      if (e) {
        this.isView = true
      }
    })
    GetMvData.reCommendListSong(this.recommendList)
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
.right_playlist {
  position: absolute;
  width: 96%;
  margin: 0 auto 0;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}
.right_playlist_title {
  text-align: left;
  font-size: 12pt;
}
.recommend {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
