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
                    <input type="text" id="board_subject" v-model="noticeInfo.noti_title" ref="subject" class="form-control"/>
                </div>
                <div class="form-group">
                    <label for="board_content">내용</label>
                    <textarea id="board_content" v-model="noticeInfo.noti_text" ref="content" class="form-control" rows="10" style="resize:none"></textarea>
                </div>
                <div class="form-group" style="display: table-caption;">
                  <label for="board_start">게시 기간<b>(Default 7일)</b></label>
                  <DatePicker v-model="noticeInfo.range" is-range></DatePicker>
                </div>
                <div class="form-group" v-if='noticeInfo.noti_file != null'>
                  <div style="display: flex; justify-content: space-between;">
                    <label for="board_file">첨부 이미지</label>
                    <div style="cursor: pointer;" @click="doDelete(noticeInfo)">{{noticeInfo.noti_file}}&ensp;<font-awesome-icon icon="fa-x"/></div>
                  </div>                    
                  <img :src="'/' + noticeInfo.file_url" alt="이미지" width="100%"/>						
                </div>
                <div class="form-group" v-if='noticeInfo.noti_file == null'>
                  <label for="board_file">첨부 이미지</label>
                  <input type="file" ref="selectFile" id="board_file" name="board_file" class="form-control" accept="image/*" style="height: 45px;" @change="previewFile"/>              
                  <img v-if="previewImgUrl" :src="previewImgUrl" width="100%"/>
                </div>
                <div class="form-group">
                  <div class="text-right">
                    <router-link :to="'/notice/'" class="btn btn-primary">목록보기</router-link>           
                    <button type="button" @click='check_input' class="btn btn-info" style="margin-left:10px">저장</button>
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
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: 'NoticeModifyPage',
  components: {
    DatePicker
  },
  data() {
    return {
      noticeInfo: {},
      selectFile: '',   // 파일 객체
      previewImgUrl: null,// 미리보기 이미지 URL
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
    check_input : function(){
      if(this.noticeInfo.noti_title.length == 0){
        alert("제목을 입력해주세요")
        this.$refs.subject.focus();
        return
      }
      if(this.noticeInfo.noti_text.length == 0){
        alert("내용을 입력해주세요")
        this.$refs.content.focus();
        return
      }
      if(this.noticeInfo.range.start == '' || this.noticeInfo.range.end== ''){
        alert("게시기간을 선택해주세요")
        return
      }
      
      var params = new FormData();
      params.append('username', this.noticeInfo.username)
      params.append('subject', this.noticeInfo.noti_title)
      params.append('content', this.noticeInfo.noti_text)
      params.append('start', this.getFormatDate(this.noticeInfo.range.start))
      params.append('end', this.getFormatDate(this.noticeInfo.range.end))
      params.append('id', this.noticeInfo.noti_id)
      if(this.selectFile != ""){
        params.append("file", this.selectFile)
      }
      // this.isUploading = true

      NoticeService.noticeUpdate(params).then(() => {
        alert('공지수정이 완료되었습니다!')
        this.$router.push('/notice')
      });
    },
    getNoticeData() {
      this.$store.dispatch('auth/noticeDetail', this.$route.params).then(
        data => {             
          const newInfo = {
            ...data
            , range: {
              start: new Date(data.noti_start_date),
              end: new Date(data.noti_end_date)
            }
          }     
          this.noticeInfo = newInfo      
          Object.assign(this.noticeInfo, newInfo);
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
    previewFile() {
      // 선택된 파일이 있는가?
      if (0 < this.$refs.selectFile.files.length) {
        // 0 번째 파일을 가져 온다.
        this.selectFile = this.$refs.selectFile.files[0]
        // 마지막 . 위치를 찾고 + 1 하여 확장자 명을 가져온다.
        // FileReader 를 활용하여 파일을 읽는다
        var reader = new FileReader()
        reader.onload = e => {
          // base64
          this.previewImgUrl = e.target.result
        }
        reader.readAsDataURL(this.selectFile)
      } else {
        // 파일을 선택하지 않았을때
        this.selectFile = null
        this.previewImgUrl = null
      }
    },
    doDelete(param){
      var rslt = confirm(param.noti_file + ' 첨부파일을 수정 하시겠습니까?')
      if(rslt){
        var newInfo = {
          ...this.noticeInfo
          , noti_file: null
          , file_url : null
        }     
        Object.assign(this.noticeInfo, newInfo);
      }
    },
    
    /**
     *  yyyyMMdd 포맷으로 반환
     */
     getFormatDate(date){
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        return  year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
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