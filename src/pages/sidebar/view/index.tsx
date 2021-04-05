import { defineComponent, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import classnames from 'classnames'
import { navRouter } from '@/router/index'
import { SidebarAuth } from '@/pages/auth/component/sidebar-auth'
import { CustomizeRouteRecordRaw } from '@/interface'
import { useUserPlayList } from '@/hooks'
import './index.less'

// TODO 登录页面 我先做成内嵌的模式，后续再升级成 electron 模式
export const Sidebar = defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute()
    const playlist = useUserPlayList()
    const nav = navRouter.filter(routerGroup => !routerGroup.meta?.nonav)
    return () => (
      <aside class="sidebar">
        <SidebarAuth></SidebarAuth>
        <div class="sidebar-nav-contanier">
          {nav.map((routerGroup: CustomizeRouteRecordRaw) => (
            <div
              class={classnames('sidebar-nav', {
                'sidebar-nav-active': route.path.includes(routerGroup.path)
              })}
            >
              {routerGroup.meta?.beforeHeader && (
                <header class="sidebar-nav-header">
                  {routerGroup.meta.beforeHeader}
                </header>
              )}
              <RouterLink class="sidebar-nav-name" to={routerGroup.path}>
                {routerGroup.meta?.name}
              </RouterLink>
            </div>
          ))}

          {playlist.value?.map((item: any, index: number) => (
            <div
              class={classnames('sidebar-nav', {
                'sidebar-nav-active': route.path.includes(item.id)
              })}
            >
              {index === 0 && (
                <header class="sidebar-nav-header">我的歌单</header>
              )}
              <RouterLink
                class="sidebar-nav-name ellipsis"
                to={`/list/song/${item.id}`}
              >
                {item.name}
              </RouterLink>
            </div>
          ))}
        </div>
      </aside>
    )
  }
})
