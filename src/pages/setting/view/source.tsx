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
        <h2>{j18n.load('src__pages__setting__view__source___15')}</h2>
        <div class="setting-view-description">
          {j18n.load('src__pages__setting__view__source___17')}
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
