<template>
  <div class="Friend">
    <div class="dynamic">
      <p v-show="!isFriendLong & !isLonging">请登录(欢迎使用朋友圈功能,下面数据已优化处理,赶快登录体验一下吧)</p>
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="isLonging">
      <h1 v-show="isFriendLong">动态</h1>
      <div class="dyLayout" v-show="isFriend">
        <li v-for="(item, index) in friendData">
          <img v-bind:src="item.user.avatarUrl" class="dyUserImg">
          <div class="dyInfo">
            <p>{{ item.user.nickname }}<a>分享单曲</a></p>
            <p>{{ new Date(parseInt(item.eventTime)).toLocaleString().replace(/:\d{1,2}$/,' ') }}</p>
            <p>{{ JSON.parse(item.json).msg }}</p>
            <span class="ShareSongInfo">
              <img v-bind:src="JSON.parse(item.json).song.album.picUrl">
              <p>{{ JSON.parse(item.json).song.name }}</p>
              <p>{{ JSON.parse(item.json).song.artists[0].name }}</p>
            </span>
            <span class="dyUserGif" v-bind:class="item.pics.length === 0 ? '' : 'dyUserGifs'">
              <img v-for="items in item.pics" v-bind:src="items.pcRectangleUrl">
            </span>
            <span class="dyOther">
              <a>{{ (!item.rcmdInfo && typeof(item.rcmdInfo)!="undefined" && item.rcmdInfo!=0) ? '' : item.rcmdInfo.reason }}</a>
              <a><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/good.png">{{ '(' +  item.info.likedCount + ')' }}</a>
              <a><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/forWard.png">{{ '(' + item.info.shareCount + ')' }}</a>
              <a><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/dyComment.png">{{ '(' + item.info.commentCount + ')' }}</a>
            </span>
          </div>
        </li>
      </div>
    </div>

    <div class="Fr_userInfo">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/longInfo.png" v-show="!isLong">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="isLonging">
      <span class="long" @click="LongIn" v-show="!isLong && !isLonging">立即登录</span>
      <div class="Fr_info" v-show="isLong && !isLonging">
        <img v-bind:src="userData.length !== 0 ? userData[0].profile.avatarUrl : null">
        <p>{{ userData.length !== 0 ? this.userData[0].profile.nickname : null }}</p>
        <p>{{ userData.length !== 0 ? this.userData[0].profile.signature : null }}</p>
      </div>
      <div class="Fr_Detail" v-show="isLong  && !isLonging">
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.eventCount : '0' }}</p><p>动态</p></li>
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.follows : '0' }}</p><p>关注</p></li>
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.followeds : '0' }}</p><p>粉丝</p></li>
      </div>

      <div class="updateLongIn" v-show="isLong && !isLonging">
        <span @click="updateLongIn">刷新登录</span>
      </div>
    </div>

    
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import WyData from '../Data/WyGetData'

