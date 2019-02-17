<template>
  <div class="mvplay">
    <div class="mvSrc">
      <span @click="scale">{{mvData.name }}<a>{{ mvData.artistName}}</a></span>
      <div id="mv">
        <iframe v-bind:src="mvSrc"></iframe>
      </div>
    </div>

    <div class="mvDetail">
      <div class="mvD_">
        <h1>MV介绍</h1>
        <span>
          <li>{{ '发布时间: ' + (mvData.publishTime) }}</li>
          <li>{{ '播放次数: ' + (mvData.playCount) }}</li>
          <li>{{ mvData.briefDesc}}</li>
          <li>{{ '简介: ' + (mvData.desc) }}</li>
        </span>
      </div>

      <div class="mvS_">
        <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="isSLoad">
        <h1 v-show="!isSLoad">相关MV</h1>
        <li v-for="(item, index) in reLevant" @click="playMvs(index)">
          <img v-bind:src="item.cover">
          <p>{{ item.name }}</p>
          <p>{{ item.artistName }}</p>
        </li>
      </div>
    </div>

    <div class="mvComment">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="isLoad">

      <h1 v-show="!isLoad">精彩评论</h1>
      <li v-for="(item, index) in hotComment" class="mvComment_1">
        <img v-bind:src="item.user.avatarUrl" class="mvCom_img">
        <div>
          <p><a>{{ item.user.nickname + ': ' }}</a>{{ item.content }}</p>
          <p>{{ new Date(parseInt(item.time)).toLocaleString().replace(/:\d{1,2}$/,' ') }}</p>
        </div>
        <span @click="goodComment(index, 0)"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/good.png">{{ '(' + item.likedCount + ')'}}</span>
      </li>

      <h1 v-show="!isLoad" class="newComment">{{ '最新评论(' + commentCount + ')'}}<a>只显示前20条评论</a></h1>
      <li v-for="(item, index) in comment" class="mvComment_2">
        <img v-bind:src="item.user.avatarUrl" class="mvCom_img">
        <div>
          <p><a>{{ item.user.nickname + ': ' }}</a>{{ item.content }}</p>
          <p>{{ new Date(parseInt(item.time)).toLocaleString().replace(/:\d{1,2}$/,' ') }}</p>
        </div>
        <span @click="goodComment(index, 1)"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/good.png">{{ '(' + item.likedCount + ')'}}</span>
      </li>
    </div>
  </div>

</template>

<script>
import bus from '../../router/eventBus'
// import publicFn from '../Data/getData'
import GetMvData from '../Data/WyGetData'

