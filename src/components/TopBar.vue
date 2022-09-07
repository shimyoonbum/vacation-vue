<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-brand">Metanet</div>
      <div class="navbar-nav mr-auto" v-if="currentUser">
        <li class="nav-item">
          <a href="/" class="nav-link">
            <font-awesome-icon icon="home" /> 홈
          </a>
        </li>
        <li class="nav-item">
          <a href="/" class="nav-link">
            <font-awesome-icon icon="fa-pen-to-square" /> 휴가 신청
          </a>
        </li>
        <li class="nav-item">
          <a href="/" class="nav-link">
            <font-awesome-icon icon="fa-list-check" /> 신청자 목록
          </a>
        </li>
      </div>
      <div class="navbar-nav ml-auto" v-if="!currentUser">        
        <li class="nav-item">
          <a href="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> 로그인
          </a>
        </li>
      </div>
      <div class="navbar-nav ml-auto" v-if="currentUser">
        <li class="nav-item">
          <a class="nav-link">
            <font-awesome-icon icon="user" />
            {{currentUser.username}}
          </a>
        </li>
        <li class="nav-item">
          <a href class="nav-link" @click="logOut">
            <font-awesome-icon icon="sign-out-alt" /> 로그아웃
          </a>
        </li>
      </div>
    </nav>
</template>
  
<script>
export default {
  name: 'TopBar',
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    logOut () {
        this.$store.dispatch('auth/logout')
    }
  }
}
</script>