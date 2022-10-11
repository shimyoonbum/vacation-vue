<template>
  <div id="app">
    <TopBar />
    <router-view />
    <BottomBar />
  </div>
</template>

<script>
import TopBar from "./components/common/TopBar.vue";
import BottomBar from "./components/common/BottomBar.vue";
export default {
  name: "App",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  components: { TopBar, BottomBar }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
label {
  font-family: 'DollarLight', sans-serif !important;
}

h2 {
  font-family: 'DollarBold', sans-serif !important;
}

h4, a, button, p {
  font-family: 'DollarLight', sans-serif !important;
}

@font-face {
  font-family:'DollarBold';
  src: url('./assets/fonts/DollarBold.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family:'DollarLight';
  src: url('./assets/fonts/DollarLight.ttf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family:'DollarRegular';
  src: url('./assets/fonts/DollarRegular.ttf') format('truetype');
  font-weight: 700;
}
</style>
