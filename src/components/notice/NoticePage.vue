<template>
  <!-- 게시글 리스트 -->
  <div class="container">
    <div class="card shadow">
      <div class="card-body">
        <h4 class="card-title">공지 사항</h4>
        <table class="table table-hover" id='board_list'>
          <thead>
              <tr>
                  <th class="text-center d-none d-md-table-cell">글번호</th>
                  <th class="w-50">제목</th>
                  <th class="text-center d-none d-md-table-cell">작성자</th>
                  <th class="text-center d-none d-md-table-cell">작성날짜</th>
              </tr>
          </thead>
          <tbody v-if="noticeInfo.length === 0">
            <tr><td colSpan = '4'>데이터 없음.</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for='noti in noticeInfo' v-bind:key='noti.rownum' @click="noticeDetail(noti)">
                <td class="text-center d-none d-md-table-cell">{{noti.noti_id}}</td>
                <td>{{noti.noti_title}}</td>
                <td class="text-center d-none d-md-table-cell">{{noti.emp_name}}</td>
                <td class="text-center d-none d-md-table-cell">{{noti.reg_date}}</td>                          
            </tr>                      
          </tbody>
        </table>
        
        <div class="d-none d-md-block">
            <ul class="pagination justify-content-center">
                <li class="page-item" v-if='!first'>
                  <div class="page-link" @click="selectNotice(true)">이전</div>
                </li>
                <li class="page-item" v-for='page in page_array' v-bind:key='page'>
                    <div class="page-link" @click="selectPage(page)">{{page}}</div>
                </li>
                <li class="page-item" v-if='!last'>
                  <div class="page-link" @click="selectNotice(false)">다음</div>
                </li>
            </ul>
        </div>
          
        <div class="text-right">
          <router-link :to="'/noticeWrite/'" class="btn btn-primary">글쓰기</router-link>
        </div>          
      </div>
    </div>
  </div>
</template>
<style>
#board_list > tbody > tr {
    cursor: pointer;
}
</style>

<script>  
export default {
  name: 'NoticePage',
  data() {
    return {
      noticeInfo: [],
      page_array: [],
      page: 0,
      first: true,
      last: true
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }else{
      this.getNoticeData()
    }
  },
  methods: {
    getNoticeData() {
      this.$store.dispatch('auth/notice', this.page).then(
        data => {       
          this.noticeInfo = data.content;
          for(var i = 1; i <= data.totalPages; i++){
            this.page_array.push(i);
          }

          this.first = data.first
          this.last = data.last
          this.page = data.number + 1
        },
        error => {
          if(error.status === 401){
            alert('로그인이 필요합니다!')
            this.$router.push('/login')
          }else{
            alert('시스템 오류입니다!')
          }   
        }
      )
    },
    selectPage(value){
      this.noticeInfo = []
      this.page_array = []
      this.page = value - 1
      this.getNoticeData()
    },
    selectNotice(value){
      if(value){
        this.page = this.page - 2
      }
      this.noticeInfo = []
      this.page_array = []
      this.getNoticeData()
    },
    noticeDetail(noti){
			this.$router.push('/notice/' + noti.noti_id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
