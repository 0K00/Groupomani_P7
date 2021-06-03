<template>
  <div class="container">
    <div class="l-login">
      <h1 class="text-h2">Groupomania</h1>
      <form class="mt-24">
        <div class="input input-squared input-medium">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            label="email"
            v-model="email"
            type="email"
            :rules="[(v) => !!v || 'Email is required']"
            required
          />
        </div>
        <div class="input input-squared input-medium">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            label="mot de passe"
            v-model="password"
            type="password"
            :rules="[(v) => !!v || 'Password is required']"
            required
          />
        </div>
      </form>

      <div class="danger-alert" v-html="errorMessage" />

      <button class="btn btn-primary btn-medium" v-on:click.prevent="login">
        Login
      </button>
      <router-link to="/signup" class="text-m text-gray-50 text-not_underline"
        >Signup</router-link
      >
    </div>
  </div>
</template>

<script>
import "../assets/sass/main.scss";
import Auth from "../services/Auth.js";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
      isValid: true,
    };
  },
  methods: {
    async login() {
      try {
        const response = await Auth.login({
          email: this.email,
          password: this.password,
        });

        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$store.dispatch("getUserById", response.data.user.id);
        let router = this.$router;
        setTimeout(function () {
          router.push("/posts");
        });
      } catch (error) {
        this.errorMessage = error.response.data.error;
        setTimeout(() => {
          this.email = "";
          this.password = "";
          this.errorMessage = "";
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.l-login {
  margin: 124px auto;
}
</style>
