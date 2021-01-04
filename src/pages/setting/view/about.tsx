import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--about" data-location="about">
        <h2>关于 radishes</h2>
        <div class="setting-view-paragraph">
          radishes
          是一款参考网易云音乐客户端实现的跨平台播放器。如果在使用过程中遇到任何问题可以在
          <a href="https://github.com/Linkontoask/radishes" target="_blank">
            Github
          </a>
          上联系我们。
        </div>
        <div class="setting-view-paragraph">
          radishes
          成立之初是为了分享与学习，如果有侵权行为，请联系作者及时更改。radishes
          使用
          <a
            href="https://github.com/Linkontoask/radishes/blob/next/LICENSE"
            target="_blank"
          >
            MIT
          </a>
          协议，你可以自行复制与更改，如果你有时间，也欢迎加入我们完善
          radishes。
        </div>
        <div class="setting-view-paragraph">
          radishes
          还可以在线访问。在线访问有两个链接（第一个链接可以正常使用登录功能，第二链接没办法使用和cookie相关的功能，原因可以在
          <a
            href="https://github.com/Linkontoask/radishes#%E5%9C%A8%E7%BA%BF%E8%AE%BF%E9%97%AE%E8%AF%B4%E6%98%8E"
            target="_blank"
          >
            这里
          </a>
          找到）：
          <ul>
            <li>
              <a href="http://112.74.169.178/music/" target="_blank">
                http://112.74.169.178/music/
              </a>
            </li>
            <li>
              <a href="https://hq001.github.io/" target="_blank">
                https://hq001.github.io/
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
})
