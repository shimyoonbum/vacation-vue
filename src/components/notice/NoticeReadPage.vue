<template>
<div class="container">
  <div class="row">
    <div class="col-sm-3"></div>
    <div class="col-sm-6">
        <div class="card shadow">
            <div class="card-body">
                <div class="form-group">
                    <label for="board_writer_name">작성자</label>
                    <input type="text" id="board_writer_name" v-model="noticeInfo.emp_name" class="form-control" disabled="disabled"/>
                </div>
                <div class="form-group">
                    <label for="board_date">작성날짜</label>
                    <input type="text" id="board_date" v-model="noticeInfo.reg_date" class="form-control" disabled="disabled"/>
                </div>
                <div class="form-group">
                    <label for="board_subject">제목</label>
                    <input type="text" id="board_subject" v-model="noticeInfo.noti_title" class="form-control" disabled="disabled"/>
                </div>
                <div class="form-group">
                    <label for="board_content">내용</label>
                    <textarea id="board_content" v-model="noticeInfo.noti_text" class="form-control" rows="10" style="resize:none" disabled="disabled"></textarea>
                </div>
                <div class="form-group" v-if='noticeInfo.noti_file != null'>
                  <div style="display: flex; justify-content: space-between;">
                    <label for="board_file">첨부 이미지</label>
                    <div>
                      {{noticeInfo.noti_file}}&ensp;
                      <font-awesome-icon icon="fa-x" style="cursor: pointer;" @click="doDelete(noticeInfo)" 
                      v-if='noticeInfo.username == this.$store.state.auth.user.username'/></div>
                  </div>                    
                  <img :src="'/' + noticeInfo.file_url" alt="이미지" width="100%"/>						
                </div>
                <div class="form-group">
                  <div class="text-right">
                    <router-link :to="'/notice/'" class="btn btn-primary">목록보기</router-link>
                    <router-link :to="'/noticeUpdate/'+ $route.params.noti_id" class="btn btn-info" style="margin-left:10px" v-if='noticeInfo.username == $store.state.auth.user.username'>수정하기</router-link>
                    <router-link :to="'/noticeDelete/'+ $route.params.noti_id" class="btn btn-danger" style="margin-left:10px" v-if='noticeInfo.username == $store.state.auth.user.username'>삭제하기</router-link>
                  </div>
                </div>
            </div>
        </div>
      </div>
    <div class="col-sm-3"></div>
  </div>
</div>
</template>


<script>  
import NoticeService from '../../services/notice-service'

export default {
  name: 'NoticeReadPage',
  data() {
    return {
      noticeInfo: {}
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
      this.$store.dispatch('auth/noticeDetail', this.$route.params).then(
        data => {       
          this.noticeInfo = data
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
    doDelete(param){
      var rslt = confirm(param.noti_file + ' 첨부파일을 삭제 하시겠습니까?')
      if(rslt){
        NoticeService.noticeFileDelete(param).then(data => {
          alert(param.noti_file +' 삭제가 완료되었습니다!')
          Object.assign(this.noticeInfo, data);
        });
      }
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