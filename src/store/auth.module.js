import AuthService from '../services/auth-service'
import NoticeService from '../services/notice-service'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null }

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login ({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user)
          return Promise.resolve(user)
        },
        error => {
          commit('loginFailure')
          return Promise.reject(error.response.data)
        }
      )
    },
    logout({ commit }) {
      AuthService.logout()
      commit('logout')
    },
    main({ commit }) {
      return AuthService.main().then(
        data => {
          commit('searchSuccess')
          return Promise.resolve(data)
        },
        error => {
          commit('searchFailure')
          return Promise.reject(error.response)
        }
      )
    },
    notice({ commit }, param) {
      return NoticeService.notice(param).then(
        data => {
          commit('searchSuccess')
          return Promise.resolve(data)
        },
        error => {
          commit('searchFailure')
          return Promise.reject(error.response)
        }
      )
    },
    noticeDetail({ commit }, param) {
      return NoticeService.noticeDetail(param).then(
        data => {
          commit('searchSuccess')
          return Promise.resolve(data)
        },
        error => {
          commit('searchFailure')
          return Promise.reject(error.response)
        }
      )
    },
    noticeSubmit({ commit }, param) {
      return NoticeService.noticeSubmit(param).then(
        data => {
          commit('submitSuccess')
          return Promise.resolve(data)
        },
        error => {
          commit('submitFailure')
          return Promise.reject(error.response)
        }
      )
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status = { loggedIn: true }
      state.user = user.data.username
    },
    loginFailure(state) {
      state.status = {}
      state.user = null
    },
    logout(state) {
      state.status = {}
      state.user = null
    },
    searchSuccess(data) {
      data
    },
    searchFailure(state) {      
      state.status = {}
      state.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    submitSuccess() {      
    },
    submitFailure() {      
    }
  }
}