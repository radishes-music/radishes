##  About music 0.9.0

最新版本下载地址 https://download.csdn.net/download/chutianwu5552/10292566

在线预览地址 http://112.74.169.178/#/

## File
### 1,src -> vue-cli生成自定义代码块与组件(在分支中更新仓库SRC即可升级到0.9.0)
```
1.1,assets -> 图片
1.2,components -> 组件
1.3,font -> 字体
1.4,router -> 路由与全局交互
1.5,APP.vue -> 入口
1.6,main.js -> vue实例化
```

### 2,build -> vue-cli生成打包生成文件包括webpack配置(生成环境)
### 3,config -> vue-cli生成的配置文件包括webpack配置(开发环境)
### 4,dist -> vue-cli打包文件夹名称,在config->index.js中修改

## Components 

```
 -> Hello.vue 组件入口
 -> ExTitle.vue 上边栏
 -> FlexLeft.vue 左边栏
 -> lycLayout.vue 歌词

 -> Data
    -> getData.js 请求数据
    -> resource.js 资源
    -> rightMenu.js 右键菜单
    -> storageIO.js H5存储
    -> UserData.js 记录用户播放
    -> WyGetData.js 网易API

 -> downFile
    -> downLoad.vue 下载

 -> FM
    -> Fm.vue FM

 -> foundMusic
    -> FlexRight.vue 右边栏框架
    -> FlexRight_latest_music.vue 最新音乐组件
    -> FlexRight_leaderboard.vue 排行榜
    -> FlexRight_playlist.vue 右下角播放列表
    -> FlexRight_recommendation.vue 推荐组件
    -> FlexRight_singer.vue 歌手

 -> Friend
    -> Friend.vue 朋友

 -> MV
    -> Mv.vue MV
    -> MvPlay.vue MV详情

 -> play
    -> play.vue 播放组件(控制上一首,下一首,播放，暂停,进度调,音量,播放顺序,播放列表)

 -> SongListDetails
    -> PersonalList.vue 个人歌单
    -> wyDay.vue 网易每日推荐歌单
    -> wyListDetails.vue 网易歌单详情
    -> SingerList.vue 歌手详情组件
    -> SingerLists.vue 歌手分类下的歌手列表组件
    -> SongListDetails.vue 歌单详情组件
```
