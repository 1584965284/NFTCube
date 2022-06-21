import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/404', '/home/index', '/home', '/market', '/market/index', '/market/art', '/market/travel', '/hall/index', '/my/intro', '/login/index', '/register/index'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  if (to.path.indexOf('/home') > -1) {
    store.dispatch('app/toggleMenue', '1')
  } else if (to.path.indexOf('/market') > -1) {
    store.dispatch('app/toggleMenue', '2-1')
  } else if (to.path.indexOf('/hall') > -1) {
    store.dispatch('app/toggleMenue', '4')
  } else if (to.path.indexOf('/create') > -1) {
    store.dispatch('app/toggleMenue', '3')
  } else {
    store.dispatch('app/toggleMenue', -99)
  }

  if (getToken()) {
    next()
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      console.log(to.path)
      store.dispatch('user/setIsBind', false)
      store.dispatch('user/setIsConnect', false)

      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      store.dispatch('user/setLoginState', false)

      setTimeout(() => {
        store.dispatch('user/setLoginState', true)
      }, 0)
      Message.warning('请先连接钱包！')
      next(`/home`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
