<template>
  <!-- 게시글 리스트 -->
  <div class="container">
    <div class="card shadow">
      <div class="card-body">
        <h4 class="card-title">휴가 신청</h4>
        <table class="table table-hover" id>
          <thead>
            <tr>
              <th class="text-center d-none d-md-table-cell">조직</th>
              <th class="text-center d-none d-md-table-cell">직급</th>
              <th class="text-center d-none d-md-table-cell">입사일자</th>
              <th class="text-center d-md-table-cell">상위자</th>
              <th class="text-center d-md-table-cell">남은 휴가일수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center d-none d-md-table-cell">{{userInfo.orgCode}}</td>
              <td class="text-center d-none d-md-table-cell">{{userInfo.orgName}}</td>  
              <td class="text-center d-none d-md-table-cell">{{userInfo.joinDate}}</td> 
              <td class="text-center d-md-table-cell">{{userInfo.empName}}</td> 
              <td class="text-center d-md-table-cell">{{userInfo.daysNum}}</td>                 
            </tr>                      
          </tbody>
        </table>   
        <div style="text-align: end;">
          <ApplyModal :empCode="this.userInfo.empCode" @childData="childPopup"></ApplyModal>
        </div>
      </div>
    </div>
    <br/>
    <br/>
    <div class="card shadow">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between;">
          <h4 class="card-title">휴가 내역</h4>
          <button class="btn btn-info infoBtn" style="margin: 0px 10px 10px 0px;" @click="handleCheckedAllDelete()">일괄 삭제</button>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
                <th class="text-center d-md-table-cell">
                  <input type="checkbox" 
                    v-model="allChecked"
                    @click="checkAllHandler($event.target.checked)"
                    />
                </th>
                <th class="text-center d-md-table-cell">휴가유형</th>
                <th class="text-center d-none d-md-table-cell">휴가기간</th>
                <th class="text-center d-none d-md-table-cell">상태</th>
                <th></th>
            </tr>
          </thead>                    
          <tbody v-if="applyInfo.length === 0">
            <tr><td colSpan = '5'>데이터 없음.</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for='(apply, index) in applyInfo' v-bind:key='index'>
                <td class="text-center d-md-table-cell">
                  <input type="checkbox"
                    :id="'check_' + apply.id"
                    :value="apply.boardId"
                    v-model="apply.selected"
                    @change="checkHandler($event, apply)"
                    v-if="apply.vsCode == 'VS1'"
                  >
                </td>
                <td class="text-center d-md-table-cell">{{apply.vkCodeName}}</td>   
                <td class="text-center d-none d-md-table-cell">{{apply.regStartDate}} ~ {{apply.regEndDate}}</td>   
                <td class="text-center d-none d-md-table-cell">{{apply.vsCodeName}}</td>   
                <td style="text-align: center;" v-if="apply.vsCode =='VS1'">
                  <b-button @click="doUpdate(apply, $event.target)" ref="btnUpdate" class="btn btn-info updBtn">수정</b-button>
                  <button class="btn btn-danger delBtn" @click="doDelete(apply, index)">삭제</button>
                </td>  
                <td style="text-align: center;" v-else>
                  <button class="btn btn-info updBtn" disabled>수정</button>
                  <button class="btn btn-danger delBtn" disabled>삭제</button>
                </td>                        
            </tr>                  
          </tbody>
        </table>  
        <ApplyModifyModal 
          :regId="infoModal.regId"
          :code="infoModal.selected" 
          :regStartDate="infoModal.regStartDate" 
          :regEndDate="infoModal.regEndDate"
          :regReason="infoModal.regReason"
          :empCode="this.userInfo.empCode"
          @childData="childPopup"></ApplyModifyModal>
      </div>
    </div>
  </div>
</template>
<script>
import ApplyService from '../../services/apply-service'
import ApplyModal from './ApplyModal.vue'
/* eslint-disable */
import ApplyModifyModal from './ApplyModifyModal.vue'

