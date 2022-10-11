<template>
<div class="col-lg-6" style="margin-top:20px">
    <div class="card shadow">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between;">
          <h4 class="card-title">{{title}}</h4>        
          <router-link :to="'/apply'" class="btn btn-primary" style="margin-bottom: 20px;">상세보기</router-link>
        </div>
        <table class="table table-hover" id='board_list'>
          <thead>
            <tr>
                <th class="text-center">근태구분</th>
                <th class="text-center d-none d-xl-table-cell">근태기간</th>
                <th class="text-center">승인여부</th>
            </tr>
          </thead>
          <tbody v-if="list.length === 0">
            <tr><td colSpan = '3'>데이터 없음.</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for='(obj, index) in list' v-bind:key='index' @click='goDetail(obj)'>
              <td class="text-center d-md-table-cell">{{obj.vkCodeName}}</td>
              <td class="text-center d-none d-xl-table-cell">{{obj.regStartDate}} ~ {{obj.regEndDate}}</td>
              <td class="text-center d-md-table-cell">{{obj.vsCodeName}}</td>     
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</div>
</template>
<script>    
import ApplyService from '../../services/apply-service'

export default {
  name: 'MainListPage2',
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
      this.getData()
    }
  },
  methods: {
    getData() {                   
      ApplyService.applyTop5().then(data => {
        var apply = data.data;
        for (let i = 0; i < apply.length; i++) {
          apply[i].vkCodeName = apply[i].vkCode.codeName;         //휴가 이름              
          apply[i].vkCodeValue = apply[i].vkCode.codeValue;       //휴가 값(0.5 혹은 1)             
          apply[i].vkCode = apply[i].vkCode.code;                 //휴가 유형 코드

          switch (apply[i].vsCode) {
            case 'VS1':
              apply[i].vsCodeName = '대기';
              break;
            case 'VS2':
              apply[i].vsCodeName = '승인';
              break;
            case 'VS3':
              apply[i].vsCodeName = '반려';
              break;
            default:
              break;
          }
        }
        
        this.list = apply
      });  
    },
    goDetail(){            
      this.$router.push('/apply')
    } 
  }
}
</script>
<style>
  #board_list > tbody > tr {
    cursor: pointer;
  }
</style>    