##  About music 1.0.0 (由于服务器高频访问,在线预览功能下线)

- 最新版本下载地址 https://download.csdn.net/download/chutianwu5552/10292566

- 在线预览地址 http://112.74.169.178:8090/#/

### 说明
+ 环境 : windows all, node, php

+ 请下载 < ### 网易云音乐 API> 地址 : https://binaryify.github.io/NeteaseCloudMusicApi/#/ 感谢作者

* 开始使用
    > 1, 下载Node.js (安装后会有npm环境,推荐百度关键词'cnpm'下载)
    > 2, 下载网易云音乐 API,地址: https://binaryify.github.io/NeteaseCloudMusicApi/#/ (同上,已下载请忽略)
    > 3, 解压后在根目录下使用命令 
            set port = 8091 & node app.js
    > 4, 双击打开本文件中的 run dev.bat
    > 5, 成功

* 详细说明
```
1,项目更新于2018.03.19,后面将继续完善功能.已经完善的功能有 : 
1.1 发现音乐 (登录后出现推荐歌曲,限网易手机登录)
1.2 私人FM
1.3 MV
1.4 朋友 (需登录)
1.5 下载管理
----1.0.0 我的音乐盘
----1.0.0 我的(推荐)电台
1.6 创建歌单 (本地歌单)
----1.0.0 创建歌单 (用户歌单)

2,使用 eventBus 路由数据,图标资源存储在阿里云OSS,请勿持续请求 (要钱的,哈哈)

3,详细功能说明
3.1 顶部
3.1.1 回滚 (只支持发现音乐界面回滚)
3.1.2 搜索 (从网易,酷狗搜索音乐,后续添加mv,专辑搜索功能)
----1.0.0 - 搜索 (从网易,酷狗搜索音乐,已经添加mv,歌词,歌手,歌单搜索功能)
3.1.3 登录 (限网易手机登录)
3.1.4 换肤 (提供六中颜色,后续将实现自定义颜色)
------------------------------------------------------------------------------------
3.2 侧边
3.2.1 发现音乐 (个性推荐,歌单,排行榜,歌手,最新音乐)
3.2.2 私人FM (从酷狗歌单中拉取歌曲播放)
3.2.3 MV (拉取网易MV数据,有最新MV和MV排行榜,提供播放,相似MV,最新评论,最热评论,评论点赞)
3.2.4 朋友 (需登录,只显示type=18的数据,也就是官方的数据)
3.2.5 下载管理 (从酷狗下载歌曲,显示已经下载的歌曲,可播放)
-----1.0.0 我的音乐盘 (拉取用户云盘音乐)
-----1.0.0 我的(推荐)电台 (加载用户关注电台和推荐电台)
3.2.6 创建的歌单 (从本地创建歌单,支持删除和push歌曲)
----1.0.0 - 创建(收藏)的歌单 (添加拉取用户创建与收藏的歌单)

3.2.7-n (n>无穷大) 歌曲信息栏,歌曲图片,名称,作者
------------------------------------------------------------------------------------
3.3 底部
3.3.1 上一首
3.3.2 播放,暂停
3.3.3 下一首
3.3.4 进度条 (可以拖动)
3.3.5 音量 (可以拖动)
3.3.6 播放顺序 (单曲循环,列表循环,列表随机.前提是待播放列表中已经添加歌曲)
3.3.7 播放列表 (添加歌曲,双击播放.后续添加删除单个歌曲功能,并显示已播放历史记录)
----1.0.0 播放列表添加了播放历史功能

------------------------------------------------------------------------------------
3.4 右键
3.4.1 播放选中歌曲
3.4.2 下一首播放
3.4.3 收藏到本地歌单 (需创建)
3.4.4 下载
```

## File
+ 1,src -> vue-cli生成自定义代码块与组件(在分支中更新仓库SRC即可升级到0.9.0)
```
1.1,assets -> 图片
1.2,components -> 组件
1.3,font -> 字体
1.4,router -> 路由与全局交互
1.5,APP.vue -> 入口
1.6,main.js -> vue实例化
```

+ 2,build -> vue-cli生成打包生成文件包括webpack配置(生成环境)
+ 3,config -> vue-cli生成的配置文件包括webpack配置(开发环境)
+ 4,dist -> vue-cli打包文件夹名称,在config->index.js中修改

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

 -> disc
    -> disc.vue 我的音乐盘

 -> downFile
    -> downLoad.vue 下载

 -> FM
    -> Fm.vue FM
    -> myFm.vue 我的电台
    -> myFmPlay.vue 播放FM

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

 -> Singer
    -> AlbumList.vue 专辑信息
    -> Singer.vue 歌手

 -> SongListDetails
    -> PersonalList.vue 个人歌单
    -> wyDay.vue 网易每日推荐歌单
    -> wyListDetails.vue 网易歌单详情
    -> SingerList.vue 歌手详情组件
    -> SingerLists.vue 歌手分类下的歌手列表组件
    -> SongListDetails.vue 歌单详情组件
```
