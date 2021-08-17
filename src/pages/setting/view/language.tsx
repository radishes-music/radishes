import { defineComponent } from 'vue'
import { Radio } from 'ant-design-vue'
import { useSettingModule } from '@/modules'
import { Language, SettingMutations } from '@/interface'

export default defineComponent({
  setup() {
    const { useState, useMutations } = useSettingModule()
    const state = useState()

    const handleLanguageChange = ({ target }: Event) => {
      const { value } = (target as unknown) as { value: Language }
      useMutations(SettingMutations.SET_LANGUAGE, value)
    }

    return () => (
      <div class="setting-view-contanier--setting" data-location="language">
        <h2>{$t('src__pages__setting__view__index___55')}</h2>
        <div>
          <Radio.Group
            defaultValue={state.language}
            buttonStyle="solid"
            onChange={handleLanguageChange}
          >
            <Radio.Button value={Language.ZH}>中文</Radio.Button>
            <Radio.Button value={Language.En}>English</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    )
  }
})
