/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent } from 'vue'

// TODO Hello~

/*
    TODO 缺少 3个控件
        - 日期选择
        - 地区选择
        - 头像修改
* * */

export const UserSetting = defineComponent({
  name: 'UserSetting',
  setup() {
    return () => {
      return (
        <div>
          <div>
            <div>
              <div>昵称</div>
              <div>介绍</div>
              <div>性别</div>
              <div>生日</div>
              <div>地区</div>
            </div>
            <div>保存头像</div>
          </div>

          <div>
            <div>保存</div>
            <div>取消</div>
          </div>
        </div>
      )
    }
  }
})
