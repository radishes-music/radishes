import { defineComponent } from 'vue'
import { useSettingModule } from '@/modules/index'
import { CheckboxGroup, Checkbox } from 'vant'
import { PlaySource, SettingMutations } from '@/interface'

export default defineComponent({
  setup() {
    const { useState, useMutations } = useSettingModule()
    const state = useState()

    const handleChangeCheck = (checked: PlaySource[]) => {
      useMutations(SettingMutations.SET_SOURCE, checked)
    }
    return () => (
      <div class="setting-view-contanier--source" data-location="source">
        <h2>播放源</h2>
        <div class="setting-view-description">
          设置播放源是为了提高播放成功率，但是会增加等待时间，因为需要在已选择的平台上进行搜索。
        </div>
        <CheckboxGroup
          direction="horizontal"
          v-model={state.source}
          onChange={handleChangeCheck}
        >
          {state.sourceAll.map(source => {
            return (
              <Checkbox
                shape="square"
                checked-color="var(--base-color)"
                icon-size="16px"
                disabled={source.disabled}
                name={source.value}
              >
                {source.name}
              </Checkbox>
            )
          })}
        </CheckboxGroup>
      </div>
    )
  }
})
