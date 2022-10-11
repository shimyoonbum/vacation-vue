import axios from 'axios'

const API_URL = 'http://localhost:8070/manage/'

class VacationService {
  manage() {
    return axios
      .get(API_URL + 'getMember', {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }
  
  apply(id, param) {
    return axios
      .put(API_URL + 'doUpdate/' + id, param, {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  } 
}

export default new VacationService()