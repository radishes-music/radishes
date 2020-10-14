## Radishes 2.0.0

`Radishes`是这个项目的名称，它是由`萝卜`翻译而来。

项目目前还在 rfc 阶段，只有一个大致方向，具体细节可以讨论。

界面表现和功能参考 windows 网易云音乐界面和 ios 的网易云音乐，会对一些功能进行移动端支持。希望能找到合适的基于 vue3 的移动端打包工具（非套壳）。

效果预览

![1602311162_1_.png](https://i.loli.net/2020/10/10/KENapbVBjdt42ZU.png)
![0b899f2e26e82bb8dfa5f8abcf93b54.png](https://i.loli.net/2020/10/10/skXDJVZWYB7cKR8.png)

项目成立原因：

- 通过完成此项目，接触 vue3 以及周边生态。
- [TypeScript 4.x](https://github.com/Microsoft/TypeScript) 已经发布，它的好处已经足够明显，故借此项目深入学习。
- 使用前沿技术让一个项目从 0 到 1 的过程不仅可以提升我们的 coding 水平，还可以提升非 coding （设计、 git 、 nginx 等）的能力。

项目目前的情况：

目前没有开发者全职投入到此项目，都是利用闲暇时间进行 coding 和 ponder 。  
项目是一个浏览器应用，后期考虑会迁移到原生应用上（类似于 RN、 flutter ）

### PR 说明

以 next 分支为默认分支，请基于 next 创建自己的分支，在提交之前请同步 next 分支，尽量避免代码冲突。

在基本架构完成之后我会创建一些基本的编码规则和提交规则，也欢迎大家参与进来一起制定。

### 重构计划

2020.10.31 之前完成基本架构（可能更早）。  
因为时间安排，只会在业余时间去重构，所以时间上没有具体安排。如果你也是如此，希望在业余时间做一些或学一些东西，我觉得这个重构计划很适合你，参与方式在下面。

### 快速 PR

规则：

- 目录原则：
  - 辅助线文件夹默认导出为 `index.ts` ，所有界面相关的 `code` 放置在 `pages` 下。
  - `script`: 打包部署脚本
  - `src`：
    - `app` 项目运行主要文件夹。
    - `interface` 主要编写类型推断 code 。
    - `theme` 存放主题相关的配置，使用 `index.ts` 进行主题切换。
    - `router` 主要用于配置前端页面路由。
    - `utils` 用于编写公共无副作用函数。
    - `components` 为页面可重用组件，主要从 `pages` 中抽离可复用的代码或 UI 组件。
    - `modules` 文件夹是收集索有 `pages` 下的 store ，有效的分离 store ，避免了 `vuex` 的 state 过多影响阅读。
    - 其它文件暂不做说明。
- 代码规范：
  - 暂无

相关链接：

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [vuejs](https://v3.vuejs.org/)
- [commitlint](https://commitlint.js.org/#/)
- [vue-cli](https://cli.vuejs.org/zh/)
- [prettier](https://prettier.io/)
- [webpack-chain](https://github.com/neutrinojs/webpack-chain#getting-started)
- [storybook](https://github.com/storybookjs/storybook/tree/next/app/vue)
- [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)

### Electron

在开发的同时会快速兼容 Electron 。所谓的快速就是调用很少的 API 实现 PC 端的功能，比如放大、缩小、通知、音乐拖放上传。

### ~~在线 API [NeteaseCloudMusicApi](https://music.linkorg.club/)~~

### `vue3.x`已发布，音乐项目正在搭建基本架构

目前会利用闲暇时间进行重构，如果你也想参与进来，可以发邮件或在[这里](https://github.com/Linkontoask/radishes/issues/6)告诉我

### 邀请前端开发人员进行重构

> 请在 issues 中留下你的想法，或者给我发送邮件告诉我你的想法 [linkorgs@163.com](linkorgs@163.com)，我会及时回复您
