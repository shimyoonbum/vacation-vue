import axios from 'axios'

const API_URL = 'http://localhost:8070/vacation/'

class ApplyService {
  apply() {
    return axios
      .get(API_URL + 'user', {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }  

  applyTop5() {
    return axios
      .get(API_URL + 'apply5', {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }
  
  doApply(param) {
    return axios
      .post(API_URL + 'doApply', JSON.stringify(param), {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  } 

  doUpdate(param) {
    return axios
      .put(API_URL + 'doUpdate_v2/' + param.id, JSON.stringify(param), {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  }
  
  doDelete(param) {
    return axios
      .delete(API_URL + 'deleteReg/' + param.id, {
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  } 

  doAllDelete(param){
    return axios
      .delete(API_URL + 'deleteReg', {
        data: param,
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  } 
}

export default new ApplyService()