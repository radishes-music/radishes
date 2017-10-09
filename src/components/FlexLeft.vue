<template>
  <div class="left">
    <div class="left_box">
      <div class="recommend">
        <p>推荐</p>
        <ul>
          <li class="li" v-for="item in recommend" v-bind:class="all_elect_count===recommend.indexOf(item) ? 'left_border' : 'left_none'" @click="elect(recommend.indexOf(item))"><img v-bind:src="item.src">{{ item.name }}</li>
        </ul>
      </div>

      <div class="recommend myMusic">
        <p>我的音乐</p>
        <ul>
          <li class="li" v-for="item in myMusic" v-bind:class="all_elect_count===(myMusic.indexOf(item)+myMusic.length-1) ? 'left_border' : 'left_none'" @click="elect(myMusic.indexOf(item)+myMusic.length-1)"><img v-bind:src="item.src">{{ item.name }}
          </li>
        </ul>
      </div>

      <div class="recommend myMusic listSong">
        <p>创建的歌单</p>
        <ul>
          <li class="li" v-for="item in listSong" v-bind:class="all_elect_count===(listSong.indexOf(item)+myMusic.length+recommend.length) ? 'left_border' : 'left_none'" @click="elect(listSong.indexOf(item)+myMusic.length+recommend.length)"><img v-bind:src="item.src">{{ item.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../router/eventBus'

export default {
  data () {
    return {
      all_elect_count: 0,
      recommend: [
        {
          name: '发现音乐',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/music.png'
        },
        {
          name: '私人FM',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/fm.png'
        },
        {
          name: 'MV',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/mv.png'
        },
        {
          name: '朋友',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/friend.png'
        }
      ],
      myMusic: [
        {
          name: '本地音乐',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/lMusic.png'
        },
        {
          name: '下载管理',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/down.png'
        },
        {
          name: '我的音乐盘',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/yun.png'
        },
        {
          name: '我的歌手',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/singer.png'
        },
        {
          name: '我的电台',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/station.png'
        }
      ],
      listSong: [
        {
          name: '我喜欢的音乐',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/heart.png'
        },
        {
          name: '歌单',
          src: 'http://www.linkorg.club/onWeb/public/External/testImg/singlist.png'
        }
      ]
    }
  },
  methods: {
    elect: function (i) {
      this.all_elect_count = i
      bus.$emit('left_listen', i)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left {
  position: relative;
  float: left;
  width: 200px;
  height: 572px;
  border-right: 1px solid #D2D2D2;
  background-color: rgb(245,245,247);
}

.left_box {
  width: 100%;
  height: 572px;
}
.recommend {
  width: 100%;
  height: 178px;
  color: rgb(125,125,125);
  overflow: hidden;
}
.recommend p {
  text-align: left;
  margin-left: 12px;
  margin-top: 12px;
  margin-bottom: 2px;
  font-size: 11pt;
}
.recommend ul {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin-top: 4px;
  list-style-type: none;
}
.li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 34px;
  text-align: left;
  color: rgb(92,92,92);
  padding-left: 12px;
  font-size: 10pt;
  cursor: pointer;
}
.li img {
  margin-right: 12px;
}
.left_border {
  padding-left: 8px;
  border-left: 4px solid rgb(59,186,125);
  background-color: rgb(230,231,234);
  font-weight: bold;
}
.left_none {

}
.recommend ul li:hover {
  background-color: rgb(230,231,234);
}

.myMusic {
  height: 208px;
}
</style>
