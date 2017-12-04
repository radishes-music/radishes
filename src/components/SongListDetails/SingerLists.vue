<template>
  <div class="singerLists">

    <div class="singerTop">
      <img v-bind:src="classas.length === 0 ? inits[0] : classas[0][1]">
      <div class="singerToptxt">
        <strong>歌手</strong><a>{{ classas.length === 0 ? inits[1] : classas[0][0] }}</a>
        <p>单曲数: {{ singerData.length === 0 ? 0 : singerData[0].length }}</p>
      </div>
    </div>

    <div class="singerBottom">
      <p class="p">单曲</p>
      <div class="list">
        <ul>
          <li v-for="(item,index) in singerData[0]" @dblclick="setAudioSrc(singerData[0].indexOf(item))">
            <img v-bind:src="img[index]" id="addsong" v-on:mouseenter="enter(index)" v-on:mouseleave="levae(index)" title="添加到播放队列" @click="addSongList(index)">
            <strong>{{ index+1 }}</strong>
            <p>{{ item.name }}</p>
            <a>{{ (item.duration/60).toFixed(2) }} 分</a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicFn from '../Data/getData'

export default {
  name: 'singerLists',
  data () {
    return {
      // 添加队列图片
      img: [],
      // 初始化值 防止弹出错误
      inits: ['http://mobileimg.kugou.com/billImage/150/26-11.jpg', '初始值', 0],
      // 父级组件传递过来的信息 提高加载速度
      classas: [],
      // 歌单下歌曲信息
      singerData: [],
      // 歌单下歌曲地址 给播放组件播放
      src: []
    }
  },
  watch: {
  },
  methods: {
    enter: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
    },
    // 添加到队列
    addSongList: function (i) {
      publicFn.play(this.singerData[0][i].hash, false, this.singerData[0][i].duration, this.__songList)
    },
    setAudioSrc: function (i) {
      publicFn.play(this.singerData[0][i].hash, true)
    },
    // 清除歌单歌曲数据
    updata: function (array) {
      for (let j = array.length - 1; j >= 0; j--) {
        for (let i = array[j].length - 1; i >= 0; i--) {
          array.splice(i, 1)
        }
      }
    }
  },
  mounted: function () {
    // 监听父级组件传递过来的值
    bus.$on('singerAudio', (e) => {
      for (var ii = this.src.length - 1; ii >= 0; ii--) {
        this.src.splice(ii, 1)
      }
      this.updata(this.classas)
      this.updata(this.singerData)
      this.singerData.push(e[0])
      this.classas.push(e[1])
      for (let i = 0; i < this.singerData[0].length - 1; i++) {
        this.img.push('http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
      }
    })
  },
  beforeDestroy: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.singerLists {
  position: relative;
  float: right;
  width: 100%;
}

.singerTop {
  display: flex;
  justify-content: space-around;
  align-items: top;
  position: relative;
  width: 86%;
  height: 220px;
  margin: 16px auto 0;
}
.singerTop img{
  width: 174px;
  height: 174px;
  border: 1px solid #D3D3D3;
}
.singerToptxt {
  position: relative;
  width: 64%;
}
.singerToptxt strong {
  position: absolute;
  left: 0;
  top: 12px;
  width: 46px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  background-color: rgb(59,168,125);
  border-radius: 4px;
}
.singerToptxt a {
  position: absolute;
  left: 52px;
  top: 14px;
  font-size: 12pt;
  font-weight: bold;
}
.singerToptxt p {
  position: absolute;
  left: 0;
  top: 88px;
  font-size: 9pt;
  text-align: left;
}

.singerBottom {
  position: relative;
  width: 96%;
  margin-top: 34px;
  border-top: 1px solid #D3D3D3;
}
.p {
  position: absolute;
  top: -24px;
  left: 34px;
  width: 126px;
  height: 24px;
  line-height: 24px;
  margin: 0;
  font-size: 12pt;
  background-color: rgb(59,168,125);
  color: white;
  cursor: pointer;
}
.list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}
.list ul {
  position: relative;
  width: 100%;
}
.list li {
  position: relative;
  width: 100%;
  height: 24px;
  line-height: 24px;
  margin-top: 8px;
  background-color: rgb(245,245,245);
  list-style-type: none;
  cursor: pointer;
}
.list strong {
  position: absolute;
  left: 0;
  top: 2px;
}
.list p {
  position: absolute;
  left: 36px;
  top: 2px;
  margin: 0;
  font-size: 10pt;
}
.list a {
  position: absolute;
  right: 36px;
  top: 2px;
  font-size: 10pt;
}
.list img {
  position: absolute;
  left: -26px;
  top: 4px;
}
</style>
