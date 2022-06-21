import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  name: localStorage.getItem('name'),
  sex: localStorage.getItem('sex') || '',
  account: localStorage.getItem('account'),
  avatar: localStorage.getItem('avatar'),
  userLevel: localStorage.getItem('userLevel'),
  isRegister: localStorage.getItem('isRegister') == 'true',
  introduce: localStorage.getItem('introduce'),
  agency: localStorage.getItem('agency'),
  loginState: false,
  verified: localStorage.getItem('verified') == 'true',
  isBind: localStorage.getItem('bind') == 'true',
  isConnect: localStorage.getItem('connect') == 'true',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_LOGIN_STATE: (state, isLogin) => {
    state.loginState = isLogin
  },
  SET_USER_LEVEL: (state, userLevel) => {
    state.userLevel = userLevel
    localStorage.setItem('userLevel', userLevel)
  },
  SET_AGENCY: (state, agency) => {
    state.agency = agency
    localStorage.setItem('agency', agency)
  },
  SET_VERIFIED: (state, verified) => {
    state.verified = verified
    localStorage.setItem('verified', verified)
  },
  SET_ISREGISTER: (state, isRegister) => {
    state.isRegister = isRegister
    localStorage.setItem('isRegister', isRegister)
  },
  SET_INTRODUCE: (state, introduce) => {
    state.introduce = introduce
    localStorage.setItem('introduce', introduce)
  },
  SET_ISCONNECT: (state, isConnect) => {
    state.isConnect = isConnect
    localStorage.setItem('connect', isConnect)
  },
  SET_ISBIND: (state, isBind) => {
    state.isBind = isBind
    localStorage.setItem('bind', isBind)
  },
  SET_NAME: (state, name) => {
    state.name = name
    localStorage.setItem('name', name)
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
    localStorage.setItem('account', account)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    localStorage.setItem('avatar', avatar)
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
    localStorage.setItem('sex', sex)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  setVerified({ commit }, verified) {
    commit('SET_VERIFIED', verified)
  },
  setLoginState({ commit }, isLogin) {
    commit('SET_LOGIN_STATE', isLogin)
  },
  setIsConnect({ commit }, isConnect) {
    commit('SET_ISCONNECT', isConnect)
  },
  setIsBind({ commit }, isBind) {
    commit('SET_ISBIND', isBind)
  },
  setAccount({ commit }, account) {
    commit('SET_ACCOUNT', account)
  },
  setUserLevel({ commit }, userLevel) {
    commit('SET_USER_LEVEL', userLevel)
  },
  setIsRegister({ commit }, isRegister) {
    commit('SET_ISREGISTER', isRegister)
  },
  setAvatar({ commit }, avatar) {
    commit('SET_AVATAR', avatar)
  },
  setAgency({ commit }, agency) {
    commit('SET_AGENCY', agency)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { errCode, data, message } = response
        if (errCode === 0) {
          const { username, avatar, description, sex, level, reg, agency, verified } = data
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          commit('SET_SEX', sex)
          commit('SET_USER_LEVEL', level)
          commit('SET_ISREGISTER', reg)
          commit('SET_INTRODUCE', description)
          commit('SET_VERIFIED', verified)
          commit('SET_AGENCY', agency)
          if (!state.token) {
            commit('SET_TOKEN', getToken())
          }
          resolve(data)
        } else {
          reject(message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ISCONNECT', false)
    commit('SET_ISBIND', false)

    commit('SET_USER_LEVEL', '')
    commit('SET_ISREGISTER', '')

    commit('SET_AVATAR', '')
    commit('SET_INTRODUCE', '')
    commit('SET_NAME', '')
    commit('SET_ACCOUNT', '')
    commit('SET_LOGIN_STATE', false)
    commit('SET_VERIFIED', false)
    commit('SET_AGENCY', '')
    localStorage.removeItem('checkSign')

    removeToken()
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ISCONNECT', false)
    //     commit('SET_ISBIND', false)
    //     localStorage.removeItem('bind')
    //     removeToken()
    //     resetRouter()
    //     dispatch('tagsView/delAllViews', null, { root: true })
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
