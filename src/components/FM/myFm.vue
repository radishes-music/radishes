<template>
  <div class="myFm">
    <h1 class="myFmH"><a>我的(推荐)给我的电台</a><a>{{ djList.length }}个电台</a></h1>

    <div class="myFmContent">
      <ul v-for="(item, index) in djList" @dblclick="playFm(index)">
        <img v-bind:src="item.picUrl">
        <li>{{ item.name }}</li>
        <li>{{ item.auname }}</li>
        <li>{{ 1900 + new Date(item.createTime).getYear() + '.' + (new Date(item.createTime).getMonth() + 1) + '.' + new Date(item.createTime).getDate() }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import WyData from '../Data/WyGetData'

export default {
  name: 'myFm',
  data () {
    return {
      djList: []
    }
  },
  watch: {
  },
  methods: {
    playFm: function (index) {
      bus.$emit('left_listen', [100, this.djList[index].id])
    }
  },
  mounted: function () {
    let t = setInterval(() => {
      if (global.isLong) {
        WyData.myFm(this.djList)
        clearInterval(t)
      }
    }, 200)
    if (!global.isLong) {
      document.querySelector('.userWindow').style.display = 'block'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.myFm {
  position: relative;
  width: 100%;
}
.myFmH {
  width: 100%;
  text-align: left;
  height: 34px;
  line-height: 34px;
  margin-top: 24px;
  border-bottom: 1px solid rgb(225,225,225);
}
.myFmH a:nth-child(1) {
  font-size: 1.4rem;
  margin-left: 36px;
}
.myFmH a:nth-child(2) {
  margin-left: 24px;
  font-size: .8rem;
  color: rgb(102,102,102);
}

.myFmContent {
  position: relative;
}

.myFmContent ul {
  position: relative;
  width: 100%;
  height: 62px;
  display: flex;
  cursor: pointer;
  align-items: center;
  border-bottom: 1px solid rgb(225,225,225);
}
.myFmContent ul:hover {
  background-color: rgb(225,225,225);
}
.myFmContent ul img {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 36px;
}
.myFmContent ul li {
  position: absolute;
  left: 0;
  font-size: .9rem;
  list-style-type: none;
}
.myFmContent ul li:nth-child(2) {
  margin-left: 102px;
  color: rgb(51,51,51);
  font-weight: 600;
}
.myFmContent ul li:nth-child(3) {
  left: 520px;
  color: rgba(136,136,136);
}
.myFmContent ul li:nth-child(4) {
  left: 710px;
  color: rgba(136,136,136);
}
</style>
