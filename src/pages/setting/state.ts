import { SettingState } from '@/interface/index'

export const state: SettingState = {
  source: ['qq', 'kuwo', 'migu'],
  sourceAll: [
    { name: 'QQ音乐', value: 'qq', disabled: true },
    { name: '酷我音乐', value: 'kuwo', disabled: true },
    { name: '咪咕音乐', value: 'migu', disabled: true },
    { name: '百度音乐', value: 'baidu' },
    { name: 'JOOX', value: 'joox' },
    { name: '酷狗音乐', value: 'kugou' },
    { name: '虾米音乐', value: 'xiami' }
    // { name: 'Youtube', value: 'youtube' }
  ],
  bitRate: 3.2e5
}
