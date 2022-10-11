<template>
  <div>
    <b-modal
      id="modal-modify"
      ref="modal"
      title="휴가 수정"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
        label="휴가 유형"
        label-for="vkoption"
        invalid-feedback="휴가 유형을 선택하세요."
        >
          <b-form-select
            id="vkoption"
            v-model="selected"
            :options="options"
          ></b-form-select>
        </b-form-group>

        <b-form-group
          label="휴가 일수"
          label-for="day-input"
          v-if="selected !== 'VK2'"
        >
          <b-form-input
            id="day-input"
            v-model="dayDiff"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="휴가 기간"
          label-for="day-from"
        >
          <div class="day-input"
          v-if="selected !== 'VK2'">
            <b-form-input
              id="day-from"
              v-model="from"
              type="date"
            ></b-form-input>  
            <p style="margin: 7px;">~</p>
            <b-form-input
              id="day-to"
              v-model="to"
              type="date"
            ></b-form-input>  
          </div>  
          <div class="day-input"
          v-if="selected === 'VK2'">
            <b-form-input
              id="day-from"
              v-model="when"
              type="date"
            ></b-form-input>  
          </div>        
        </b-form-group>
        
        <b-form-group
        label="휴가 사유"
        label-for="reason-input"
        invalid-feedback="휴가 사유를 입력하세요."
        :state="nameState"
        >
          <b-form-textarea
            id="reason-input"
            v-model="reason"
            :state="nameState"
            placeholder="사유 입력(반차 인 경우 오전/오후 표기 요망)"
            rows="3"
            max-rows="6"
            required
          ></b-form-textarea>
        </b-form-group>
      </form>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="danger" @click="cancel()">취소</b-button>
        <b-button variant="success" @click="ok()">신청</b-button>
      </template>
    </b-modal>
  </div>
</template>
  
<script>
  /* eslint-disable */
import ApplyService from '../../services/apply-service'
export default {
  name: 'ApplyModifyModal',  
  props : {
    empCode : String,
    code : String,
    regStartDate : String,
    regEndDate : String,
    regReason : String,
    regId : Number
  },
  data() {
    return {
      reason: this.regReason,
      nameState: null,
      selected: this.code,
      options: [
        { value: 'VK1', text: '연차' },
        { value: 'VK2', text: '반차' },
        { value: 'VK3', text: '출산전후휴가' },
        { value: 'VK4', text: '출산휴가' },
        { value: 'VK5', text: '경조사' },
        { value: 'VK6', text: '보건휴가' },
        { value: 'VK7', text: '병가' },
      ],     
      from: this.regStartDate,
      to: this.regEndDate,
      when: this.regStartDate, 
      id: this.regId
    }
  },
  computed: {
    dayDiff() {
      return this.getDateDiff(this.from, this.to)
    }
  },
  watch: {
    code() {
      const vm = this

      vm.selected = vm.code
      vm.from = vm.regStartDate
      vm.to = vm.regEndDate
      vm.when = vm.regStartDate
      vm.reason = vm.regReason
      vm.id = vm.regId
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      return valid
    },
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },    
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }

      let json = {}

      if(this.selected === 'VK2'){
        json = {
          regStartDate: new Date(this.when),
          regEndDate: new Date(this.when),
          regNum: 0.5,
          regReason: this.reason,
          code: this.selected,
          empCode: this.empCode,
          id: this.id
        }; 
      }else{
        json = {
          regStartDate: new Date(this.from),
          regEndDate: new Date(this.to),
          regNum: this.getDateDiff(this.from, this.to),
          regReason: this.reason,
          code: this.selected,
          empCode: this.empCode,
          id: this.id
        };  
      }

      ApplyService.doUpdate(json).then(res => {
        if(res == null)
          return;
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-modify')
          this.$emit('childData', '수정')
        })
      })      
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
    },
    getDateDiff(from, to){
      const date1 = new Date(from);
      const date2 = new Date(to);

      var time = Math.round((date2.getTime() - date1.getTime())/10000)*10000;

      //휴가일수 계산
      var dateDiff = Math.ceil(time / (1000 * 3600 * 24) + 1);

      // 사이에 낀 토,일 제외하기 위한 로직
      var weeks = Math.floor(dateDiff / 7);
      dateDiff = dateDiff - weeks * 2;
      //일요일 : 0, 토요일 : 6
      var startDay = date1.getDay();
      var endDay = date2.getDay();
      // 지난 토, 일 제거(목 ~ 월 인 경우)
      if (startDay - endDay > 1) dateDiff = dateDiff - 2;
      // 시작일 제거
      if (startDay === 0 && endDay !== 6) dateDiff = dateDiff - 1;
      // 종료일 제거
      if (endDay === 6 && startDay !== 0) dateDiff = dateDiff - 1;
      
      return parseInt(dateDiff); // 밀리세컨 * 초 * 분 * 시 = 일
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (min-width: 378px) {
  .day-input{
    display: flex;
  }
}

</style>
