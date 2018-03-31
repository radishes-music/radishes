<template>
  <div class="left">
    <div class="left_box">
      <div class="recommend">
        <p class="reccc">推荐</p>
        <ul>
          <li class="li" v-for="(item, index) in recommend" v-bind:class="all_elect_count===(index) ? 'left_border' : 'left_none'" @click="elect(index)"><img v-bind:src="item.src">{{ item.name }}</li>
        </ul>
      </div>

      <div class="recommend myMusic">
        <p class="reccc">我的音乐</p>
        <ul>
          <li class="li" v-for="(item, index) in myMusic" v-bind:class="all_elect_count===(index+4) ? 'left_border' : 'left_none'" @click="elect(index + 4)"><img v-bind:src="item.src">{{ item.name }}
          </li>
        </ul>
      </div>

      <div class="recommend myMusic listSong">
        <p class="reccc">创建(收藏)的歌单<img v-bind:src="add" alt="" v-on:mouseenter="move" v-on:mouseout="out" @click="addList"></p>
        <input type="text" name="" autofocus="autofocus">
        <ul>
          <li class="li" v-for="(item, index) in listSong" v-bind:class="all_elect_count===(index+myMusic.length+recommend.length) ? 'left_border' : 'left_none'" v-on:mouseup="removeList(index, index+myMusic.length+recommend.length)"><img v-bind:src="item.src"><p class="listConfiram">{{ item.name }}</p></li>
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
import publicBox from './Data/rightMenu'
import Storage from './Data/storageIO'
import wyData from './Data/WyGetData'
// import userData from './Data/UserData'

