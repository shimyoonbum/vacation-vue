import AuthService from '../services/auth-service'

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
          commit('main')
          return Promise.resolve(data)
        },
        error => {
          commit('main')
          return Promise.reject(error.response.data)
        }
      )
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status = { loggedIn: true }
      state.user = user
    },
    loginFailure(state) {
      state.status = {}
      state.user = null
    },
    logout(state) {
      state.status = {}
      state.user = null
    },
    main(data) {
      data
    }
  }
}