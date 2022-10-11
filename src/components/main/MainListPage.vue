<template>
<div class="col-lg-6" style="margin-top:20px">
    <div class="card shadow">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between;">
          <h4 class="card-title">{{title}}</h4>        
          <button type="button" @click='goList' class="btn btn-primary" style="margin-bottom: 20px;">더보기</button>
        </div>
        <table class="table table-hover" id='board_list'>
          <thead>
            <tr>
                <th class="text-center w-25 d-none d-xl-table-cell">작성자</th>
                <th class="text-center">제목</th>
                <th class="text-center w-25 d-none d-xl-table-cell">작성날짜</th>
            </tr>
          </thead>   
          <tbody v-if="list.length === 0">
            <tr><td colSpan = '3'>데이터 없음.</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for='obj in list' v-bind:key='obj.rownum' @click='goDetail(obj)'>
              <td class="text-center d-none d-xl-table-cell">{{obj.emp_name}}</td>
              <td class="text-left">{{obj.noti_title}}</td>
              <td class="text-center d-none d-xl-table-cell">{{obj.reg_date}}</td>     
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</div>
</template>
<script>    
import NoticeService from '../../services/notice-service'
// import ApplyService from '../../services/apply-service'

export default {
  name: 'MainListPage',
  props : {
    title : String
  },
  data() {
    return {
      list : []
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
      // if(this.title == '공지사항'){     
        NoticeService.noticeTop5().then(data => {
          this.list = data.content
        }); 
      // }else{             
      //   ApplyService.applyTop5().then(data => {
      //     // console.log(data);
      //     this.list = data.data
      //   }); 
      // }     
    },
    goList(){
      if(this.title == '공지사항'){
        this.$router.push('/notice')
      }else{        
        this.$router.push('/apply')
      }
    },
    goDetail(data){
      if(this.title == '공지사항'){
        this.$router.push('/notice/' + data.noti_id)
      }else{        
        this.$router.push('/apply')
      }
    } 
  }
}
</script>
<style>
  #board_list > tbody > tr {
    cursor: pointer;
  }
</style>    