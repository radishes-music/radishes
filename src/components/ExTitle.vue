<template>
  <div class="title">
    <div class="logo">小何沁</div>
    <div class="serch">
      <div class="back_next" @click="goBack">
        <span id="back" title="返回" v-bind:class="!back ? 'is' : 'isGo'"></span>
        <span id="go" title="前进" v-bind:class="!go ? 'is' : 'isGo'"></span>
      </div>
      <input type="text" id="input" placeholder="搜索音乐，歌手，歌词，用户" v-model="key" ref="key" @blur="blur" @focus="focus">
      <span id="choose">
        <p @click="changeApi">
          <a id="choise" v-bind:class="isWyApi ? 'choiseWy' : 'choiseKg'">{{ isWyApi ? '网易' : '酷狗' }}</a>
        </p>
        <p @click="shutChoose">完成</p>
      </span>

      <!-- 弹出搜索结果框 -->
      <div class="popResults" id="popResultsWy">
        <ul>
          <span id="popResultsWyOnly">单曲</span>
          <li v-for="(item, index) in result" @click="setAudio(index)"><i>{{ item.name }}</i> - {{ item.auname }}</li>
          <span id="popResultsWyList">歌单</span>
          <li v-for="(item, index) in resultList" @click="goListDetails(index)">{{ item.name }}</li>
          <span id="popResultsWyMv">视频</span>
          <li v-for="(item, index) in resultMv" @click="goMv(index)"><i>{{ item.name }}</i> - {{ item.auname }}</li>
        </ul>
      </div>
      <div class="popResults" id="popResults">
        <ul>
          <li v-for="(item, index) in result" @dblclick="setAudio(index)">
            <!-- <img v-bind:src="img[index]" id="addsong" v-on:mouseenter="enter(index)" v-on:mouseleave="levae(index)" title="添加到播放队列" @click="addSongList(index)"> -->
            <p>{{ item.songname }}</p>
            <a>{{ item.name }}</a>
          </li>
        </ul>
      </div>

    </div>

    <div class="user" @click="Long"><img v-bind:src="userData.length !== 0 ? userData[0].profile.avatarUrl : 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/longin.png'">{{ !isLong ? '未登录▾' : this.userData[0].profile.nickname + '▾' }}</div>

    <div class="userInformation">
      <div class="userName_">
        <img v-bind:src="userData.length !== 0 ? userData[0].profile.avatarUrl : 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/longin.png'">
        <p>{{ userData.length !== 0 ? this.userData[0].profile.nickname : '默认名字' }}</p>
      </div>
      <div class="userStart_">
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.eventCount : '0' }}</p><p>动态</p></li>
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.follows : '0' }}</p><p>关注</p></li>
        <li><p>{{ userDataDetail.length !== 0 ? userDataDetail[0].profile.followeds : '0' }}</p><p>粉丝</p></li>
      </div>
      <div class="userDetail_">
        <li>VIP会员<a>{{ userDataDetail.length !== 0 ? (userDataDetail[0].profile.vipType === 0 ? '未订购' : ('LV. ' + userDataDetail[0].profile.vipType)) : '未订购' }}</a></li>
        <li>等级<a>{{ 'LV.' + (userDataDetail.length !== 0 ? userDataDetail[0].level : '0') }}</a></li>
        <li>积分<a>{{ (userDataDetail.length !== 0 ? userDataDetail[0].userPoint.balance : '0') + ' 积分' }}</a></li>
      </div>
    </div>

    <div class="userWindow">
      <span @click="shutWin">×</span>
      <input type="text" placeholder="请输入手机号" class="longInput">
      <input type="password" placeholder="请输入密码" class="longInput">
      <strong>{{ LongInfo }}</strong>
      <a @click="longIn">登录</a>
      <p>目前只能使用手机登录,邮箱接口被和谐</p>
    </div>

    <div class="skin" @click="showSkin">
      <div class="skin_s">
        <span class="Triangle"></span>
        <div class="skinBox">
          <li><p>酷炫黑</p></li>
          <li><p>官方红</p></li>
          <li><p>可爱粉</p></li>
          <li><p>天际蓝</p></li>
          <li><p>清新绿</p></li>
          <li><p>土豪金</p></li>
        </div>
      </div>
    </div>

    <div class="control">
      <li></li>
      <li></li>
      <li></li>
    </div>
  </div>