export default {
  data () {
    return {
      all_elect_count: 0,
      index: 0,
      recommend: [
        {
          name: '发现音乐',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/music.png'
        },
        {
          name: '私人FM',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/fm.png'
        },
        {
          name: 'MV',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/mv.png'
        },
        {
          name: '朋友',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/friend.png'
        }
      ],
      myMusic: [
        {
          name: '下载管理',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/down.png'
        },
        {
          name: '我的音乐盘',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/yun.png'
        },
        {
          name: '我的(推荐)电台',
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/station.png'
        }
      ],
      listSong: [
        {
          name: '我喜欢的音乐',
          isWy: false,
          src: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/heart.png'
        }
      ],
      songImg: 'http://singerimg.kugou.com/uploadpic/softhead/400/20170807/20170807145802238.jpg',
      songAuthor: '请添加歌曲',
      songName: '请添加歌曲',
      add: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png'
    }
  },
  methods: {
    removeList: function (index, i) {
      let e = e || window.event
      if (e.button === 0) {
        this.elect(i, index)
      } else if (e.button === 2) {
        publicBox.banMouseScrool()
        let parentBox = document.createElement('div')
        parentBox.setAttribute('id', 'boxMenu')
        parentBox.setAttribute('style', 'left: ' + this.getMousePosition(e).x + 'px; top: ' + this.getMousePosition(e).y + 'px; height: 34px; list-style-type: none;')
        let li = document.createElement('li')
        li.setAttribute('class', 'boxLi')
        if (this.listSong[index].isWy) {
          li.innerHTML = '<img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/delete.png" />' + '禁止删除歌单'
        } else {
          li.innerHTML = '<img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/delete.png" />' + '删除歌单'
        }
        li.onclick = (e) => {
          let temp = document.querySelectorAll('.listConfiram')
          Storage.removeStrong(temp[index].innerHTML)
          console.log(temp[index])
          for (let key in this.listSong) {
            if (!this.listSong[key].isWy) {
              this.listSong.splice(index, 1)
              Storage.setStrong('Loacl', this.listSong)
              break
            }
          }
          publicBox.hideSelf()
          publicBox.startMouseScrool()
        }
        parentBox.appendChild(li)
        document.querySelector('#app').appendChild(parentBox)
      }
    },
    // 获取鼠标位置
    getMousePosition: function (ev) {
      if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY}
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
      }
    },
    move: function () {
      this.add = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_1.png'
    },
    out: function () {
      this.add = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png'
    },
    addList: function () {
      // 添加歌单
      let input = document.querySelector('.listSong input')
      input.addEventListener('blur', () => {
        input.style.display = 'none'
      }, false)
      input.onkeypress = (e) => {
        if (e.keyCode === 13) {
          if (input.value !== '') {
            let temp = Storage.getStrong('Loacl')
            try {
              temp.push({
                'name': input.value,
                'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
                'isWy': false
              })
              this.listSong.push({
                'name': input.value,
                'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
                'isWy': false
              })
            } catch (e) {
              temp.push({
                'name': input.value,
                'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
                'isWy': false
              })
              this.listSong.push({
                'name': input.value,
                'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
                'isWy': false
              })
            }
            Storage.setStrong('Loacl', temp)
            Storage.setStrong(input.value, [])
            input.value = ''
            input.style.display = 'none'
          }
        }
      }
      input.style.display = 'block'
      input.focus()
    },
    // 在指定节点后添加节点
    insertAfter: function (newEl, targetEl) {
      var parentEl = targetEl.parentNode
      if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl)
      } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling)
      }
    },
    elect: function (i, index) {
      this.index = i
      let list = null
      let isWyList = false
      if (i >= 7) {
        let oLi = document.querySelectorAll('.listConfiram')
        for (var j = 0; j < this.listSong.length; j++) {
          if (this.listSong[j].isWy) { // 如果是网易就拿出歌单ID
            if (oLi[index].innerHTML === this.listSong[j].name) {
              // console.log(this.listSong[j].id)
              list = this.listSong[j].id
              isWyList = true
              break
            }
          } else {
            isWyList = false
          }
        }
      }
      // console.log(isWyList)
      let li = document.querySelectorAll('.left li')
      for (let j = 0; j < li.length; j++) {
        if (j === i) {
          li[j].style.borderLeft = '4px solid ' + global.colors
        } else {
          li[j].style.borderLeft = 'none'
        }
      }
      this.all_elect_count = i
      bus.$emit('left_listen', [i, isWyList, list])
      if (index >= 0) {
        let temp = document.querySelectorAll('.listConfiram')
        global.Initialization = temp[index].innerHTML
        bus.$emit('left_list', temp[index].innerHTML)
      }
    },
    isLycLayout: function () {
      bus.$emit('isLyc', false)
      bus.$emit('isMax', true)
    }
  },
  mounted: function () {
    document.querySelector('.left li').style.borderLeft = '4px solid rgb(59,186,125)'
    bus.$on('songControl', (e) => {
      this.songImg = e.img
      this.songAuthor = e.author_name
      this.songName = e.song_name
      // 用户数据记录
      // userData.setTxt(this.songName)
    })
    bus.$on('updataPlay', (e) => {
      let li = document.querySelectorAll('.left li')
      li[this.index].style.borderLeft = '4px solid ' + global.colors
    })
    this.listSong = Storage.getStrong('Loacl')
    // console.log(this.listSong)
    let t = setInterval(() => {
      if (global.isLong) {
        wyData.getUserInfos(global.userData[0].profile.userId, this.listSong)
        clearInterval(t)
      }
    }, 1000)
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
.recommend .reccc {
  text-align: left;
  font-size: 11pt;
  margin-left: 4px;
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
  background-color: rgb(230,231,234);
  font-weight: bold;
}
.left_none {

}
.recommend ul li:hover {
  background-color: rgb(230,231,234);
}

.myMusic {
  height: 148px;
}
.listSong {
  height: auto;
}
.listSong input {
  display: none;
  width: 94%;
  margin: 0 auto 0;
}
.listSong p {
  position: relative;
}
.listConfiram {
  width: 138px;
  height: 34px;
  line-height: 34px;
  white-space:nowrap; 
  overflow:hidden;
  text-overflow:ellipsis; 
}
.listSong p img {
  position: absolute;
  right: 22px;
  top: 2px;
  cursor: pointer;
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
