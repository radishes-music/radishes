<template>
  <div class="singerList">
    
    <div class="singerTop" v-show="isShow">
      <img v-bind:src="classa.length === 0 ? init[0] : classa[1].imgurl">
      <div class="singerToptxt">
        <strong>歌手</strong><a>{{ classa.length === 0 ? init[1] : classa[1].classname }}</a>
        <p>歌手人数:{{ singer.length === 0 ? init[2] : singer[0].length }}</p>
      </div>
    </div>

    <div class="singer" v-show="isShow">
      <div class="model" v-for="(item,index) in imgs" @click="goList(imgs.indexOf(item))">
        <img v-bind:src="item.src">
        <p>{{ item.name }}</p>
      </div>
    </div>

    <singerLis v-show="!isShow"></singerLis>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import singerLis from './SingerLists'
import publicFn from '../Data/getData'

export default {
  data () {
    return {
      // 是否显示当前页面
      isShow: true,
      // 初始值 防止报错
      init: ['http://mobileimg.kugou.com/billImage/150/26-11.jpg', '初始值', 0],
      // 父级传递值
      classa: [],
      // 保存每个歌手需要获取的头像 hash
      imgs: [],
      // 记录歌手分类下的人数
      singer: [],
      // 保存歌手ID
      classId: [],
      // 歌手下的歌曲数据
      singerLists: [],
      // 点击全局下标
      index: 0
    }
  },
  components: {
    'singerLis': singerLis
  },
  methods: {
    // 歌手分类下的歌手
    goList: function (i) {
      this.index = i
      this.isShow = false
      this.updata(this.singerLists)
      // 获取歌手信息
      publicFn.getSingerInfo(this.classId[i], false, i, this.imgs, this.singerLists)
    },
    // 清除数据
    updata: function (array) {
      for (let j = array.length - 1; j >= 0; j--) {
        for (let i = array[j].length - 1; i >= 0; i--) {
          array.splice(i, 1)
        }
      }
    }
  },
  mounted: function () {
    // 重置页面数据
    bus.$on('updata', (e) => {
      this.isShow = true
    })
    // 监听父级歌手ID
    bus.$on('singerId', (e) => {
      this.updata(this.singer)
      this.updata(this.classa)
      this.updata(this.singerLists)
      for (let i = this.imgs.length - 1; i >= 0; i--) {
        this.imgs.splice(i, 1)
      }
      for (let i = this.classId.length - 1; i >= 0; i--) {
        this.classId.splice(i, 1)
      }
      console.log(this.imgs)
      this.classa = e
      // 获取歌手分类下面的歌手列表
      publicFn.getSingList(e[0], this.classId, this.singer, this.index, this.imgs, this.singerLists)
      console.log(this.imgs)
    })
  },
  beforeDestroy: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  transition: all .4s;
}

.singerList {
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
  top: 12px;
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

.singer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100%;
  margin: 0 auto 0;
  border-top: .5px solid #D3D3D3;
}
.model {
  position: relative;
  width: 148px;
  height: 176px;
  margin-top: 12px;
  margin-left: 6px;
  cursor: pointer;
}
.model img {
  width: 148px;
  height: 148px;
}
.model p {
  text-align: left;
  font-size: 12pt;
  margin: 0;
}
</style>