export default {
  name: 'ApplyPage',
  components: {
    ApplyModal, ApplyModifyModal
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  data() {
    return {
      userInfo : {},
      applyInfo : [],
      selectList: [],
      allChecked : false,
      apply : {},
      infoModal: {
        id: 'modal-modify',
        selected: '',
        regStartDate: '',
        regEndDate: '',
        regReason: '',
        regId: 0
      },
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    }else{
      this.getApply()
    }
  },
  methods: {
    getApply() {
      ApplyService.apply().then(res => {
        this.userInfo = res.data

        var emp = res.data.register
        for (let i = 0; i < emp.length; i++) {
          emp[i].vkCodeName = emp[i].vkCode.codeName         //휴가 이름              
          emp[i].vkCodeValue = emp[i].vkCode.codeValue       //휴가 값(0.5 혹은 1)             
          emp[i].vkCode = emp[i].vkCode.code                 //휴가 유형 코드

          switch (emp[i].vsCode) {
            case 'VS1':
              emp[i].vsCodeName = '대기'
              break;
            case 'VS2':
              emp[i].vsCodeName = '승인'
              break;
            case 'VS3':
              emp[i].vsCodeName = '반려'
              break;
            default:
              break;
          }

          emp[i].selected = false
        }
        this.applyInfo = emp
      })
    },    
    childPopup(childData) {
      alert('휴가가 성공적으로 '+ childData +'되었습니다!')
      this.refresh()
    },
    handleCheckedAllDelete(){
      if(this.selectList.length < 1){
        alert('일괄 삭제할 항목이 존재하지 않습니다!');  
        return
      }

      let items = {
        ids: this.selectList,
        code: this.userInfo.empCode,
      };

      ApplyService.doAllDelete(items).then(res => {
        if(res == null)
          return
        alert('일괄 삭제 처리 하였습니다.')
        this.refresh()
      })
    },
    doDelete(apply,index){
      ApplyService.doDelete(apply).then(res => {
        if(res == null)
          return
        alert((index+1)+'번째 휴가 신청내역이 성공적으로 취소되었습니다!')
        this.refresh()
      }) 
    },    
    doUpdate(apply, button){
      this.infoModal.selected = apply.vkCode
      this.infoModal.regStartDate = apply.regStartDate
      this.infoModal.regEndDate = apply.regEndDate
      this.infoModal.regReason = apply.regReason
      this.infoModal.regId = apply.id
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    //화면 리렌더링 함수
    refresh(){
      this.applyInfo = []
      this.selectList = []
      this.allChecked = false   
      this.getApply()
    },
    // 전체선택
    checkAllHandler (checked) {
      this.allChecked = checked
      for (let i in this.applyInfo) {
        this.applyInfo[i].selected = this.allChecked;
      }      
      if (checked) {
        const ids = [];
        const items = this.applyInfo.filter(data => data.vsCode === 'VS1');      
        items.forEach((data) => ids.push(data.id));
        this.selectList = ids;
      } else {
        this.selectList = [];
      }
    },
    checkHandler (e, apply) {
      var checked = e.target.checked
      var id = apply.id

      if (checked) {
        this.selectList.push(id)
      } else {
        // 체크해제
        this.selectList = this.selectList.filter((data) => data !== id)
      }

      for (let i in this.selectList) {
        if(!this.selectList[i].selected) {
          this.allChecked = false;
          return;
        } else {
          this.allChecked = true;
        }
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
input[type=checkbox] {
  transform : scale(1.5);
}

@media (min-width: 320px) {
  .delBtn{
    margin-left: 5px;
  }
}

@media (max-width: 320px) {
  .delBtn{
    margin-top: 5px;
    font-size: 12px;
  }
  .updBtn{
    font-size: 12px;
  }

  .infoBtn{
    font-size: 12px;
  }
}

</style>