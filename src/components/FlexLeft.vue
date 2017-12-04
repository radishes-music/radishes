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

      <div class="lysControl" @click="isLycLayout">
        <div class="songImg">
          <img v-bind:src="songImg">
        </div>
        <div class="songInfo">
          <p>{{ songName }}</p>
          <p>{{ songAuthor }}</p>
        </div>
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
      ],
      songImg: 'http://singerimg.kugou.com/uploadpic/softhead/400/20170807/20170807145802238.jpg',
      songAuthor: '陈奕迅',
      songName: '陪你度过漫长岁月'
    }
  },
  methods: {
    elect: function (i) {
      this.all_elect_count = i
      bus.$emit('left_listen', i)
    },
    isLycLayout: function () {
      bus.$emit('isLyc', false)
      bus.$emit('isMax', true)
    }
  },
  mounted: function () {
    bus.$on('songControl', (e) => {
      this.songImg = e.img
      this.songAuthor = e.author_name
      this.songName = e.song_name
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::scrollbar{width:6px;height:4px}
::-webkit-scrollbar{width:6px;height:4px}
::-webkit-scrollbar-track{background-color: rgb(245,245,247);}
::-webkit-scrollbar-thumb{background-color: rgb(200,200,200);}
::-moz-scrollbar{width:6px;height:4px}
::-moz-scrollbar-track{background-color: rgb(245,245,247);}
::-moz-scrollbar-thumb{background-color: rgb(200,200,200)}


@keyframes mymove {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.left {
  position: relative;
  float: left;
  width: 200px;
  height: 572px;
  animation: mymove .4s;
  opacity: 1;
  border-right: 1px solid #D2D2D2;
  background-color: rgb(245,245,247);
}

.left_box {
  width: 100%;
  height: 458px;
  overflow-y: auto;
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

.lysControl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 52px;
  width: 100%;
  height: 62px;
  background-color: rgb(250,250,250);
  border-top: 1px solid rgb(230,231,234);
  cursor: pointer;
}

.songImg {
  width: 62px;
  height: 100%;
  border-right: 1px solid rgb(230,231,234);
}
.songImg img {
  width: 100%;
  height: 100%;
}
.songInfo {
  width: 64%;
  height: 100%;
}
.songInfo p {
  border: none;
  margin: 0;
  padding: 0;
  height: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-weight: 500;
}
.songInfo p:nth-child(1) {
  font-size: 10pt;
  margin-top: 8px;
}
.songInfo p:nth-child(2) {
  font-size: 8pt;
  margin-top: 6px;
}
</style>
