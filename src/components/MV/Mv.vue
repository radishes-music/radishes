<template>
  <div class="mv">

    <div>
      <span class="spc"></span>
      <div class="mvTab" @click="tabSwitch">
        <span id="1" v-bind:class="tab ? 'S' : 'B'">MV精选</span>
        <span id="2" v-bind:class="!tab ? 'S' : 'B'">最新MV</span>
      </div>
    </div>
    <div class="jx_" v-show="tab">

      <div>
        <h1 class="mvTitle">最新MV<a @click="more">更多></a></h1>
        <div class="mvJx_">
          <li v-for="(item, index) in mvList" @click="MvPlay(index, 0)">
            <div class="mvJxImg_">
              <img v-bind:src="item.cover" class="mvJxImgCover">
              <span><img class="sqw" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png"><div class="sis"><a>{{ item.playCount > 10000 ? parseInt(item.playCount / 10000)  + '万': item.playCount }}</a><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/video.png"></div></span>
              <p>{{ item.briefDesc }}</p>
            </div>
            <p class="mvJx_n">{{ item.name }}</p>
            <p class="mvJx_an">{{ item.artistName }}</p>
          </li>
        </div>
      </div>

      <div>
        <h1 class="mvTitle">MV排行榜</h1>
        <div class="mvPhb_">
          <li v-for="(item, index) in mvPList" v-bind:class="((index + 1) % 2) === 0 ? 'evenN' : 'odd'" @click="MvPlay(index, 1)">
            <span>{{ index === 9 ? '10' : ('0' + (index + 1)) }}</span>
            <span><a><img class="mvphb_main_img" v-bind:src="item.cover"><img class="phbi" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png"><a class="sdq">{{ '热度: ' + item.score }}</a></a></span>
            <span>
              <p>{{ item.name }}</p>
              <p>{{ item.artistName }}</p>
              <p>{{ item.briefDesc }}</p>
            </span>
          </li>
        </div>
      </div>

    </div>

    <div class="qb_" v-show="!tab">
      <h1 class="mvTitle">全部MV</h1>
      <div class="mvJx_ mvJx_s">
        <li v-for="(item, index) in allMvList" @click="MvPlay(index, 2)">
          <div class="mvJxImg_">
            <img v-bind:src="item.cover" class="mvJxImgCover">
            <span><img class="sqw" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/linear-black.png"><div class="sis"><a>{{ item.playCount > 10000 ? parseInt(item.playCount / 10000)  + '万': item.playCount }}</a><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/video.png"></div></span>
            <p>{{ item.briefDesc }}</p>
          </div>
          <p class="mvJx_n">{{ item.name }}</p>
          <p class="mvJx_an">{{ item.artistName }}</p>
        </li>
      </div>
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
      isPlay: false,
      tab: true,
      mvList: [],
      allMvList: [],
      mvPList: [],
      IndexI: 0,
      loadIndex: 0
    }
  },
  watch: {
    tab: {
      handler: function (newvalue, old) {
        if (!newvalue) {
          let node = document.querySelector('.right')
          node.onscroll = (e) => {
            // 数据懒加载 AdvancePx是提前像素加载数据
            let AdvancePx = 12
            if (node.scrollTop > 600 + 3 * (176 - AdvancePx) * this.loadIndex) {
              this.IndexI += 9
              GetMvData.getMv(this.IndexI, 3 * 3, this.allMvList)
              this.loadIndex ++
            }
          }
        } else {
          this.loadIndex = 0
        }
      },
      deep: true
    }
  },
  components: {
  },
  methods: {
    MvPlay: function (index, wd) {
      this.isPlay = true
      // console.log(index)
      switch (wd) {
        case 0 : this.mvPlayId(this.mvList, index); break // mvList
        case 1 : this.mvPlayId(this.mvPList, index); break // mvPList
        case 2 : this.mvPlayId(this.allMvList, index); break // allMvList
      }
    },
    mvPlayId: function (data, index) {
      // console.log(data[index].id)
      // playMv
      GetMvData.playMv(data[index].id)
      bus.$emit('isMvPlay', true)
    },
    tabSwitch: function (e) {
      e = e.target
      if (e.id === '1') {
        this.tab = true
      }
      if (e.id === '2') {
        this.tab = false
      }
    },
    more: function () {
      this.tab = false
    }
  },
  mounted: function () {
    GetMvData.getMv(0, 6, this.mvList)
    GetMvData.recommenMv(10, this.mvPList)
    GetMvData.getMv(this.IndexI, 18, this.allMvList)
  },
  beforeMount: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mv {
  position: relative;
  width: 100%;
  height: 100%;
}
.spc {
  padding-top: 12px;
  display: block;
}
.mvTab {
  position: relative;
  margin: 0 auto 0;
  width: 30%;
  height: 30px;
  font-size: 10pt;
  letter-spacing: 1px;
  cursor: pointer;
}
.mvTab span {
  float: left;
  width: 49%;
  height: 28px;
  line-height: 28px;
  border: 1px solid rgb(124,125,133);
}
.mvTab span:nth-child(1) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.mvTab span:nth-child(2) {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.S {
  background-color: rgb(124,125,133);
  color: white;
  border-right: none;
}
.B {
  background-color: white;
  color: rgb(136,136,136);
  border-left: none;
}
.mvTitle {
  width: 88%;
  margin: 24px auto 0;
  padding-bottom: 6px;
  font-size: 1em;
  text-align: left;
  font-weight: 500;
  letter-spacing: 2px;
  border-bottom: 1px solid #ccc;
}
.mvTitle a {
  float: right;
  font-size: 8pt;
  cursor: pointer;
}

.mvJx_ {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin: 6px auto 0;
  width: 88%;
  height: 400px;
}
.mvJx_s {
  height: auto;
  overflow: auto;
  margin-top: 18px;
}

.mvJx_ li {
  position: relative;
  list-style-type: none;
  width: 30%;
  height: 176px;
  cursor: pointer;
}
.mvJx_s li {
  height: 190px;
}
.mvJx_ p{
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.mvJxImg_ {
  position: relative;
  height: 136px;
  border: 1px solid #ccc;
}
.mvJxImgCover {
  width: 100%;
  height: 100%;
}
.mvJxImg_ span {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  letter-spacing: 1px;
}

.mvJxImg_ .sqw {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.sis {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.sis img {
  float: right;
  margin-right: 4px;
  margin-top: 3px;
  width: 16px;
  height: 16px;
}
.sis a {
  color: white;
  float: right;
  margin-right: 4px;
}
.mvJxImg_ p {
  position: absolute;
  width: 90%;
  margin-bottom: 0;
  text-indent: 4px;
  text-align: left;
  left: 0;
  bottom: 4px;
  color: white;
  font-size: 10pt;
}
.mvJx_n {
  text-align: left;
  font-size: 10pt;
  margin-top: 6px;
  margin-bottom: 0;
  letter-spacing: 1px;
}
.mvJx_an {
  margin-top: 2px;
  text-align: left;
  color: rgb(124,124,124);
  font-size: 8pt;
  letter-spacing: 1px;
}

.mvPhb_ {
  position: relative;
  width: 716px;
  height: 664px;
  margin: 12px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.mvPhb_ li {
  position: relative;
  list-style-type: none;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-right: 4px;
  border-bottom: 1px solid rgb(240,240,240);
}

.mvPhb_ li span:nth-child(1) {
  width: 36px;
  height: 100%;
  line-height: 90px;
  font-size: 16pt;
  letter-spacing: 2px;
  color: #ccc;
}
.mvPhb_ li span:nth-child(2) {
  position: relative;
  width: 160px;
  height: 90px;
  cursor: pointer;
  letter-spacing: 1px;
}
.mvPhb_ li span:nth-child(3) {
  width: 168px;
  height: 90px;
}
.mvPhb_ .sdq {
  position: absolute;
  right: 0;
  top: 0;
  color: white;
  font-size: 10pt;
}
.mvPhb_ .phbi {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.mvphb_main_img {
  width: 100%;
  height: 100%;
}
.mvPhb_ p {
  margin: 0;
  padding: 0;
  font-size: 10pt;
  text-align: left;
}
.mvPhb_ p:nth-child(1) {
  margin-top: 4px;
  margin-left: 4px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.mvPhb_ p:nth-child(2) {
  margin-top: 8px;
  margin-left: 4px;
  color: rgb(102,102,102);
}
.mvPhb_ p:nth-child(3) {
  margin-top: 16px;
  margin-left: 4px;
  color: rgb(136,136,136);
}

.odd {
  border-right: 1px solid rgb(240,240,240);
  width: 357px;
}
.evenN {
  width: 350px;
}
</style>
