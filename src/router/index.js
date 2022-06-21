import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  {
    path: '/login',
    component: Layout,
    redirect: '/login/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/login/index'),
        name: 'login',
        meta: { title: '登录', icon: 'user', affix: true }
      }
    ]
  },
  {
    path: '/register',
    component: Layout,
    redirect: '/register/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/register/index'),
        name: 'register',
        meta: { title: '注册', icon: 'user', affix: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '首页', icon: 'user', affix: true }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '首页', icon: 'user', affix: true }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market/art',
    children: [
      {
        path: 'art',
        component: () => import('@/views/market/art'),
        name: '艺术市场',
        meta: { title: '艺术市场', icon: '', affix: true }
      },
      {
        path: 'travel',
        component: () => import('@/views/market/travel'),
        name: '旅游市场',
        meta: { title: '旅游市场', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index'),
        name: '账号',
        meta: { title: '账号', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/buy',
    component: Layout,
    redirect: '/buy/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/buy/index'),
        name: '购买',
        meta: { title: '购买', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/hall',
    component: Layout,
    redirect: '/hall/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/hall/index'),
        name: '个人创造者',
        meta: { title: '个人创造者', icon: '', affix: true }
      },
      {
        path: 'group',
        component: () => import('@/views/hall/group'),
        name: '机构创作者',
        meta: { title: '机构创作者', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/my',
    component: Layout,
    redirect: '/my/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/my/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: '', affix: true }
      },
      {
        path: 'intro',
        component: () => import('@/views/my/intro'),
        name: '艺术家个人介绍',
        meta: { title: '艺术家个人介绍', icon: '', affix: true }
      },
      {
        path: 'group',
        component: () => import('@/views/my/group'),
        name: '机构介绍',
        meta: { title: '机构介绍', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/myNft',
    component: Layout,
    redirect: '/myNft/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/myNft/index'),
        name: '我的艺术品',
        meta: { title: '我的艺术品', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/create',
    component: Layout,
    redirect: '/create/art',
    children: [
      {
        path: 'art',
        component: () => import('@/views/create/art'),
        name: '艺术铸造',
        meta: { title: '艺术铸造', icon: '', affix: true }
      },
      {
        path: 'travel',
        component: () => import('@/views/create/travel'),
        name: '旅游铸造',
        meta: { title: '旅游铸造', icon: '', affix: true }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // hash require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
