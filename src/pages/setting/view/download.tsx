import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <div class="setting-view-contanier--setting" data-location="download">
        <h2>下载设置</h2>
        <div class="setting-view-description">
          下载设置可以帮助你选择不同的文件夹以保存下载的歌曲，还可以选择不同音质的歌曲进行下载。
        </div>
      </div>
    )
  }
})
