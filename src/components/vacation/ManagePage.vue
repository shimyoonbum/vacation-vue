<template>
  <!-- 게시글 리스트 -->
  <div class="container">
    <div class="card shadow">
      <div class="card-body">
        <h4 class="card-title">팀원(승인 요청자) 정보</h4>
        <table class="table table-hover" id>
          <thead>
            <tr>
                <th class="text-center d-none d-md-table-cell">#</th>
                <th class="text-center d-md-table-cell">이름</th>
                <th class="text-center d-none d-md-table-cell">부서</th>
                <th class="text-center d-md-table-cell">직급</th>
                <th class="text-center d-none d-md-table-cell">발생 일수</th>
                <th class="text-center d-none d-md-table-cell">사용 일수</th>
                <th class="text-center d-md-table-cell">잔여 일수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='(team, index) in teamInfo' v-bind:key='index' :class="{ active: index===0 }">
                <td class="text-center d-none d-md-table-cell">{{index + 1}}</td>
                <td class="text-center d-md-table-cell">{{team.empName}}</td>
                <td class="text-center d-none d-md-table-cell">{{team.organization.orgName}}</td>  
                <td class="text-center d-md-table-cell">{{team.empRank}}</td> 
                <td class="text-center d-none d-md-table-cell">{{team.vacation.acqDaysNum}}</td> 
                <td class="text-center d-none d-md-table-cell">{{team.vacation.useDaysNum}}</td> 
                <td class="text-center d-md-table-cell">{{team.vacation.resDaysNum}}</td>                         
            </tr>                      
          </tbody>
        </table>   
      </div>
    </div>
    <br/>
    <br/>
    <div class="card shadow">
      <div class="card-body">
        <h4 class="card-title">휴가 승인 요청 내역</h4>
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="text-center d-none d-md-table-cell">#</th>
              <th class="text-center d-md-table-cell">휴가신청일시</th>
              <th class="text-center d-md-table-cell">이름</th>
              <th class="text-center d-none d-md-table-cell">휴가기간</th>
              <th class="text-center d-none d-md-table-cell">휴가일수</th>
              <th class="text-center d-none d-md-table-cell">휴가사유</th>
              <th class="text-center d-none d-md-table-cell">유형</th>
              <th></th>
            </tr>
          </thead>                    
          <tbody v-if="applyInfo.length === 0">
            <tr><td colSpan = '8'>데이터 없음.</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for='(apply, index) in applyInfo' v-bind:key='index'>
              <td class="text-center d-none d-md-table-cell">{{index + 1}}</td>
              <td class="text-center d-md-table-cell">{{apply.regDate}}</td>   
              <td class="text-center d-md-table-cell">{{apply.empName}}</td>
              <td class="text-center d-none d-md-table-cell">{{apply.regStartDate}} ~ {{apply.regEndDate}}</td>   
              <td class="text-center d-none d-md-table-cell">{{apply.regNum}}</td>   
              <td class="text-center d-none d-md-table-cell">{{apply.regReason}}</td>   
              <td class="text-center d-none d-md-table-cell">{{apply.vkCode.codeName}}</td>
              <td style="text-align: center;">
                  <button class="btn btn-info apvBtn" @click="doApprove(apply)">승인</button>
                  <b-button class="btn btn-danger rejBtn" @click="doReject(apply)" ref="btnReject">반려</b-button>
              </td>                          
            </tr>                      
          </tbody>
        </table>      
      </div>
    </div>   
    <RejectModal :vacId="vacId" @childData="childPopup"></RejectModal> 
  </div>
</template>
<script>
import VacationService from '../../services/vacation-service'
import RejectModal from './RejectModal.vue'
export default {
  name: 'ManagePage',
  components: {
    RejectModal
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  data() {
    return {
      user: {
        username : '',
        password : ''
      },
      loading: false,
      message: '',
      teamInfo : [],
      applyInfo : [],
      vacId: 0
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }else{
      this.getManage()
    }
  },
  methods: {
    getManage() {
      VacationService.manage().then(res => {
        let manage = res.emp.slice(1, res.length);  //기존 배열 유지하고 첫번째요소만 삭제
        let list = [];

        manage.map(data => {
            let vac = data.register;
            vac.map(c => {
                delete data.register 
                list = [...list, Object.assign(c, data)];
            })                               
        })
        this.teamInfo = res.emp
        this.applyInfo = list.filter(l => l.vsCode === 'VS1')
      })
    },
    doReject(apply){
      this.vacId = apply.id
      this.$root.$emit('bv::show::modal', 'modal-reason', '#btnReject')            
    },
    doApprove(apply){
      let apr = {
        empCode : apply.empCode,
        reason : '',
        vsCode : 'VS2'
      };
      var code = apply.vkCode.code

      if(code === 'VK1'|| code === 'VK2'){
        apr = {
          ...apr,
          regNum : apply.regNum
        }
      }else{
        apr = {
          ...apr,
          regNum : 0
        }
      }

      VacationService.apply(apply.id, apr).then(res => {
        if(res == null)
            return
        alert('승인 처리 되었습니다!')
        this.refresh()
      })
    },
    childPopup(childData) {
      alert('휴가가 성공적으로 '+ childData +'되었습니다!')
      this.refresh()
    },
    //화면 리렌더링 함수
    refresh(){
      this.teamInfo = []
      this.applyInfo = []
      this.getManage()
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

.active{
  background-color: gold;
}

@media (min-width: 450px) {
  .rejBtn{
    margin-left: 5px;
  }
}

@media (max-width: 450px) {
  .rejBtn{
    margin-top: 5px;
    font-size: 12px;
  }
  .apvBtn{
    font-size: 12px;
  }
}
</style>