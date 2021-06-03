<template>
  <div class="container">
    <div class="l-menu">
      <h1 class="text-h2">Groupomania</h1>
      <div class="user user-medium">
        <div class="avatar avatar-medium">
          <img
            :src="userdata.photo"
            alt="Profil picture"
            v-if="userdata.photo"
          />
        </div>
        <div class="user-container">
          <span class="user-name">{{ userdata.pseudo }}</span>
          <span class="user-content">{{ userdata.bio }}</span>
        </div>
      </div>
      <Tabbar />
      <div class="trademark">© 2021 · Groupomania · All rights reserved</div>
    </div>
    <div class="l-post">
      <div class="post-bloc">
        <h2 class="text-h3">Modify Publication</h2>

        <form enctype="multipart/form-data" class="mt-24">
          <div class="input input-squared input-medium">
            <label for="message">Message</label>
            <input
              id="message"
              label="Message"
              type="text"
              v-model="message"
              :placeholder="post.message"
              required
            />
          </div>

          <div class="card">
            <img v-if="post.imageUrl" :src="post.imageUrl" class="card-img" />
          </div>

          <div class="input input-squared input-medium">
            <label for="image">Image</label>
            <input
              id="image"
              @change="uploadImage"
              type="file"
              accept="image/png, image/jpeg,image/bmp, image/gif"
              ref="file"
            />
          </div>

          <button @click="onSubmit" class="btn btn-primary btn-medium">
            Modify
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Tabbar from "@/components/Tabbar.vue";

export default {
  name: "SinglePost",
  components: {
    Tabbar,
  },
  data() {
    return {
      userdata: [],
      message: "",
      link: null,
      file: "",
    };
  },
  computed: {
    post() {
      return this.$store.getters.post;
    },
  },
  beforeMount() {
    let id = this.$route.params.id;
    this.$store.dispatch("getPostById", id);
  },
  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      const getUser = JSON.parse(sessionStorage.getItem("vuex"));
      const userdata = getUser.user;
      this.userdata = userdata;
    },
    uploadImage() {
      const file = this.$refs.file.files[0];
      this.file = file;
    },
    onSubmit() {
      let id = this.$route.params.id;
      const formData = new FormData();
      if (this.message !== null) {
        formData.append("message", this.message);
      }

      if (this.link !== null) {
        formData.append("link", this.link);
      }
      formData.append("image", this.file);
      this.$store.dispatch("getPosts");
      this.$store.dispatch("updatePost", formData);
      this.$store.dispatch("getPostById", id);
      this.$router.push("/posts");
    },

    newLink() {
      this.linkInput = true;
    },
    newText() {
      this.textInput = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.l-post {
  margin-top: 8px;
  position: relative;
  width: 100vw;
  .post-bloc {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
