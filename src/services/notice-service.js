import axios from 'axios'

const API_URL = 'http://localhost:8070/api/'

class NoticeService {
  notice(param) {
    return axios
      .get(API_URL + 'notice?page=' + param, {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }
  
  noticeTop5() {
    return axios
      .get(API_URL + 'notice?size=5', {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }

  noticeDetail(param) {
    return axios
      .get(API_URL + 'noticeDetail?id=' + param.noti_id, {
        headers: { Authorization: localStorage.getItem('token')}
      })
      .then(response => response.data)
  }

  noticeSubmit(param) {
    return axios
      .post(API_URL + 'submit', param, {
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  }

  noticeUpdate(param) {
    return axios
      .put(API_URL + 'noticeUpdate', param, {
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  }

  noticeFileDelete(param) {
    return axios
      .get(API_URL + 'noticeDelete?id=' + param.noti_id, {
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  }

  noticeDelete(param) {
    return axios
      .delete(API_URL + 'noticeDelete?id=' + param.noti_id, {
        headers: { 
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.data)
  }
}

export default new NoticeService()