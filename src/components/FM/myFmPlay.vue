<template>
  <div class="myFmPlay">

    <div class="dyn_top">
      <img v-bind:src="fmDetail.length===0?null:fmDetail[0].img">
      <div class="dynR">
        <strong>电台</strong><a class="dynTit">{{ fmDetail.length===0?null:fmDetail[0].name }}</a>
        <p class="dynUs"><img v-bind:src="fmDetail.length===0?null:fmDetail[0].auimg"><a>{{ fmDetail.length===0?null:fmDetail[0].auname }}</a></p>
        <span @click="play">播放全部</span>
        <p class="dynTab">{{ fmDetail.length===0?null:fmDetail[0].category }}</p>
        <p class="dynAb">简介: {{ fmDetail.length===0?null:fmDetail[0].desc }}</p>
      </div>
    </div>

    <div class="dyn_bottom">
      <p class="dyn_bottom_p">节目列表</p>
      <div class="dyn_b_list">
        <ul>
          <li v-for="(item, index) in playlist" @dblclick="setAudioSrc(index)" v-bind:class="index%2===0? null : 'dusadq'">
            <p>{{ item.serialNum }}</p>
            <p><img v-bind:src="item.img"></p>
            <p>{{ item.name }}</p>
            <p>播放: {{ item.listenerCount }}</p>
            <p>赞: {{ item.likedCount }}</p>
            <p>{{ 1900+new Date(item.createTime).getYear()+'-'+(new Date(item.createTime).getMonth()+1)+'-'+new Date(item.createTime).getDate()}}</p>
            <p>{{ new Date(item.createTime).getHours()+':'+new Date(item.createTime).getMinutes() }}</p>
          </li>
        </ul>
        <div class="fmLimit">
          <li v-for="(item, index) in Limit" @click="goLimit(index)" v-bind:class="nowIndex===index?'LimitIndex':null">{{ item }}</li>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import GetMvData from '../Data/WyGetData'

