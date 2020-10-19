import { defineComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { SecondaryBar } from '@/components/secondary-bar/index'
import { navRouter } from '@/router/index'
import './index.less'

export const FindMusic = defineComponent({
  name: 'FindMusic',
  methods: {
    handleChangeRoute(route: RouteRecordRaw) {
      console.log(route)
    }
  },
  render() {
    let nav = navRouter.filter(item => item.name === FindMusic.name)
    if (nav.length) {
      nav = nav[0].children?.filter(item => item.meta?.name) as RouteRecordRaw[]
    }
    return (
      <div class="find-music">
        <SecondaryBar
          nav={nav}
          onChange={this.handleChangeRoute}
        ></SecondaryBar>
        <router-view></router-view>
      </div>
    )
  }
})
