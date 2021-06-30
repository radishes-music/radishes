import {
  SettingState,
  BasicEffect,
  ConvolutionFile,
  Language
} from '@/interface/index'

export const state: SettingState = {
  source: ['qq', 'kuwo', 'migu'],
  sourceAll: [
    {
      name: j18n.load('src__pages__setting__state___5'),
      value: 'qq',
      disabled: true
    },
    {
      name: j18n.load('src__pages__setting__state___6'),
      value: 'kuwo',
      disabled: true
    },
    {
      name: j18n.load('src__pages__setting__state___7'),
      value: 'migu',
      disabled: true
    },
    { name: j18n.load('src__pages__setting__state___8'), value: 'baidu' },
    { name: 'JOOX', value: 'joox' },
    { name: j18n.load('src__pages__setting__state___10'), value: 'kugou' },
    { name: j18n.load('src__pages__setting__state___11'), value: 'xiami' }
    // { name: 'Youtube', value: 'youtube' }
  ],
  bitRate: 3.2e5,
  basicEffect: [BasicEffect.FADE],
  convolver: j18n.load('src__pages__setting__state___16') as ConvolutionFile,
  upgrade: true,
  language: Language.ZH,
  convolverAll: [
    '原唱',
    'AliceInBones',
    'BlackSunGarden',
    'Car radio close',
    'Car radio wide',
    'CastilloDeLosTresReyesDelMorro',
    'CliffOfTheDawn',
    'CornOnTheLeash',
    'Erres tube radio.C',
    'FatMansMisery',
    'FooToFly',
    'Fredman_Mono_Vintage30_Solid',
    'Fredman_Mono_Vintage30_SPARC',
    'Fredman_Mono_Vintage30_Tube',
    'GreedSacrifice',
    'GreenBasketCase',
    'iron box mono',
    'IslaMujeresCave',
    'LawrenceWelkCave',
    'Mono_3DoorTonite_Solid',
    'Mono_3DoorTonite_SPARC',
    'Mono_3DoorTonite_Tube',
    'Mono_AlterYourEyes_Solid',
    'Mono_AlterYourEyes_SPARC',
    'Mono_AlterYourEyes_Tube',
    'Mono_Bushlyerine_Solid',
    'Mono_Bushlyerine_SPARC',
    'Mono_Bushlyerine_Tube',
    'Mono_TheSpringsArentAlright_Solid',
    'Mono_TheSpringsArentAlright_SPARC',
    'Mono_TheSpringsArentAlright_Tube',
    'NaumburgBandshell',
    'ScorpYouLikeAHurricane',
    'Small portable ambient',
    'Small portable',
    'Small speaker mono',
    'SpoonGarden',
    'StanleyParkCliffs',
    'SweetChildOfGun',
    'ToolPot',
    'Very small speaker mono',
    'WoodruffLane'
  ]
}
