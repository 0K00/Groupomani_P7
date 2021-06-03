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
    <div class="l-newPost">
      <div class="newPost-bloc">
        <h2 class="text-h3">New publication</h2>
        <form
          class="mt-24"
          @submit.prevent="onSubmit"
          enctype="multipart/form-data"
        >
          <div class="input input-squared input-medium">
            <label for="message">Your Text</label>
            <input
              id="message"
              type="text"
              label="Message"
              v-model="message"
              :rules="[rules.required]"
            />
          </div>

          <div class="input input-squared input-medium">
            <label for="image" class="pr-2">Your Image</label>
            <input
              id="image"
              @change="uploadImage"
              type="file"
              accept="image/png, image/jpeg,
                  image/bmp, image/gif"
              ref="file"
            />
          </div>

          <button
            class="btn btn-primary btn-medium"
            @click="onSubmit"
            :disabled="!isValid"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Tabbar from "@/components/Tabbar.vue";

export default {
  name: "NewPost",
  components: {
    Tabbar,
  },

  data() {
    return {
      isValid: true,
      options: true,
      showLink: true,
      showImage: false,
      withLink: false,
      withImage: false,
      withText: false,
      userdata: [],
      rules: {
        required: (value) => !!value || "Required.",
      },
      message: "",
      link: null,
      file: "",
    };
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
      const formData = new FormData();
      formData.append("message", this.message);
      if (this.link !== null) {
        formData.append("link", this.link);
      }
      if (this.file !== null) {
        formData.append("image", this.file);
      }
      this.$store.dispatch("createPost", formData);
      this.$router.push("/posts");
    },
  },
};
</script>

<style lang="scss" scoped>
.l-newPost {
  margin-top: 8px;
  position: relative;
  width: 100vw;
  .newPost-bloc {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
