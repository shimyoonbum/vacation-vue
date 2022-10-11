<template>
  <div class="container">
    <h2>USERINFO</h2>
    <hr>
    <div style="display: flex; justify-content: space-between;">
        <h4><strong style="color:slateblue">{{empInfo.empName}}</strong> 님 환영합니다!</h4>
        <b-button v-b-toggle.collapse-a class="detailBtn"><div><font-awesome-icon icon="fa-eye"/></div><p>상세정보</p></b-button>
    </div>
    <div style="text-align: center;">
      <br />        
      <b-collapse id="collapse-a" class="mt-2">
        <b-card>
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-coffee" /></div>
            <div :class='css2'>사번 </div>
            <div :class='css4'>{{empInfo.empCode}}</div>
          </div>
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-building" /></div>
            <div :class='css2'>직위 </div>
            <div :class='css4'>{{empInfo.empRank}}</div>
          </div>
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-sitemap" /></div>
            <div :class='css2'>조직 이름 </div>
            <div :class='css4'>{{empInfo.orgName}}</div>
          </div>
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-user" /></div>
            <div :class='css2'>조직 구분 </div>
            <div :class='css4'>{{empInfo.codeName}}</div>
          </div>                                   
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-calendar" /></div>
            <div :class='css2'>입사일 </div>
            <div :class='css4'>{{empInfo.joinDate}}</div>
          </div>
          <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-phone" /></div>
            <div :class='css2'>전화번호 </div>
            <div :class='css4'>{{empInfo.phone}}</div>
          </div>
          <!-- <div :class='css3'>
            <div :class='css1'><font-awesome-icon icon="fa-envelope" /></div>
            <div :class='css2'>이메일 :</div>
            <div :class='css4'>{{empInfo.email}}</div>
          </div> -->
        </b-card>
      </b-collapse>
      <br />        
      <div>
          <h2>개인 휴가 정보</h2>
          <p>발생일 수, 사용일 수, 잔여일 수 표시</p>
      </div>
    </div>
    <b-card-group deck>
        <b-card bg-variant="light" header="휴가 발생일 수" class="text-center">
            <b-card-text>
              <h3><font-awesome-icon icon="fa-umbrella-beach" /></h3>
              <h2>{{vacInfo.acqDaysNum}}</h2>
            </b-card-text>
        </b-card>
        <b-card bg-variant="light" header="휴가 사용일 수" class="text-center">
            <b-card-text>
              <h3><font-awesome-icon icon="fa-plane" /></h3>
              <h2>{{vacInfo.useDaysNum}}</h2>
            </b-card-text>
        </b-card>
        <b-card bg-variant="light" header="휴가 잔여일 수" class="text-center">
            <b-card-text>
              <h3><font-awesome-icon icon="fa-calendar-check" /></h3>
              <h2>{{vacInfo.resDaysNum}}</h2>
            </b-card-text>
        </b-card>
    </b-card-group>
    <div class="row">
      <MainList :title='title'></MainList>
      <MainList2 :title='title2'></MainList2>
    </div>
  </div>
</template>

<script>  
import MainList from './MainListPage.vue'
import MainList2 from './MainListPage2.vue'

export default {
  name: 'MainPage',
  components: {
    MainList, MainList2
  },
  data() {
    return {
      empInfo: {},
      vacInfo: {},
			css1 : 'css1',
			css2 : 'css2',
			css3 : 'css3',
			css4 : 'css4',
      title : '공지사항',
      title2 : '휴가내역'
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
      this.getMainData()
    }
  },
  methods: {
    getMainData() {
      this.$store.dispatch('auth/main').then(
        data => {       
          const info = data.employee

          const newInfo = {
            ...info,
            orgName : data.employee.organization.orgName,
            codeName : data.employee.organization.code.codeName
          }
          this.empInfo = newInfo          
          this.vacInfo = data.employee.vacation          
        },
        // eslint-disable-next-line
        error => {
          if(error.status === 401){
            alert('로그인이 필요합니다!')
            this.$router.push('/login')
          }else{
            alert('시스템 오류입니다!')
          }   
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

p{
  margin-top: 0;
  margin-bottom: 0;
}

.container{
  margin-top: 50px;
  margin-bottom: 50px;
}

.css1 {
  width: 20px;
}
.css2 {
  padding-left: 10px;
  text-align: left; 
  width: 100px;
  font-family: 'DollarLight', sans-serif !important;
}
.css3 {
  display: flex;
}
.css4 {
  padding-left: 10px;
  text-align: left; 
  width: 200px;
  word-break:break-all;
}

@media (max-width: 410px) {
  .detailBtn{
    font-size: 12px;
    margin-left: 10px;
  }
}

</style>