</template>

<script>
import publicFn from './Data/getData'
import bus from '../router/eventBus'
import WyData from './Data/WyGetData'

export default {
  data () {
    return {
      LongInfo: '默认提示文字',
      userData: [],
      userDataDetail: [],
      isLong: false,
      longState: false,
      img: [],
      src: null,
      key: null,
      pop: null,
      popWy: null,
      isSkin: true,
      userKeyLen: 0,
      back: false,
      go: false,
      index: 0,
      isClean: false,
      isClick: false,
      result: [],
      resultList: [],
      resultMv: [],
      isMoveListSerch: false,
      isWyApi: true
    }
  },
  watch: {
    key: {
      handler: function (val, oldval) {
        this.cleanResult() // 清除result数据
        this.isWyApi ? WyData.getSearch(this.$refs.key.value, 1, 4, this.result) : publicFn.serch(this.$refs.key.value, 20, this.result) // 搜索
        this.isWyApi ? WyData.getSearch(this.$refs.key.value, 1000, 3, this.resultList) : null
        this.isWyApi ? WyData.getSearch(this.$refs.key.value, 1004, 3, this.resultMv) : null
        if (this.$refs.key.value !== '') {
          this.isWyApi ? this.popWy.style.display = 'block' : this.pop.style.display = 'block'
          document.querySelector('#choose').style.opacity = '0'
          document.querySelector('#choose').style.left = '292px'
        } else {
          this.isWyApi ? this.popWy.style.display = 'none' : this.pop.style.display = 'none'
          document.querySelector('#choose').style.left = '508px'
          document.querySelector('#choose').style.opacity = '1'
        }
        for (let i = 0; i < 20; i++) {
          // 添加列表图片初始化
          this.img.push('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
        }
      },
      deep: true
    }
  },
  methods: {
    goMv: function (index) {
      console.log(this.resultMv[index].id)
      WyData.playMv(this.resultMv[index].id)
      bus.$emit('isMvPlay', true)
    },
    goListDetails: function (index) {
      bus.$emit('left_listen', [9, true, this.resultList[index].id])
    },
    shutChoose: function () {
      document.querySelector('#choose').style.opacity = '0'
      document.querySelector('#choose').style.left = '292px'
    },
    changeApi: function () {
      // console.log('change')
      this.isWyApi ? this.isWyApi = false : this.isWyApi = true
    },
    shutWin: function () {
      let userWindow = document.querySelector('.userWindow')
      userWindow.style.display = 'none'
    },
    longIn: function () {
      let userWindow = document.querySelector('.userWindow')
      let user = document.querySelectorAll('.userWindow input')[0]
      let pass = document.querySelectorAll('.userWindow input')[1]
      let info = document.querySelector('.userWindow strong')
      console.log(user.value, pass.value)
      if (user.value === '') {
        info.style.display = 'block'
        this.LongInfo = '请输入手机号'
      } else if (pass.value === '') {
        info.style.display = 'block'
        this.LongInfo = '请输入登录密码'
      } else {
        WyData.longIn(user.value, pass.value, this.userData, this.userDataDetail)
        let time = 0
        let t = setInterval(() => {
          if (time >= 8) {
            clearInterval(t)
            alert('用户名或密码错误,请刷新重新登录')
            location.reload()
            return false
          }
          if (this.userData.length !== 0) {
            this.isLong = true
            user.value = pass.value = ''
            this.longState = true
            bus.$emit('LongIn', true)
            console.log('success')
            clearInterval(t)
          } else {
            time++
          }
        }, 100)
        userWindow.style.display = 'none'
      }
    },
    Long: function () {
      if (this.isLong) {
        let userInformation = document.querySelector('.userInformation')
        if (this.longState) {
          let style = document.defaultView.getComputedStyle(userInformation, null)
          if (style.display === 'none') {
            userInformation.style.display = 'block'
            WyData.updateLongIn()
          } else {
            userInformation.style.display = 'none'
          }
        }
        return
      }
      let userWindow = document.querySelector('.userWindow')
      userWindow.style.display = 'block'
    },
    goBack: function (ev) {
      if (ev.target.id === 'back') {
        if (this.isClick) this.go = true
        if (this.userKeyLen !== 1) this.userKeyLen -= 1
        if (this.userKeyLen <= 1) this.back = false
        // console.log(this.userKeyLen)
      }
      if (ev.target.id === 'go') {
        if (this.isClick) this.back = true
        if (this.userKeyLen < global.userRecord.length) this.userKeyLen += 1
        if (this.userKeyLen >= global.userRecord.length) this.go = false
        // console.log(this.userKeyLen)
      }
      this.index = this.userKeyLen
      // console.log(global.userRecord[this.userKeyLen - 1])
      // console.log(global.userRecord)
      this.isClean = true
      if (this.isClick) bus.$emit('title_listen', global.userRecord[this.userKeyLen - 1])
    },
    addSongList: function (i) {
      publicFn.play(this.result[i].hash, false, this.result[i].duration, this.__songList)
    },
    enter: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
    },
    cleanResult: function () {
      this.cleanResults(this.result)
      this.cleanResults(this.resultList)
      this.cleanResults(this.resultMv)
    },
    cleanResults: function (arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        arr.splice(i, 1)
      }
    },
    blur: function () {
      if (this.isWyApi) this.pop.style.display = 'none'
      global.isKeyBord = true
      if (this.$refs.key.value !== '') {
        document.querySelector('#choose').style.opacity = '0'
        document.querySelector('#choose').style.left = '292px'
      } else {
        this.isWyApi ? this.popWy.style.display = 'none' : this.pop.style.display = 'none'
      }
    },
    focus: function () {
      if (this.isWyApi) this.pop.style.display = 'none'
      global.isKeyBord = false
      if (this.$refs.key.value !== '') {
        this.isWyApi ? this.popWy.style.display = 'block' : this.pop.style.display = 'block'
      } else {
        document.querySelector('#choose').style.left = '508px'
        document.querySelector('#choose').style.opacity = '1'
      }
    },
    setAudio: function (i) {
      this.isMoveListSerch = true
      this.pop.style.display = 'none'
      // 是否网易api
      if (this.isWyApi) {
        let img = []
        let lycSrc = []
        WyData.Getartists(this.result[i].auId, img)
        WyData.SongLyc(this.result[i].id, lycSrc)
        let t = setInterval(() => {
          if (img.length !== 0 && lycSrc.length !== 0) {
            bus.$emit('songControl', {
              'img': img[0],
              'author_name': this.result[i].auname,
              'song_name': this.result[i].name,
              'lyc': lycSrc[0],
              'isWy': true
            })
            bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.result[i].id + '.mp3')
            clearInterval(t)
          }
        }, 100)
      } else {
        publicFn.play(this.result[i].hash, true)
      }
    },
    showSkin: function () {
      let skin = document.querySelector('.skin_s')
      if (this.isSkin) {
        this.isSkin = false
        skin.style.display = 'block'
      } else {
        this.isSkin = true
        skin.style.display = 'none'
      }
    }
  },
  mounted: function () {
    console.log('%c 欢迎开发者，报错并不影响使用！需要源码，请联系：linkorg@qq.com', 'color: pink')
    // 登录窗口位置设置
    let userLongin = document.querySelector('.userWindow')
    userLongin.style.left = document.documentElement.clientWidth / 2 - 150 + 'px'
    userLongin.style.top = document.documentElement.clientHeight / 2 - 250 + 'px'
    this.pop = document.getElementById('popResults')
    this.popWy = document.getElementById('popResultsWy')
    this.input = document.getElementById('input')
    this.userKeyLen = global.userRecord.length
    bus.$on('updata', (e) => {
      if (e) {
        this.isClick = true
        this.userKeyLen = global.userRecord.length
        if (this.isClean) {
          let temp = global.userRecord[this.index - 1]
          let temp2 = global.userRecord[global.userRecord.length - 1]
          global.userRecord.splice(0, global.userRecord.length)
          temp !== temp2 ? global.userRecord.push(temp, temp2) : global.userRecord.push(temp, 0)
          this.userKeyLen = global.userRecord.length
        }
        this.back = true
        this.go = false
        this.isClean = false
        // console.log(global.userRecord)
      }
    })
    // 换肤开始
    let skinColor = ['rgb(34,34,34)', 'rgb(198,47,47)', 'rgb(225,135,180)', 'rgb(102,183,255)', 'rgb(59,186,125)', 'rgb(250,172,98)']
    let skinImgss = ['rgb(34,34,34)', 'rgb(198,47,47)', 'url("http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Pink.png")', 'url("http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Blue.png")', 'url("http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Green.png")', 'url("http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Golden.png")']
    let skinInput = ['rgb(68, 68, 68)', 'rgb(128, 30, 30)', 'rgb(208, 96, 152)', 'rgb(43, 139, 224)', 'rgb(38, 156, 99)', 'rgb(195, 129, 67)']
    let skinImg = 'url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/left-'
    let skinImgs = 'url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/right-'
    let Play = 'url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/play-'
    let Pointer = 'url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/pointer-'
    let Prev = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/prive-'
    let Next = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/next-'
    let Bg = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/bg-'
    let skinBox = document.querySelectorAll('.skinBox li')
    for (let i = 0; i < skinBox.length; i++) {
      skinBox[i].onclick = () => {
        global.colors = skinColor[i]
        document.querySelector('.title').style.background = skinImgss[i]
        document.querySelector('.serch #input').style.backgroundColor = skinInput[i]
        let temp = skinImg + i + '.png) no-repeat center'
        let temps = skinImgs + i + '.png) no-repeat center'
        let tempPlay = Play + i + '.png) no-repeat 12px 4px / 24px'
        let tempPointer = Pointer + i + '.png) no-repeat 4px 2px'
        let tempPrev = Prev + i + '.png'
        let tempNext = Next + i + '.png'
        let tempBg = Bg + i + '.jpg'
        global.Img = temp
        global.Imgs = temps
        global.ImgPlay = tempPlay
        global.ImgPointer = tempPointer
        global.ImgPrev = tempPrev
        global.ImgNext = tempNext
        global.ImgBg = tempBg
        try {
          bus.$emit('updataPlay', i)
        } catch (e) {
          console.log('%c emit 未成功执行', 'color: red')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::scrollbar{width:6px;height:4px}
::-webkit-scrollbar{width:6px;height:4px}
::-webkit-scrollbar-track{background-color: rgb(250,250,250)}
::-webkit-scrollbar-thumb{background-color: rgb(240,240,240);}
::-moz-scrollbar{width:6px;height:4px}
::-moz-scrollbar-track{background-color: rgb(250,250,250)}
::-moz-scrollbar-thumb{background-color: rgb(240,240,240)}

@font-face {
  font-family: black_;
  /*src: url('http://112.74.169.178/static/fonts/LinkBack.ttf');*/
  src: url('../font/LinkBack.ttf');
  font-weight: lighter;
}
#input::-webkit-input-placeholder{
    color: #fff;opacity:1;
}
.longInput::-webkit-input-placeholder{
  color: rgb(169,169,169);
  font-size: 10pt;
  font-weight: normal;
}


.title {
  position: relative;
  width: 1022px;
  height: 52px;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Green.png) no-repeat center;
  z-index: 2;
}

.logo {
  float: left;
  width: 154px;
  height: 30px;
  padding-top: 11px;
  line-height: 30px;
  text-indent: 32px;
  letter-spacing: 2px;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  font-family: black_;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/musicLogo.png) no-repeat;
  /*background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/main.png') no-repeat;*/
  background-size: 32px 32px;
  background-position: 4px 10px;
}

.serch {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 11px;
  padding-left: 60px;
  width: 284px;
  height: 30px;
}
.serch input {
  width: 220px;
  height: 22px;
  margin-left: 24px;
  color: white;
  font-size: 9pt;
  text-indent: 8px;
  border-style: none;
  outline: none;
  border-radius: 12px;
  background: #409A6A url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/magnifying%20lens.png) no-repeat;
  background-size: 10%;
  background-position: 184px 3px;
  opacity: .8;
  z-index: 999;
}
.back_next {
  width: 56px;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back_next span {
  display: block;
  width: 50%;
  height: 24px;
  border-radius: 4px 0 0 4px;
  border: 0.5px solid #333232;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/back.png) no-repeat center;
  background-size: 70%;
  cursor: pointer;
}
.back_next span:last-child {
  border-left: none;
  border-radius: 0 4px 4px 0;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/next.png) no-repeat center;
  background-size: 70%;
}
.isGo {
  opacity: .8;
}
.is {
  opacity: .2;
}
.popResults {
  display: none;
  position: absolute;
  z-index: 1;
  animation: pop .6s;
  animation-fill-mode: forwards;
  box-shadow: -14px 10px 20px 0px #ccc;
}
.popResults p {
  margin: 0;
  width: 80%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.popResults ul {
  list-style-type: none;
  overflow-y: scroll;
  height: 226px;
  background-color: rgb(250,250,250);
  margin: 0;
  padding-left: 0;
}
.popResults ul li {
  position: relative;
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 9pt;
  /*font-family: black_;*/
  cursor: pointer;
  text-align: left;
  text-indent: 4px;
  color: rgb(12,115,194);
  border-top: 1px solid #D3D3D3;
  overflow: hidden;
}
.popResults ul li:hover {
  background-color: rgb(235,235,235);
}
.popResults a {
  position: absolute;
  right: 4px;
  top: 0;
  width: 20%;
  color: #262424;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.popResults img{
  position: absolute;
  left: 130px;
  top: 6px;
  z-index: 4;
}

#popResultsWy span{
  display: block;
  text-align: left;
  height: 26px;
  width: 100%;
  line-height: 26px;
  text-indent: 28px;
  font-size: 0.9rem;
  font-weight: bold;
}
#popResultsWyOnly {
  background: rgb(245,245,245) url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/serchMusic.png') no-repeat 12px 6px;
}
#popResultsWyList {
  background: rgb(245,245,245) url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png') no-repeat 12px 6px;
}
#popResultsWyMv {
  background: rgb(245,245,245) url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/mv.png') no-repeat 12px 6px;
}

