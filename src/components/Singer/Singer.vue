<template>
  <div class="Singer">
    <div class="SingerDetails">
      <img v-bind:src="artist.length!==0?artist[0].picUrl:null">
      <div class="SingerAublme">
        <p><i id="SingerTab">歌手</i><span>{{ artist.length!==0?artist[0].name:null }}</span></p>
        <p>{{ artist.length!==0?artist[0].alias:null }}</p>
        <ul>
          <li><a>单曲数: </a><span>{{ artist.length!==0?artist[0].musicSize:null }}</span></li>
          <li><a>专辑数: </a><span>{{ artist.length!==0?artist[0].albumSize:null }}</span></li>
        </ul>
      </div>
    </div>

    <div class="SingerData">
      <div class="SingerTab">
        <li @click="SingerClick(0)" v-bind:class="index===0?'SingerClick':null">专辑</li>
        <li @click="SingerClick(1)" v-bind:class="index===1?'SingerClick':null">MV</li>
        <li @click="SingerClick(2)" v-bind:class="index===2?'SingerClick':null">歌手详情</li>
        <li @click="SingerClick(3)" v-bind:class="index===3?'SingerClick':null">相似歌手</li>
      </div>
      <div class="SingerDataView">
        <div class="SingerAlbum" v-if="index===0?true:false">
          <li v-for="(item, index) in hotAlbums" @click="goAlbum(index)">
            <img v-bind:src="item.picUrl">
            <p>{{ item.name }}</p>
            <a>{{ 1990+new Date(item.dt).getYear()+'-'+(new Date(item.dt).getMonth()+1)+'-'+new Date(item.dt).getDate() }}</a>
            <div></div>
          </li>
        </div>
        <div class="SingerMV" v-if="index===1?true:false">
          <li v-for="(item, index) in SingerMV" @click="goMv(index)">
            <img v-bind:src="item.imgurl">
            <p>{{ item.playCount / 10000 > 0 ? parseInt(item.playCount / 10000) +'万' : item.playCount / 10000 }}</p>
            <p>{{ '0'+(item.duration/60).toFixed(2) }}</p>
            <p>{{ item.name }}</p>
          </li>
        </div>
        <div class="SingerDetailsOfTab" v-if="index===2?true:false">
          <h3>{{ SingerName + '简介'}}</h3>
          <div>{{ SingerDetails.length!==0?SingerDetails[0].briefDesc:null }}</div>
          <h3>{{ SingerDetails.length!==0?SingerDetails[0].introduction[0].ti:null}}</h3>
          <div>{{ SingerDetails.length!==0?SingerDetails[0].introduction[0].txt:null }}</div>
          <h3>{{ SingerDetails.length!==0?SingerDetails[0].introduction[1].ti:null}}</h3>
          <div v-html="SingerDetails.length!==0?SingerDetails[0].introduction[1].txt:null"></div>
          <h3>{{ SingerDetails.length!==0?SingerDetails[0].introduction[2].ti:null}}</h3>
          <div v-html="SingerDetails.length!==0?SingerDetails[0].introduction[2].txt:null"></div>
        </div>
        <div class="SingerSimilar" v-if="index===3?true:false">
          <li v-for="(item, index) in SingerSimilar">
            <img v-bind:src="item.picUrl" @click="goSimi(index)">
            <p>{{ item.name }}</p>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import WyData from '../Data/WyGetData'

