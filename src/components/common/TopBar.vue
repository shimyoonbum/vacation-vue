<template>
    <b-navbar type="dark" variant="dark" toggleable="lg">
      <b-navbar-brand>Metanet</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="currentUser">
          <b-nav-item>
            <router-link :to="'/'" class="nav-link">
              <font-awesome-icon icon="home" /> 홈
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="'/apply'" class="nav-link">
              <font-awesome-icon icon="fa-pen-to-square" /> 휴가 신청
            </router-link>
          </b-nav-item>
          <b-nav-item v-if="!currentRole">
            <router-link :to="'/manage'" class="nav-link">
              <font-awesome-icon icon="fa-list-check" /> 신청자 목록
            </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="'/notice'" class="nav-link">
              <font-awesome-icon icon="fa-calendar-days" /> 공지 사항
            </router-link>
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!currentUser">
            <router-link :to="'/login'" class="nav-link">
              <font-awesome-icon icon="sign-in-alt" /> 로그인
            </router-link>
          </b-nav-item>
          <b-nav-item v-if="currentUser">
            <router-link :to="'#none'" class="nav-link">
              <font-awesome-icon icon="user" /> {{currentUser.username}}
            </router-link>
          </b-nav-item>
          <b-nav-item v-if="currentUser">
            <!-- <a @click="logOut" class="nav-link"> -->
            <a href="/login" class="nav-link" @click="logOut">
              <font-awesome-icon icon="sign-out-alt" /> 로그아웃
            </a>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
      <!-- <div class="navbar-nav mr-auto" v-if="currentUser">
        <li class="nav-item">
          <a href="/" class="nav-link">
            <font-awesome-icon icon="home" /> 홈
          </a>
        </li>
        <li class="nav-item">
          <router-link :to="'/apply'" class="nav-link">
            <font-awesome-icon icon="fa-pen-to-square" /> 휴가 신청
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/manage'" class="nav-link"  v-if="!currentRole">
            <font-awesome-icon icon="fa-list-check" /> 신청자 목록
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/notice'" class="nav-link">
            <font-awesome-icon icon="fa-calendar-days" /> 공지 사항
          </router-link>
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
      </div> -->
    </b-navbar>
</template>
  
<script>
export default {
  name: 'TopBar',
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    currentRole (){
      var roles = this.$store.state.auth.user.roles;
      if(roles.indexOf("ROLE_ADMIN") == -1 )
        return true;
      else
        return false;
    }
  },
  methods: {
    logOut () {
      alert('로그아웃 되었습니다!')
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>