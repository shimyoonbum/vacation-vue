<template>
  <div>
    <b-modal
      id="modal-reason"
      ref="modal"
      title="휴가 반려 사유 작성"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="반려 사유"
          label-for="reason-input"
          invalid-feedback="사유는 필수 입력값입니다."
          :state="reasonState"
        >
          <b-form-input
            id="reason-input"
            v-model="reason"
            :state="reasonState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="danger" @click="cancel()">취소</b-button>
        <b-button variant="success" @click="ok()">반려</b-button>
      </template>
    </b-modal>
  </div>
</template>
  
<script>
import VacationService from '../../services/vacation-service'
export default {
  name: 'RejectModal',  
  props : {
    vacId : Number
  },
  data() {
    return {
      id: this.vacId,
      reason: '',
      reasonState: null
    }
  },
  watch: {
    vacId() {
      const vm = this
      vm.id = vm.vacId
    }
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.reasonState = valid
      return valid
    },
    resetModal() {
      this.reason = ''
      this.reasonState = null
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

      VacationService.apply(this.id, {
        reason : this.reason,
        vsCode : 'VS3'
      }).then(res => {
        if(res == null)
            return
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-reason')          
          this.$emit('childData', '반려')
        })
      })     
    }
  }
}
</script>