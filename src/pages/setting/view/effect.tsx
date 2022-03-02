import { defineComponent } from 'vue'
import { Radio, RadioGroup, Checkbox, CheckboxGroup } from 'vant'
import { useSettingModule } from '@/modules'
import { BasicEffect, SettingMutations } from '@/interface'

export default defineComponent({
  name: 'SettingEffect',
  setup() {
    const { useState, useMutations } = useSettingModule()
    const state = useState()

    const basicFormat: {
      [k: string]: string
    } = {
      [BasicEffect.D3]: '3D环绕',
      [BasicEffect.FADE]: '淡入淡出',
      [BasicEffect.TENDER]: '温柔'
    }

    const handleChangeBasic = (basic: BasicEffect[]) => {
      useMutations(SettingMutations.SET_BASIC_EFFECT, basic)
    }

    const handleChangeConvolver = (convolver: string) => {
      useMutations(SettingMutations.SET_CONVOLVER_EFFECT, convolver)
    }

    return () => (
      <div class="setting-view-contanier--effect" data-location="effect">
        <h2>音效设置</h2>
        <div class="setting-view-description">
          使用不同的音效会有不一样的听歌体验，比如淡入淡出可以使听歌时不那么的突兀、3D环绕可以有一种立体的感觉。
        </div>
        <div class="effect-basic">
          <div>基本音效</div>
          <CheckboxGroup
            direction="horizontal"
            v-model={state.basicEffect}
            onChange={handleChangeBasic}
          >
            {Object.keys(basicFormat).map(key => {
              return (
                <Checkbox
                  shape="square"
                  checked-color="var(--base-color)"
                  icon-size="16px"
                  name={key}
                >
                  {basicFormat[key]}
                </Checkbox>
              )
            })}
          </CheckboxGroup>
        </div>
        <div class="effect-convolver">
          <div>混合音效</div>
          <RadioGroup
            direction="horizontal"
            v-model={state.convolver}
            onChange={handleChangeConvolver}
          >
            {state.convolverAll.map(mixing => (
              <Radio
                name={mixing}
                shape="square"
                checked-color="var(--base-color)"
                icon-size="16px"
              >
                {mixing}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  }
})
