import axios from 'axios'

const API_URL = 'http://localhost:8070/api/'

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'authenticate', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.headers) {
          localStorage.setItem('token', response.headers.authorization)
          localStorage.setItem('user', JSON.stringify(response.data.data.username))
        }
        return response.data
      })
  }

  main() {
    return axios
      .get(API_URL + 'user', {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }
  
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default new AuthService()