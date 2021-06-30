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
      [BasicEffect.D3]: j18n.load('src__pages__setting__view__effect___14'),
      [BasicEffect.FADE]: j18n.load('src__pages__setting__view__effect___15'),
      [BasicEffect.TENDER]: j18n.load('src__pages__setting__view__effect___16')
    }

    const handleChangeBasic = (basic: BasicEffect[]) => {
      useMutations(SettingMutations.SET_BASIC_EFFECT, basic)
    }

    const handleChangeConvolver = (convolver: string) => {
      useMutations(SettingMutations.SET_CONVOLVER_EFFECT, convolver)
    }

    return () => (
      <div class="setting-view-contanier--effect" data-location="effect">
        <h2>{j18n.load('src__pages__setting__view__effect___29')}</h2>
        <div class="setting-view-description">
          {j18n.load('src__pages__setting__view__effect___31')}
        </div>
        <div class="effect-basic">
          <div>{j18n.load('src__pages__setting__view__effect___34')}</div>
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
          <div>{j18n.load('src__pages__setting__view__effect___55')}</div>
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
