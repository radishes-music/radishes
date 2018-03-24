import bus from '../../router/eventBus'
import Storage from './storageIO'
export default {
  // 初始化
  creat: function (x, y, info, __songList) {
    let parentBox = document.createElement('div')
    parentBox.setAttribute('id', 'boxMenu')
    parentBox.setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px;')
    // 设置选项
    let ul = document.createElement('ul')
    ul.setAttribute('class', 'boxUl')
    let title = ['播放', '下一首播放', '收藏到歌单', '下载']
    let imgSrc = 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/box-'
    for (var i = 0; i < 4; i++) {
      let li = document.createElement('li')
      li.setAttribute('class', 'boxLi')
      li.innerHTML = '<img src="' + imgSrc + i + '.png" />' + title[i]
      if (i === 2) {
        let p = document.createElement('p')
        p.setAttribute('id', 'marke')
        p.innerHTML = '➤'
        li.appendChild(p)
      }
      ul.appendChild(li)
    }
    parentBox.appendChild(ul)
    document.querySelector('#app').appendChild(parentBox)
    // 监听鼠标左键
    this.monitorLeft(info, __songList)
  },
  // 监听鼠标左键
  monitorLeft: function (info, __songList) {
    let temp = document.querySelectorAll('.boxLi')
    for (let i = 0; i < temp.length; i++) {
      temp[i].onclick = (e) => {
        if (i === 0) {
          bus.$emit('AudioSrc', info.url)
          bus.$emit('songControl', {
            'img': info.img,
            'author_name': info.author_name,
            'song_name': info.song_name,
            'lyc': info.lyc,
            'isWy': info.isWy
          })
        }
        if (i === 1) {
          __songList.push(info)
          bus.$emit('songlength', __songList.length)
        }
        if (i === 3) {
          this.downLoadFile(info.url)
          let data = new Date()
          console.log(info)
          let resultSingle = JSON.parse(window.localStorage.getItem('musicLink') || '[]')
          resultSingle.push({
            'name': info.author_name,
            'songname': info.song_name,
            'duration': info.duration,
            'hash': info.hash,
            'time': data.getHours() + ' : ' + data.getMinutes()
          })
          window.localStorage.setItem('musicLink', JSON.stringify(resultSingle))
          bus.$emit('updated', true)
        }
        this.hideSelf()
      }
    }
    temp[2].onmouseenter = (e) => {
      let p = document.createElement('span')
      let ul = document.createElement('ul')
      ul.setAttribute('class', 'boxUl')
      let len = Storage.getStrong('Loacl')
      for (let i = 0; i < len.length; i++) {
        let li = document.createElement('li')
        li.setAttribute('class', 'boxLi')
        li.innerHTML = '<img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png" /><p class="listSongName">' + len[i].name + '</p>'
        li.onclick = () => {
          let temp = document.querySelectorAll('.listSongName')
          let _a = Storage.getStrong(temp[i].innerHTML)
          _a.push(info)
          Storage.setStrong(temp[i].innerHTML, _a)
        }
        ul.appendChild(li)
      }
      p.appendChild(ul)
      temp[2].appendChild(p)
    }
    temp[2].onmouseleave = (e) => {
      // temp[2].removeChild(document.querySelector('#boxMenu span'))
    }
  },
  // 隐藏自身
  hideSelf: function () {
    document.querySelector('#app').removeChild(document.querySelector('#boxMenu'))
  },
  // 禁止鼠标滚动
  banMouseScrool: function () {
    window.onmousewheel = document.onmousewheel = (e) => {
      return false
    }
  },
  // 启动鼠标滚动
  startMouseScrool: function () {
    window.onmousewheel = document.onmousewheel = (e) => {
      return true
    }
  },
  // 下载文件
  downLoadFile: function (sUrl) {
    if (/(iP)/g.test(navigator.userAgent)) {
      alert('Your device does not support files downloading. Please try again in desktop browser.')
      return false
    }
    var link = document.createElement('a')
    link.href = sUrl
    if (link.download !== undefined) {
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length)
      link.download = fileName
    }
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
}