export default {
  name: 'Singer',
  data () {
    return {
      artist: [],
      hotAlbums: [],
      SingerMV: [],
      SingerDetails: [],
      SingerSimilar: [],
      SingerID: 0,
      SingerName: 'Link',
      index: 0
    }
  },
  components: {
  },
  methods: {
    goSimi: function (index) {
      console.log(this.SingerSimilar[index].id)
      this.index = 0
      this.artist.splice(0, this.artist.length)
      bus.$emit('Singer', this.SingerSimilar[index].id)
    },
    goMv: function (index) {
      console.log(this.SingerMV[index].id)
      WyData.playMv(this.SingerMV[index].id)
      bus.$emit('isMvPlay', true)
    },
    goAlbum: function (index) {
      console.log(this.hotAlbums[index].id)
      // WyData.getAublmContent(this.hotAlbums[index].id)
      bus.$emit('left_listen', [88, true, this.hotAlbums[index].id])
    },
    clearData: function () {
      this.SingerMV.splice(0, this.SingerMV.length)
      this.hotAlbums.splice(0, this.hotAlbums.length)
      this.SingerDetails.splice(0, this.SingerDetails.length)
      this.SingerSimilar.splice(0, this.SingerSimilar.length)
    },
    SingerClick: function (index) {
      console.log(index)
      this.index = index
      this.clearData()
      switch (index) {
        case 1 : WyData.getSingerMv(this.SingerID, this.SingerMV); break
        case 2 : WyData.getSingerDetils(this.SingerID, this.SingerDetails)
          this.SingerName = this.artist[0].name
          let t = setInterval(() => {
            if (this.SingerDetails.length !== 0) {
              let str = this.SingerDetails[0].introduction[1].txt
              let strs = this.SingerDetails[0].introduction[2].txt
              this.SingerDetails[0].introduction[1].txt = str.replace(/(\r\n)|(\n)/g, '<br>&nbsp&nbsp&nbsp')
              this.SingerDetails[0].introduction[2].txt = strs.replace(/(\r\n)|(\n)/g, '<br>&nbsp&nbsp')
              clearInterval(t)
            }
          }, 200)
          break
        case 3 : WyData.getSingerSimi(this.SingerID, this.SingerSimilar); break
        default :
          WyData.getSingerAublm(this.SingerID, 30, this.artist, this.hotAlbums)
          break
      }
    }
  },
  mounted: function () {
    bus.$on('Singer', (id) => {
      this.clearData()
      console.log(id)
      this.SingerID = id
      this.artist.splice(0, 1)
      WyData.getSingerAublm(id, 30, this.artist, this.hotAlbums)
    })
  },
  updated: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.Singer {
  position: relative;
  width: 100%;
}

.SingerDetails {
  position: relative;
  width: 100%;
  height: 240px;
}
.SingerDetails img {
  position: absolute;
  left: 40px;
  top: 20px;
  height: 198px;
}
.SingerAublme {
  position: relative;
  width: 60%;
  height: 82%;
  margin-left: 302px;
  top: 20px;
}
.SingerAublme p {
  text-align: left;
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.SingerAublme p:nth-child(1) span{
  display: inline-block;
  font-size: 1.4rem;
  margin-left: 12px;
  color: rgb(51,51,51);
}
.SingerAublme p:nth-child(2) {
  margin-left: 50px;
  font-size: .9rem;
}
#SingerTab {
  display: inline-block;
  width: 38px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  font-size: .9rem;
  background-color: rgb(198,47,47);
  color: white;
  font-style: normal;
  border-radius: 2px;
}
.SingerAublme ul {
  margin-top: 18px;
}
.SingerAublme ul li a {
  color: black;
}
.SingerAublme li {
  list-style-type: none;
  text-align: left;
  font-size: .9rem;
  text-indent: 1.4rem;
  margin-top: 8px;
  color: rgb(136,136,136);
}
.SingerAublme li:nth-child(1) {
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/SingerMusic.png') no-repeat;
}
.SingerAublme li:nth-child(2) {
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/album.png') no-repeat;
}

.SingerData {
  position: relative;
  width: 100%;
  margin-top: 36px;
}
.SingerTab {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid rgb(59,186,125);
  padding-bottom: 1px;
}
.SingerClick {
  background-color: rgb(59,186,125);
  color: white;
}
.SingerTab li {
  float: left;
  list-style-type: none;
  width: 82px;
  height: 100%;
  line-height: 30px;
  text-align: center;
  margin-left: 4px;
  margin-bottom: 1px;
  border: 1px solid rgb(225,225,225);
  border-bottom: none;
  font-size: .9rem;
  cursor: pointer;
}
.SingerTab li:nth-child(1) {
  margin-left: 34px;
}
.SingerAlbum li {
  position: relative;
  float: left;
  list-style-type: none;
  width: 24%;
  height: 182px;
  margin-left: 6px;
  margin-top: 36px;
  cursor: pointer;
}
.SingerAlbum li img {
  width: 138px;
  border: .5px solid rgb(225,225,225);
  z-index: 2;
}
.SingerAlbum li p {
  width: 70%;
  margin: 4px auto;
  font-size: .9rem;
  text-align: left;
  z-index: 2;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.SingerAlbum li a {
  font-size: .8rem;
  float: left;
  padding-left: 30px;
  color: rgb(136,136,136);
  z-index: 2;
}
.SingerAlbum li:hover div{
  opacity: .4;
}
.SingerAlbum div {
  position: absolute;
  right: 36px;
  bottom: 48px;
  width: 18px;
  height: 18px;
  background: #ccc url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/box-0.png') no-repeat;
  opacity: 0;
  border-radius: 50%;
  transition: opacity .6s;
}
.SingerAlbum div:hover {
  opacity: .8;
}

.SingerMV {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: left;
  flex-wrap: wrap;
  padding-top: 24px;
}
.SingerMV li {
  position: relative;
  width: 24%;
  list-style-type: none;
  margin-bottom: 42px;
  cursor: pointer;
}
.SingerMV li img {
  /*height: 92px;*/
  width: 162px;
}
.SingerMV li p {
  position: absolute;
  left: 0;
  top: 0;
  font-size: .9rem;
}
.SingerMV li p:nth-child(2) {
  text-indent: 124px;
  width: 100%;
  color: white;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png') no-repeat -62px 0px;
}
.SingerMV li p:nth-child(3) {
  left: 22px;
  top: 104px;
  color: white;
}
.SingerMV li p:nth-child(4) {
  left: 14px;
  top: 128px;
  font-size: .98rem;
  font-weight: 500;
  width: 84%;
  text-align: left;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
.SingerDetailsOfTab {
  position: relative;
  padding: 34px;
}
.SingerDetailsOfTab h3 {
  text-align: left;
  font-size: 1rem;
}
.SingerDetailsOfTab div {
  margin-top: 12px;
  text-indent: 24px;
  text-align: left;
  line-height: 24px;
  margin-bottom: 24px;
  color: rgb(102,102,102);
}

.SingerSimilar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 24px;
}
.SingerSimilar li {
  list-style-type: none;
  width: 20%;
  padding-bottom: 24px;
}
.SingerSimilar li img {
  width: 116px;
  cursor: pointer;
}
.SingerSimilar li p {
  font-size: .9rem;
  padding-top: 4px;
}
</style>
