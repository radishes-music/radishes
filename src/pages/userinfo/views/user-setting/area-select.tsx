/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Created by buddy on 2021/2/19.
 */
import { defineComponent, reactive } from 'vue'
import { Select } from 'ant-design-vue'
import Provinces from './province.json'
import Citys from './city.json'
import './index.less'

// TODO 区域是分 直辖市、海外、特别行政区、自治区主动隐藏该字号

export const AreaSelect = defineComponent({
  name: 'AreaSelect',
  setup() {
    const state = reactive({
      province: '',
      city: ''
    })

    return () => {
      return (
        <div>
          <Select defaultValue={'110000000000'} class="user-setting__select">
            {Provinces.map((province: any) => (
              <Select.Option value={province.id}>{province.name}</Select.Option>
            ))}
          </Select>
          <Select defaultValue={0} class="user-setting__select">
            <Select.Option value={0}>市选择</Select.Option>
          </Select>
        </div>
      )
    }
  }
})