#popResultsWy li {
  width: 100%;
  text-indent: 28px;
  border-top: none;
  color: rgb(51,51,51);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
#popResultsWy li i {
  color: rgb(12,115,194);
  font-style: normal;
  width: 132px;
}

@keyframes pop {
  0%{
    width: 0;
    height: 0;
    left: 380px;
    top: 160px;
  }
  100%{
    width: 208px;
    height: 226px;
    left: 290px;
    top: 46px;
  }
}

.skin {
  position: relative;
  float: right;
  margin-right: 160px;
  margin-top: -26px;
  width: 24px;
  height: 24px;
  z-index: -1;
  cursor: pointer;
  z-index: 2;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/skin.png) no-repeat center;
  opacity: .8;
}
.skin:hover {
  opacity: 1;
}
.skin_s {
  display: none;
  position: absolute;
  left: -148px;
  top: 37px;
  width: 320px;
  height: 250px;
  background-color: white;
}
.Triangle {
  position: relative;
  display: block;
  margin: 0 auto 0;
  top: -12px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 12px solid white;
}

.user {
  position: absolute;
  right: 190px;
  top: 12px;
  width: 126px;
  height: 30px;
  line-height: 30px;
  text-indent: 12px;
  color: white;
  font-size: 10pt;
  cursor: pointer;
  opacity: .8;
}
.user img {
  position: absolute;
  left: 0;
  top: 1px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.user:hover {
  opacity: 1;
}

.skinBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: -12px;
  box-shadow: -5px 2px 10px 0px rgb(92,92,92);
}
.skinBox li {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 10pt;
  list-style-type: none;
  width: 96px;
  height: 96px;
  color: white;
}
.skinBox li:nth-child(1) {
  background-color: #000;
}
.skinBox li:nth-child(2) {
  background-color: rgb(208,62,58);
}
.skinBox li:nth-child(3) {
  background-color: rgb(235,145,183);
}
.skinBox li:nth-child(4) {
  background-color: rgb(87,187,255);
}
.skinBox li:nth-child(5) {
  background-color: rgb(59,167,125);
}
.skinBox li:nth-child(6) {
  background-color: rgb(225,183,116);
}
.skinBox li:hover p {
  height: 96px;
}
.skinBox li p {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  margin: 0;
  padding: 0;
  transition: all 1s;
  text-align: left;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/skinBg.png) repeat left;
}

