import axios from 'axios'

const API_URL = 'http://localhost:8070/api/'

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'authenticate', {
        username: user.username,
        password: user.password
      })
      .then(this.handleResponse)
      .then(response => {
        if (response.headers) {
          localStorage.setItem('token', response.headers.authorization)
          localStorage.setItem('user', JSON.stringify(response.data.data.username))
        }

        return response.data
      }).catch(error => console.log(error))
  }

  main() {
    return axios.get(API_URL + 'user',{
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
      .catch(error => console.log(error))
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  handleResponse(response) {
    if (response.status === 401) {
      this.logout()
      location.reload(true)

      const error = response.data && response.data.message
      return Promise.reject(error)
    }

    return Promise.resolve(response)
  }
}

export default new AuthService()