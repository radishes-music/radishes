import {
  CHANGE_PLAY_MODE_EVENT_MAP,
  EVENT_APP_AUTH,
  EVENT_APP_SETTING,
  EVENT_APP_UPDATE,
  EVENT_MUSICCONTROL_LIKE,
  EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE,
  EVENT_MUSICCONTROL_NEXT,
  EVENT_MUSICCONTROL_PLAYMODE,
  EVENT_MUSICCONTROL_PLAY_OR_PAUSE,
  EVENT_MUSICCONTROL_PREV,
  EVENT_MUSICCONTROL_VOLDOWN,
  EVENT_MUSICCONTROL_VOLUP,
  EVENT_SETUP_MENU,
  PlayMode
} from '@/constants'
import type {
  BrowserWindow,
  MenuItem,
  MenuItemConstructorOptions
} from 'electron'
import { app, ipcMain, Menu, shell } from 'electron'

interface ITemplateParams {
  win: BrowserWindow
  playMode?: PlayMode
  playStatus?: boolean
  desktopLyricsStatus?: boolean
}

const template = ({
  win,
  playMode = PlayMode.AllLoop,
  desktopLyricsStatus = false,
  playStatus = false
}: ITemplateParams): Array<MenuItemConstructorOptions | MenuItem> => [
  {
    label: app.name,
    submenu: [
      { label: `关于 ${app.name}`, role: 'about' },
      {
        label: '设置...',
        click() {
          win.webContents.send(EVENT_APP_SETTING)
        },
        enabled: false
      },
      { type: 'separator' },
      {
        label: '更新',
        click() {
          win.webContents.send(EVENT_APP_UPDATE)
        },
        enabled: false
      },
      {
        label: '退出登录',
        click() {
          win.webContents.send(EVENT_APP_AUTH)
        },
        enabled: false
      },
      { type: 'separator' },
      { label: `隐藏 ${app.name}`, role: 'hide' },
      { label: '隐藏其它', role: 'hideOthers' },
      { label: '显示全部', role: 'unhide' },
      { type: 'separator' },
      { label: `退出 ${app.name}`, role: 'quit' }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo' },
      { label: '重做', role: 'redo' },
      { type: 'separator' },
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { label: '搜索' },
      { label: '删除', role: 'delete' },
      { label: '全选', role: 'selectAll' }
    ]
  },
  {
    label: '播放控制',
    submenu: [
      {
        label: playStatus ? '暂停' : '播放',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_PLAY_OR_PAUSE)
        },
        accelerator: ''
      },
      {
        label: '上一首',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_PREV)
        },
        accelerator: 'Cmd+Left'
      },
      {
        label: '下一首',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_NEXT)
        },
        accelerator: 'Cmd+Right'
      },
      {
        label: '音量加',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_VOLUP)
        },
        accelerator: 'Cmd+Up'
      },
      {
        label: '音量减',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_VOLDOWN)
        },
        accelerator: 'Cmd+Down'
      },
      {
        label: '喜欢歌曲',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_LIKE)
        },
        accelerator: 'Cmd+L',
        enabled: false
      },
      {
        label: '播放模式',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_PLAYMODE)
        }
        // submenu: ['随机播放', '单曲循环', '顺序播放'].map(
        //   (label: string, index: number) => {
        //     return {
        //       label,
        //       type: 'radio',
        //       checked: index === playMode,
        //       click() {
        //         win.webContents.send(CHANGE_PLAY_MODE_EVENT_MAP[index])
        //       }
        //     }
        //   }
        // )
      },
      {
        label: desktopLyricsStatus ? '关闭桌面歌词' : '打开桌面歌词',
        click() {
          win.webContents.send(EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE)
        },
        accelerator: 'Alt+L'
      }
    ]
  },
  {
    label: '窗口',
    submenu: [
      { label: '最小化', role: 'minimize' },
      { label: '关闭窗口', role: 'close' },
      { label: '缩放窗口', role: 'zoom' },
      { label: '将窗口拼贴到屏幕左侧', enabled: false },
      { label: '将窗口拼贴到屏幕右侧', enabled: false },
      { label: '替换拼贴窗口', enabled: false },
      { type: 'separator' },
      { label: '从组中移除窗口', enabled: false },
      { type: 'separator' },
      { label: 'Radishes 面板', enabled: false },
      { label: '切换到迷你窗口', enabled: false },
      { type: 'separator' },
      { label: '前置全部窗口', role: 'front' },
      { type: 'separator' },
      { label: '进入全屏幕', role: 'togglefullscreen' }
    ]
  },
  {
    role: 'help',
    label: '帮助',
    submenu: [
      { label: '意见反馈', enabled: false },
      {
        label: '下载最新',
        click() {
          shell.openExternal(
            'https://github.com/radishes-music/radishes/releases'
          )
        }
      },
      { label: '发送日志', enabled: false }
    ]
  }
]

// FIXME: 需要读取对应的参数
// FIXME: 国际化
const setupMenu = (win: BrowserWindow, config = {}) => {
  const menu = Menu.buildFromTemplate(template({ win, ...config }))
  Menu.setApplicationMenu(menu)
}

export default (win: BrowserWindow) => {
  setupMenu(win)
  ipcMain.handle(EVENT_SETUP_MENU, (_, config = {}) => {
    setupMenu(win, config)
  })
}
