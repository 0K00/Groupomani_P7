<template>
  <div class="tabbar-desktop">
    <router-link to="/posts" class="tab">
      <div class="fas fa-home"></div>
      <div class="tab-text">Feed</div>
    </router-link>
    <router-link to="/add" class="tab">
      <div class="fas fa-plus-circle"></div>
      <div class="tab-text">Add new publication</div>
    </router-link>
    <router-link :to="`/account/${user.id}`" class="tab">
      <div class="fas fa-user"></div>
      <div class="tab-text">My Profil</div>
    </router-link>
    <button v-if="$store.state.isLoggedIn" class="tab" @click="logout">
      <div class="fas fa-sign-out-alt"></div>
      <div class="tab-text">Disconnect</div>
    </button>
  </div>
</template>

<script>
import "../assets/sass/main.scss";

export default {
  name: "Tabbar",

  data() {
    return {
      user: [],
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      const getUser = JSON.parse(sessionStorage.getItem("vuex"));
      const user = getUser.user;
      this.user = user;
    },
    logout: function () {
      this.$store.dispatch("logOut");
      location.href = "/";
    },
  },
};
</script>
