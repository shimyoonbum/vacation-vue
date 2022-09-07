<template>
  <div id="app">
    <TopBar />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TopBar from "./components/TopBar.vue";
export default {
    name: "App",
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    components: { TopBar }
}
</script>