.control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 934px;
  margin-top: -26px;
  width: 86px;
  height: 24px;
  z-index: 1;
}
.control li {
  list-style-type: none;
  width: 33%;
  height: 24px;
  cursor: pointer;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/shrink.png) no-repeat center;
}
.control li:nth-child(2) {
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/magnify.png) no-repeat center;
}
.control li:nth-child(3) {
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/shutdown.png) no-repeat center;
}

.userWindow {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 350px;
  height: 500px;
  z-index: 999;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/longWin.png') no-repeat;
  box-shadow: -4px 6px 14px #0009;
}
.userWindow span {
  position: absolute;
  right: 4px;
  top: 4px;
  opacity: .8;
  cursor: pointer;
}
.userWindow span:hover {
  opacity: 1;
}
.userWindow input {
  position: absolute;
  height: 33px;
  font-size: 11pt;
  font-weight: bold;
  border: none;
  outline: none;
  letter-spacing: 1px;
}
.userWindow input[type='text'] {
  left: 106px;
  top: 206px;
  width: 195px;
}
.userWindow input[type='password'] {
  left: 80px;
  top: 245px;
  width: 210px;
}
.userWindow a{
  position: absolute;
  left: 45px;
  top: 300px;
  width: 262px;
  height: 42px;
  line-height: 42px;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  color: white;
  font-size: 14pt;
  letter-spacing: 4px;
  cursor: pointer;
  background-color: rgb(234,72,72);
}
.userWindow a:hover {
  background-color: rgb(199,46,46);
}