export default {
  data () {
    return {
      mvSrc: '',
      isLoad: true,
      isSLoad: true,
      index_odd: null,
      index1_odd: null,
      mvData: {},
      reLevant: [],
      commentCount: 20,
      comment: [],
      hotComment: []
    }
  },
  watch: {
    hotComment: {
      handler: function (newvalue, old) {
        if (this.hotComment.length !== 0) {
          this.isLoad = false
        }
      },
      deep: true
    },
    reLevant: {
      handler: function (newvalue, old) {
        if (this.reLevant.length !== 0) {
          this.isSLoad = false
        }
      },
      deep: true
    }
  },
  methods: {
    goodComment: function (index, s) {
      if (global.isLong) {
        if (s === 0) {
          this.goods(0, index)
        } else {
          this.goods(1, index)
        }
      } else {
        document.querySelector('.userWindow').style.display = 'block'
      }
    },
    goods: function (id, index) {
      let n = '.mvComment_1'
      let i = this.index_odd
      let s_ = 1
      if (id === 1) {
        n = '.mvComment_2'
        i = this.index1_odd
      }
      if (index === i) {
        s_ = 0
        id === 1 ? this.comment[index].likedCount -= 1 : this.hotComment[index].likedCount -= 1
        document.querySelectorAll(n)[index].querySelector('span').style.color = 'rgb(136,136,136)'
        id === 1 ? this.index1_odd = null : this.index_odd = null
        GetMvData.goodComment(this.mvData.id, this.hotComment[index].commentId, s_, 1)
      } else {
        id === 1 ? this.comment[index].likedCount += 1 : this.hotComment[index].likedCount += 1
        document.querySelectorAll(n)[index].querySelector('span').style.color = global.colors
        id === 1 ? this.index1_odd = index : this.index_odd = index
        GetMvData.goodComment(this.mvData.id, this.comment[index].commentId, s_, 1)
      }
    },
    scale: function () {
      this.clearData()
      bus.$emit('isMvPlay', false)
    },
    clearData: function () {
      this.reLevant.splice(0, this.reLevant.length)
      this.comment.splice(0, this.comment.length)
      this.hotComment.splice(0, this.hotComment.length)
      this.mvData = {}
      this.isSLoad = true
      this.isLoad = true
    },
    playMvs: function (index) {
      console.log(this.reLevant[index].id)
      let mvid = this.reLevant[index].id
      this.clearData()
      bus.$emit('setMv', GetMvData.playMv(mvid))
      bus.$emit('mvDetails', GetMvData.getMvDetails(mvid))
    }
  },
  mounted: function () {
    bus.$on('mvDetails', e => {
      this.mvData = e
    })
    bus.$on('setMv', (e) => {
      if (typeof e === 'undefined') {
        return
      }
      this.mvSrc = e['url']
      // 获取相似MV
      GetMvData.resemble(e.id, this.reLevant)
      // 获取mv评论
      GetMvData.commentMv(e.id, this.commentCount, this.comment, this.hotComment)
    })
  },
  beforeMount: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mvplay {
  position: relative;
  width: 100%;
  height: 506px;
  overflow: auto;
}

.mvplay h1 {
  font-size: 12pt;
  color: rgb(102,102,102);
  font-weight: normal;
  letter-spacing: 2px;
  text-align: left;
}
.mvplay li {
  list-style-type: none;
}

.mvSrc {
  position: relative;
  left: 26px;
  top: 24px;
  width: 670px;
  height: 486px;
}
.mvSrc span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 26px;
  line-height: 26px;
  text-align: left;
  font-size: 14pt;
  margin-bottom: 4px;
  cursor: pointer;
}
.mvSrc a {
  font-size: 10pt;
  margin-left: 24px;
}
.mvSrc iframe {
  position: absolute;
  left: 0;
  top: 26px;
  width: 100%;
  height: 377px;
  border: none;
  margin: 0;
}
.mvS_ {
  position: relative;
  width: 100%;
}
.mvS_ h1 {
  padding-bottom: 12px;
  border-bottom: 1px solid rgb(225,225,225);
}
.mvS_ li {
  position: relative;
  width: 100%;
  height: 68px;
  margin-top: 12px;
  cursor: pointer;
}
.mvS_ li img {
  position: absolute;
  left: 0;
  top: 0;
  width: 120px;
  height: 68px;
}
.mvS_ p {
  position: absolute;
  margin-top: 12px;
  margin-bottom: 4px;
  font-size: 10pt;
  top: 12px;
}
.mvS_ p:nth-child(2) {
  left: 132px;
  top: 0;
  width: 150px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  text-align: left;
}
.mvS_ p:nth-child(3) {
  left: 132px;
  top: 20px;
  color: rgb(136,136,136);
}

.mvDetail {
  position: absolute;
  right: 8px;
  top: 24px;
  width: 278px;
  height: 300px;
}
.mvD_ span {
  display: block;
  width: 100%;
  height: 172px;
  padding-top: 12px;
  border-top: 1px solid rgb(225,225,225);
}
.mvD_ li {
  text-align: left;
  font-size: 10pt;
  margin-top: 2px;
  color: rgb(136,136,136);
}
.mvD_ li:nth-child(3) {
  color: rgb(102,102,102);
  margin-top: 24px;
}
.mvD_ li:nth-child(4) {
  color: rgb(102,102,102);
}

.mvComment {
  position: absolute;
  left: 26px;
  top: 486px;
  margin-top: 64px;
  width: 670px;
}

.mvComment h1 {
  padding-bottom: 4px;
  border-bottom: 1px solid rgb(225,225,225);
}

.mvComment li {
  position: relative;
  width: 100%;
  padding-bottom: 24px;
  padding-top: 24px;
  overflow: hidden;
  border-bottom: 1px solid rgb(225,225,225);
}

.mvComment .mvCom_img {
  float: left;
  margin-top: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.mvComment div {
  float: left;
  width: 94%;
  overflow: hidden;
}
.mvComment p {
  margin: 0;
  padding: 0;
  text-align: left;
  margin-left: 24px;
}
.mvComment a {
  text-decoration: none;
  color: rgb(12,115,194);
}
.mvComment div p:nth-child(1) {
  float: left;
  width: 96%;
  font-size: 10pt;
}
.mvComment div p:nth-child(2) {
  float: left;
  margin-top: 12px;
  font-size: 8pt;
  color: rgb(136,136,136);
}
.mvComment span {
  position: absolute;
  right: 12px;
  bottom: 2px;
  font-size: 8pt;
  cursor: pointer;
  color: rgb(136,136,136);
}
.mvComment span img {
  position: absolute;
  left: -14px;
  top: -2px;
}

.newComment {
  margin-top: 42px;
}
.newComment a {
  float: right;
  font-size: 10pt;
  color: rgb(136,136,136);
}
</style>
