<template>
  <div class="container">
    <div class="l-signup">
      <h1 class="text-h2">Groupomania</h1>

      <form class="mt-24" autocomplete="off">
        <div class="input input-squared input-medium">
          <label for="pseudo">Pseudo</label>
          <input
            id="pseudo"
            name="pseudo"
            label="pseudo"
            v-model="pseudo"
            type="text"
            :rules="[(v) => !!v || 'Pseudo is required']"
            required
          />
        </div>
        <div class="input input-squared input-medium">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            label="email"
            v-model="email"
            type="email"
            :rules="emailRules"
            required
            class="input input-squared"
            autocomplete="off"
          />
        </div>
        <div class="input input-squared input-medium">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            label="password"
            v-model="password"
            type="password"
            :rules="[(v) => !!v || 'Password is required']"
            required
            class="input input-squared"
          />
        </div>
      </form>

      <div class="danger-alert" v-html="errorMessage" />

      <button class="btn btn-primary btn-medium" v-on:click.prevent="signup">
        Signup
      </button>
      <router-link to="/login" class="text-m text-gray-50 text-not_underline"
        >Login</router-link
      >
    </div>
  </div>
</template>

<script>
import "../assets/sass/main.scss";
import Auth from "../services/Auth.js";
export default {
  name: "Signup",
  data() {
    return {
      pseudo: "",
      email: "",
      password: "",
      errorMessage: null,
      hasSignedUp: false,
      emailRules: [
        (v) => !!v || "Email is required.",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid.",
      ],
      pseudoRules: [(v) => v.length <= 30 || "Between 3 and 30 characters."],
      passwordRules: [
        (v) =>
          v.length <= 30 ||
          "Password must be 8 letters minimum, upper, lower case and no symbols.",
      ],
    };
  },
  methods: {
    async signup() {
      try {
        const response = await Auth.signup({
          pseudo: this.pseudo,
          email: this.email,
          password: this.password,
        });
        this.message = response.data.message;
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$store.dispatch("getUserById", response.data.user.id);

        let router = this.$router;
        setTimeout(function () {
          router.push("/posts");
        }, 1500);
      } catch (error) {
        this.errorMessage = error.response.data.error;
        setTimeout(() => {
          this.errorMessage = "";
        }, 1500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.l-signup {
  margin: 124px auto;
}
</style>
