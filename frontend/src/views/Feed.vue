<template>
  <div class="container posts">
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
    <div class="posts-bloc">
      <div class="posts-card">
        <div>
          <posts
            v-for="post of posts"
            :key="post.id"
            :post="post"
            :id="post.id"
            @deletePost="deletePost(post.id)"
            @likePost="likePost(post.id)"
            @reloadFeed="reloadFeed()"
            @onSubmitComment="onSubmitComment(post.id)"
            @deleteComment="deleteComment(comment.id)"
          >
          </posts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Posts from "@/components/Posts.vue";
import Tabbar from "@/components/Tabbar.vue";

export default {
  name: "Feed",
  components: {
    Posts,
    Tabbar,
  },
  computed: {
    posts() {
      return this.$store.getters.posts;
    },
  },
  data() {
    return {
      errorMessage: null,
      userdata: [],
    };
  },
  beforeMount() {
    this.$store.dispatch("getPosts");
  },
  mounted() {
    this.getUser();
  },

  methods: {
    deletePost(id) {
      this.$store.dispatch("deletePost", id);
    },
    deleteComment(id) {
      this.$store.dispatch("deleteComment", id);
    },
    getUser() {
      const getUser = JSON.parse(sessionStorage.getItem("vuex"));
      const userdata = getUser.user;
      this.userdata = userdata;
    },

    likePost(id) {
      const data = 1;
      this.$store.dispatch("likePost", {
        id: id,
        data: data,
      });
      this.$store.dispatch("getPosts");
    },
  },
};
</script>

<style lang="scss" scoped>
.posts {
  .l-posts {
    margin-bottom: 64px;
    position: relative;
    min-width: 300px;
  }

  &-bloc {
    margin-top: -40px;
    position: relative;
    width: 100vw;
    .posts-card {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &-options {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    :not(:last-child) {
      margin-right: 24px;
    }
  }
}
</style>
