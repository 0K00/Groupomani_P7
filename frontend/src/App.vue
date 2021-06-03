<template>
  <div>
    <router-view></router-view>
    <!-- Display view pages here based on route -->
  </div>
</template>

<script>
export default {
  name: "app",
  data: () => {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  mounted() {
    this.$store.dispatch("getUsers");
    this.$store.dispatch("getUserById", this.user.id);
  },
};
</script>
<style lang="scss"></style>
