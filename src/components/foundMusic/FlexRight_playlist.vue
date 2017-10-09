<template>
  <div class="right_playlist">

    <p class="right_playlist_title" v-show="isView">歌单</p>
    <div class="recommend" v-show="isView">
        <li class="recommend_li" v-for="item in recommend" @click="goList(recommend.indexOf(item))">
          <img v-bind:src="item.user_avatar" alt="图片拉取失败" v-bind:title="item.intro">
          <p>{{ item.specialname }}</p>
        </li>
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
      isView: true,
      recommend: [],
      spaceId: []
    }
  },
  methods: {
    goList: function (i) {
      this.isView = false
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right_playlist {
  width: 96%;
  margin: 0 auto 0;
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
  width: 140px;
  height: 198px;
  cursor: pointer;
  list-style-type: none;
}
.recommend_li img {
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
