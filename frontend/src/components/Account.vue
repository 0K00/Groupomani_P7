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
    <div class="l-account">
      <div class="account-bloc">
        <h2 class="text-h3 mt-24">Your profil</h2>
        <div class="mt-24">
          <div v-if="!$store.state.user.admin === true">
            <template>
              <button
                @click="deleteAccount(user.id)"
                class="btn btn-delete btn-medium"
              >
                Delete account
              </button>
            </template>
          </div>
        </div>

        <div class="modify-container mt-24" v-if="showPseudo">
          <div class="text-m text-gray-100">{{ user.pseudo }}</div>
          <button class="btn btn-secondary btn-small" @click="togglePseudo">
            <span class="fas fa-pen"></span>
          </button>
        </div>
        <div v-if="updatePseudo" class="input input-squared input-medium mt-24">
          <label for="pseudo">Change your Pseudo</label>
          <input
            id="pseudo"
            v-model="newPseudo"
            type="text"
            label="Pseudo"
            :rules="pseudoRules"
            :placeholder="user.pseudo"
            required
          />
        </div>

        <div class="modify-container mt-24" v-if="showBio">
          <span class="text-m text-gray-100">{{ user.bio }}</span>
          <button @click="toggleBio" class="btn btn-secondary btn-small">
            <span class="fas fa-pen"></span>
          </button>
        </div>
        <div v-if="updateBio" class="input input-squared input-medium mt-24">
          <label for="bio">Change your Bio</label>
          <input
            id="bio"
            type="text"
            label="Bio"
            v-model="newBio"
            :rules="bioRules"
            :placeholder="user.bio"
          />
        </div>

        <div class="modify-container mt-24" v-if="showPhoto">
          <img
            v-if="user.photo"
            :src="user.photo"
            alt="Profil picture"
            width="200"
            height="200"
          />
          <button @click="togglePhoto" class="btn btn-secondary btn-small">
            <span class="fas fa-pen"></span>
          </button>
        </div>
        <div v-if="updatePhoto" class="input input-squared input-medium mt-24">
          <label for="image">Change your Picture</label>
          <input
            id="image"
            @change="uploadImage"
            type="file"
            accept="image/png, image/jpeg,
                    image/bmp, image/gif"
            ref="file"
            name="image"
          />
        </div>

        <div v-if="options" class="account_send">
          <div class="mt-24">
            <button
              class="btn btn-primary btn-medium"
              @click="onSubmit(user.id)"
              :disabled="!isValid"
            >
              Modify account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabbar from "@/components/Tabbar.vue";

export default {
  name: "Account",
  components: {
    Tabbar,
  },
  data() {
    return {
      updateBio: false,
      updatePseudo: false,
      updatePhoto: false,
      showPseudo: true,
      showPhoto: true,
      showBio: true,
      isValid: true,
      options: false,
      newPseudo: "",
      newBio: "",
      userdata: [],
      pseudoRules: [
        (v) => v.length <= 30 || "Max 30 caractères",
        (v) => !!v || "Le pseudo est obligatoire",
      ],
      bioRules: [(v) => v.length <= 400 || "Max 400 caractères"],
      file: "",
      messageRetour: null,
      errorMessage: null,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },

  beforeMount() {
    this.$store.dispatch("getUserById");
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
    togglePseudo() {
      this.updatePseudo = true;
      this.showPseudo = false;
      this.options = true;
    },
    togglePhoto() {
      this.updatePhoto = true;
      this.showImage = false;
      this.options = true;
      this.showPhoto = false;
    },
    toggleBio() {
      this.updateBio = true;
      this.showBio = false;
      this.options = true;
    },
    uploadImage() {
      const file = this.$refs.file.files[0];
      this.file = file;
      console.log(this.file);
    },
    onSubmit() {
      const formData = new FormData();
      formData.append("pseudo", this.newPseudo);
      formData.append("bio", this.newBio);
      if (this.file !== null) {
        formData.append("image", this.file);
      }
      this.$store.dispatch("getUsers");
      this.$store.dispatch("getUserById", this.user.id);
      this.$store.dispatch("updateAccount", formData);
      this.$store.dispatch("getUserById", this.user.id);
      this.updateBio = false;
      this.updatePhoto = false;
      this.updatePseudo = false;
      this.options = false;
      this.showBio = true;
      this.showPhoto = true;
      this.showPseudo = true;
    },
    deleteAccount(id) {
      this.$store.dispatch("deleteAccount", id);
      this.$store.dispatch("logOut");
      setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.l-account {
  margin-top: -18px;
  position: relative;
  width: 100vw;
  .account-bloc {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