.userWindow p {
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 9pt;
}
.userWindow strong {
  display: none;
  position: absolute;
  left: 206px;
  top: 360px;
  color: red;
  font-size: 10pt;
}

.userInformation {
  display: none;
  position: absolute;
  left: 632px;
  top: 52px;
  width: 276px;
  height: 258px;
  z-index: 998;
  background-color: rgb(250,250,250);
  border: 1px solid #ccc;
}
.userName_ {
  position: absolute;
  left: 0;
  top: 12px;
  width: 100%;
  height: 50px;
}
.userName_ img {
  position: absolute;
  left: 30px;
  top: 2px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
.userName_ p {
  position: absolute;
  left: 86px;
  top: 0;
  font-size: 12pt;
}
.userStart_ {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  left: 0;
  top: 76px;
  width: 100%;
  height: 48px;
}
.userStart_ li {
  list-style-type: none;
  width: 30%;
}
.userStart_ li p:nth-child(1) {
  margin-bottom: 0;
  font-weight: bold;
}
.userStart_ li p:nth-child(2) {
  margin-top: 0;
  font-size: 10pt;
}
.userDetail_ {
  position: absolute;
  left: 0;
  top: 132px;
  width: 100%;
  height: 110px;
  border-top: 1px solid rgb(232,232,232);
}
.userDetail_ li {
  list-style-type: none;
  height: 40px;
  line-height: 40px;
  width: 100%;
  font-size: 10pt;
  text-align: left;
  text-indent: 52px;
  cursor: pointer;
  background-position: 18px 10px;
  background-repeat: no-repeat;
}
.userDetail_ li:hover {
  background-color: rgb(235,235,235);
}
.userDetail_ li:nth-child(1) {
  background-image: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/user-vip.png');
}
.userDetail_ li:nth-child(2) {
  background-image: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/user-lev.png');
}
.userDetail_ li:nth-child(3) {
  background-image: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/user-score.png');
}
.userDetail_ a {
  float: right;
  margin-right: 24px;
  font-weight: bold;
  font-style: italic;
  color: rgb(136,136,136);
}

#choose {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  /*left: 508px;*/
  left: 292px;
  top: 6px;
  width: 108px;
  height: 80%;
  opacity: 0;
  transition: all .8s;
}

#choose p:nth-child(1) {
  position: relative;
  width: 68px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  background-color: #fff;
}

#choose p:nth-child(2) {
  width: 46px;
  color: white;
  cursor: pointer;
}

#choose p:nth-child(1) a {
  display: block;
  position: absolute;
  top: 0;
  width: 32px;
  height: 22px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  background-color: rgb(53,172,164);
}

.choiseWy {
  left: 2px;
  box-shadow: -2px 2px 0px 2px #0c6f68;
}

.choiseKg {
  right: 2px;
  box-shadow: 2px 2px 0px 2px #0c6f68;
}
</style>