export default {
  data () {
    return {
      isLong: false,
      isLonging: false,
      isFriendLong: false,
      userData: [],
      friendData: [],
      isFriend: false,
      userDataDetail: []
    }
  },
  watch: {
    userDataDetail: {
      handler: function (newvalue, old) {
        this.isLonging = false
      },
      deep: true
    },
    friendData: {
      handler: function (newvalue, old) {
        if (this.friendData.length !== 0) {
          this.isFriend = true
          this.isFriendLong = true
        } else {
          this.isFriend = false
        }
      },
      deep: true
    }
  },
  methods: {
    updateLongIn: function () {
      console.log('update')
      this.friendData.splice(0, this.friendData.length)
      WyData.getPersonalFm()
      WyData.friend(this.friendData)
    },
    LongIn: function () {
      document.querySelector('.userWindow').style.display = 'block'
    }
  },
  mounted: function () {
    bus.$on('left_listen', (e) => {
      if (e === 3) this.isLong = global.isLong
    })
    bus.$on('LongIn', (e) => {
      this.friendData.splice(0, this.friendData.length)
      WyData.friend(this.friendData)
      this.isLonging = true
      this.isLong = e
      this.isFriendLong = e
      setTimeout(() => {
        this.userData.push(global.userData[0])
        this.userDataDetail.push(global.userDataDetail[0])
        // console.log(this.userDataDetail)
      }, 500)
    })
    if (global.isLong) {
      this.friendData.splice(0, this.friendData.length)
      WyData.friend(this.friendData)
      this.isLong = true
      this.isFriendLong = true
      setTimeout(() => {
        this.userData.push(global.userData[0])
        this.userDataDetail.push(global.userDataDetail[0])
        // console.log(this.userDataDetail)
      }, 500)
      console.log('success')
    }
  },
  beforeMount: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Friend {
  position: relative;
  width: 100%;
  overflow: auto;
  background-color: rgb(250,250,250);
}

h1 {
  font-size: 13pt;
  color: rgb(51,51,51);
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid rgb(136,136,136);
}

span {
  display: block;
}

.updateLongIn {
  float: right;
  width: 230px;
  margin-top: 12px;
  margin-bottom: 12px;
}
.updateLongIn span {
  display: block;
  margin: 0 auto 0;
  width: 120px;
  height: 28px;
  line-height: 28px;
  font-size: 10pt;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgb(12,115,194);
}
.updateLongIn span:hover {
  background-color: rgb(17,103,168);
}

.long {
  display: block;
  margin: 0 auto 0;
  width: 196px;
  height: 38px;
  line-height: 38px;
  color: white;
  border-radius: 4px;
  font-size: 12pt;
  cursor: pointer;
  background-color: rgb(12,115,194);
}
.long:hover {
  background-color: rgb(17,103,168);
}

.dynamic {
  float: left;
  position: relative;
  margin-left: 26px;
  width: 534px;
  overflow: auto;
}
.dyLayout {
  position: relative;
  width: 100%;
  overflow: auto;
}
.dyLayout li {
  position: relative;
  list-style-type: none;
  width: 100%;
  overflow: hidden;
  padding-bottom: 52px;
  border-bottom: 1px solid rgb(225,225,225);
}
.dyLayout p {
  margin: 0;
  font-size: 10pt;
}
.dyUserImg {
  float: left;
  margin-top: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.dyInfo {
  float: left;
  margin-left: 12px;
  margin-top: 18px;
  width: 474px;
  height: auto;
  overflow: auto;
}
.dyInfo p {
  text-align: left;
}
.dyInfo p:nth-child(1) {
  color: rgb(12,115,194);
}
.dyInfo p:nth-child(1) a {
  color: rgb(102,102,102);
  margin-left: 12px;
}
.dyInfo p:nth-child(2) {
  color: rgb(136,136,136);
  margin-top: 4px;
  font-size: 8pt;
}
.dyInfo p:nth-child(3) {
  color: rgb(51,51,51);
  margin-top: 10px;
  font-size: 11pt;
}
.dyUserGif {
  position: relative;
  display: block;
  overflow: hidden;
}
.dyUserGifs {
  height: 116px;
}
.dyUserGif img {
  position: absolute;
  left: 0;
  top: 0;
  width: 236px;
  height: 116px;
}

.ShareSongInfo {
  position: relative;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100%;
  height: 62px;
  cursor: pointer;
  background-color: rgb(238,238,238);
}
.ShareSongInfo img {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 42px;
  height: 42px;
}
.ShareSongInfo p:nth-child(2){
  position: absolute;
  left: 60px;
  top: 8px;
  color: rgb(51,51,51);
  font-size: 10pt;
}
.ShareSongInfo p:nth-child(3){
  position: absolute;
  left: 60px;
  top: 24px;
  color: rgb(136,136,136);
  font-size: 8pt;
}

.dyOther {
  position: absolute;
  right: 0;
  bottom: 2px;
  display: block;
  text-align: right;
  font-size: 8pt;
}
.dyOther a {
  position: relative;
  width: 36px;
  color: rgb(136,136,136);
  margin-right: 32px;
}
.dyOther a img {
  position: absolute;
  left: -18px;
  top: -2px;
}
.dyOther a:nth-child(4) {
  margin-right: 0;
}
.dyOther a:nth-child(4) img {
  top: 0px;
}

.Fr_userInfo {
  float: right;
  margin-right: 12px;
  position: relative;
  width: 230px;
  overflow: auto;
  background-color: rgb(245,245,245);
}
.Fr_info {
  position: relative;
  margin: 24px auto 12px;
  width: 192px;
  height: 50px;
}
.Fr_info img {
  position: absolute;
  left: 0;
  top: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
}
.Fr_info p {
  position: absolute;
  margin: 0;
  font-size: 10pt;
}
.Fr_info p:nth-child(2) {
  left: 60px;
  top: 4px;
  color: rgb(105,51,136);
}
.Fr_info p:nth-child(3) {
  left: 60px;
  top: 24px;
  font-size: 8pt;
  color: rgb(136,136,136);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.Fr_Detail {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin: 24px auto 12px;
  width: 192px;
  height: 50px;
}
.Fr_Detail li {
  list-style-type: none;
  height: 100%;
  width: 64px;
  text-align: center;
  color: rgb(102,102,102);
  border-right: 1px solid rgb(220,220,220);
}
.Fr_Detail li:nth-child(3) {
  border-right: none;
}
.Fr_Detail li p {
  margin: 0;
  width: 100%;
}
.Fr_Detail li p:nth-child(1) {
  font-weight: bold;
  margin-top: 4px;
}
</style>