export default {
  name: 'myFmPlay',
  data () {
    return {
      playlist: [],
      fmDetail: [],
      isSend: true,
      nowIndex: 0,
      Limit: [],
      fmID: 0
    }
  },
  watch: {
  },
  methods: {
    play: function () {
      // console.log(this.playlist)
      for (let i = 0; i < this.playlist.length; i++) {
        this.__songList.push({
          'img': this.playlist[i].img,
          'song_name': this.playlist[i].name,
          'author_name': this.fmDetail[0].auname,
          'duration': this.playlist[i].dt / 1000,
          'lyc': null,
          'id': this.playlist[i].id,
          'url': 'http://music.163.com/song/media/outer/url?id=' + this.playlist[i].id + '.mp3',
          'isWy': true
        })
      }
      bus.$emit('songlength', this.__songList.length)
      bus.$emit('songControl', {
        'img': this.playlist[0].img,
        'author_name': this.fmDetail[0].auname,
        'song_name': this.playlist[0].name,
        'duration': this.playlist[0].dt / 1000,
        'id': this.playlist[0].id,
        'lyc': null,
        'isWy': true
      })
      bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.playlist[0].id + '.mp3')
      bus.$emit('loopControl', 1)
    },
    goLimit: function (index) {
      console.log(index)
      this.nowIndex = index
      for (let i = this.playlist.length - 1; i >= 0; i--) {
        this.playlist.splice(i, 1)
      }
      GetMvData.myFmProgram(this.fmID, this.playlist, index * 50)
    },
    setAudioSrc: function (index) {
      console.log(this.playlist[index].id)
      // http://music.163.com/song/media/outer/url?id=548062201.mp3
      bus.$emit('songControl', {
        'img': this.playlist[index].img,
        'author_name': this.fmDetail[0].auname,
        'song_name': this.playlist[index].name,
        'duration': this.playlist[index].dt / 1000,
        'id': this.playlist[index].id,
        'lyc': null,
        'isWy': true
      })
      bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.playlist[index].id + '.mp3')
    }
  },
  mounted: function () {
    bus.$on('myFmPlay', (e) => {
      this.fmID = e
      for (let i = this.playlist.length - 1; i >= 0; i--) {
        this.playlist.splice(i, 1)
      }
      if (this.isSend) {
        GetMvData.myFmDetails(e, this.fmDetail)
        GetMvData.myFmProgram(e, this.playlist, 0)
        let t = setInterval(() => {
          if (this.playlist.length !== 0) {
            for (var j = 1; j < parseInt(parseInt(this.playlist[0].serialNum) / 50) + 2; j++) {
              this.Limit.push(j)
            }
            clearInterval(t)
          }
        }, 200)
      }
      this.isSend = false
      console.log(this.isSend)
    })
  },
  updated: function () {
  },
  destroy: function () {
    console.log('销毁')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
@keyframes init {
  100% {
    opacity: 1
  }
}
.dynamics {
  position: relative;
  float: right;
  width: 820px;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}

.dyn_top {
  display: flex;
  justify-content: space-around;
  align-items: top;
  position: relative;
  width: 86%;
  height: 220px;
  margin: 16px auto 0;
}
.dyn_top img{
  width: 174px;
  height: 174px;
  border: 1px solid #D3D3D3;
}

.dynR {
  position: relative;
  width: 64%;
}
.dynR strong {
  position: absolute;
  left: 0;
  top: 2px;
  width: 46px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  border-radius: 4px;
  background-color: rgb(59,186,125);
}
.dynR .dynTit {
  position: absolute;
  left: 52px;
  top: 4px;
  font-size: 14pt;
  font-weight: bold;
}
.dynR span {
  position: absolute;
  left: 0;
  top: 92px;
  width: 146px;
  height: 32px;
  line-height: 32px;
  font-size: 10pt;
  border: 1px solid #D3D3D3;
  border-radius: 6px;
  cursor: pointer;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/play-4.png') no-repeat 12px 4px / 24px;
}

.dyn_bottom {
  width: 100%;
}
.dyn_bottom_p {
  width: 96px;
  height: 26px;
  font-size: 10pt;
  color: white;
  line-height: 26px;
  border-radius: 2px;
  margin-left: 78px;
  margin-bottom: 1px;
  background-color: rgb(59,186,125);
}
.dyn_b_list {
  position: relative;
  width: 100%;
  border-top: 1px solid rgb(59,168,125);
}
.dyn_b_list ul {
  padding: 0;
  margin: 0;
}
.dyn_b_list ul li {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 62px;
  cursor: pointer;
  font-size: 10pt;
  list-style-type: none;
  cursor: pointer;
}
.dusadq {
  background-color: rgb(245,245,245);
}
.dyn_b_list ul li:hover {
  background-color: rgb(245,245,245);
}

.dyn_b_list ul li p {
  position: absolute;
  left: 0;
  height: 100%;
  line-height: 62px;
  color: rgb(136,136,136);
}
.dyn_b_list ul li p:nth-child(1) {
  left: 24px;
}
.dyn_b_list ul li p:nth-child(2) {
  left: 56px;
}
.dyn_b_list ul li p:nth-child(3) {
  left: 110px;
  color: black;
}
.dyn_b_list ul li p:nth-child(4) {
  left: 420px;
}
.dyn_b_list ul li p:nth-child(5) {
  left: 532px;
}
.dyn_b_list ul li p:nth-child(6) {
  left: 632px;
}
.dyn_b_list ul li p:nth-child(7) {
  left: 742px;
}

.dyn_b_list ul li img {
  width: 40px;
  height: 40px;
  padding-top: 12px;
}

.addBorder li {
  border-bottom: 1px solid #d3d3d3;
}

.dynUs {
  position: absolute;
  left: 0;
  top: 42px;
  width: 504px;
  height: 34px;
  line-height: 34px;
  margin: 0;
}
.dynUs img {
  float: left;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.dynUs a {
  float: left;
  margin-left: 12px;
}
.dynUs a:nth-child(3) {
  color: rgb(136,136,136);
  font-size: 10pt;
}

.dynTab {
  display: inline;
  position: absolute;
  left: 0;
  top: 142px;
  height: 18px;
  line-height: 18px;
  text-align: left;
  margin: 0;
  font-size: .9rem;
  color: red;
  border: 1px solid red;
}


.dynAb {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 432px;
  height: 48px;
  font-size: .9rem;
  margin: 0;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
#addsong {
  position: absolute;
  left: 36px;
  top: 10px;
  z-index: 2;
}

.fmLimit {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 22%;
  height: 36px;
  margin: 24px auto;
}
.fmLimit li {
  list-style-type: none;
  text-decoration: underline;
  font-size: .8rem;
  width: 24px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
}
.fmLimit li:hover {
  font-weight: bold;
  border: 1px solid rgb(190,190,190);
}
.LimitIndex {
  color: red;
}
</style>
