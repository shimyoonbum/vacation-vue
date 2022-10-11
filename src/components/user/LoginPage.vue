<template>
  <div class="col-md-12">
    <div class="card card-container">
      <h3>메타넷 글로벌 휴가관리 </h3>
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">아이디</label>
          <input
            type="text"
            class="form-control"
            name="username"
            v-model="user.username"
            v-validate="'required'"
          />
          <div
            class="alert alert-danger"
            role="alert"
            v-if="errors.has('username')"
          >아이디는 필수입니다!</div>
        </div>
        <div class="form-group">
          <label for="password">패스워드</label>
          <input
            type="password"
            class="form-control"
            name="password"
            v-model="user.password"
            v-validate="'required'"
          />
          <div
            class="alert alert-danger"
            role="alert"
            v-if="errors.has('password')"
          >패스워드는 필수입니다!</div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span class="spinner-border spinner-border-sm" v-show="loading"></span>
            <span>로그인</span>
          </button>
        </div>
        <div class="form-group">
          <div class="alert alert-danger" role="alert" v-if="message">{{message}}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
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
      message: ''
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.$validator.validateAll()

      if (this.user.username && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(() => {
          alert('로그인 성공!')
          this.$router.push('/')
        },
          error => {
            this.loading = false
            this.message = error.data
          }
        )
      }else{
        this.loading = false
        return
      }
    }
  }
}
</script>

<style scoped>
h3{
  text-align: center;
}
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 400px !important;
  padding: 40px 40px;
  border-radius: 10px;
}

.card {
  background-color: white;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.col-md-12 {
  background-image: url('../../assets/images/main.jpg');
  padding-top: 100px;
  padding-bottom: 100px;
}
</style>