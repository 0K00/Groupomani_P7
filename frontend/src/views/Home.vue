<template>
  <div class="container">
    <div class="l-home">
      <h1 class="text-h2">Groupomania</h1>
      <div class="text-l mt-24">
        Groupomania helps you connect and share with the people in your company.
      </div>
      <div class="mt-24">
        <router-link class="mr-24" to="/login"
          ><button class="btn btn-primary btn-medium">
            Login
          </button></router-link
        >
        <router-link to="/signup"
          ><button class="btn btn-secondary btn-medium">
            Signup
          </button></router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/sass/main.scss";

export default {
  name: "Home",
};
</script>

<style lang="scss" scoped>
.l-home {
  margin: 124px auto;
}
</style>
