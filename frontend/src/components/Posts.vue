<template>
  <div class="container">
    <div class="l-posts">
      <div class="post-title">
        <div class="user user-medium">
          <div class="avatar avatar-medium">
            <img
              :src="post.User.photo"
              alt="Profil picture"
              v-if="post.User.photo"
            />
          </div>
          <div class="user-container">
            <span class="user-name">{{ post.User.pseudo }}</span>
            <span class="user-content">{{
              post.createdAt | moment("MM/DD/YYYY")
            }}</span>
          </div>
        </div>
        <button
          v-if="
            $store.state.user.id == post.User.id ||
            $store.state.user.admin === true
          "
          @click="showoption = !showoption"
          class="btn btn-option"
        >
          <span class="fas fa-ellipsis-h"></span>
        </button>
        <div v-show="showoption" class="posts-options">
          <div v-if="$store.state.user.id == post.User.id">
            <template>
              <button
                class="btn btn-secondary btn-medium"
                aria-label="modify post"
                @click="getOnePost(post.id)"
              >
                Modify
              </button>
            </template>
          </div>
          <div
            v-if="
              $store.state.user.id === post.User.id ||
              $store.state.user.admin === true
            "
          >
            <template>
              <button
                class="btn btn-delete btn-medium"
                aria-label="delete post"
                @click="deletePost(post.id)"
              >
                Delete
              </button>
            </template>
          </div>
        </div>
      </div>
      <div class="post-content">
        <div class="card">
          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            :alt="post.message"
            class="card-img"
          />
        </div>
        <div class="card-content">
          <p class="text">
            {{ post.message }}
          </p>
        </div>
      </div>
      <div class="post-inte">
        <div class="int-container">
          <button @click="likePost(post.id)" aria-label="like" class="int">
            <div :class="isLiked" class="fas fa-heart"></div>
            <div class="int-value">{{ post.Likes.length }}</div>
          </button>

          <button @click="show = !show" aria-label="comment" class="int">
            <div class="fas fa-comment"></div>
            <div class="int-value">{{ post.Comments.length }}</div>
          </button>
        </div>
        <div v-show="show">
          <div class="l-comment">
            <div class="form-comment">
              <form
                @submit.prevent="onSubmitComment(post.id)"
                enctype="multipart/form-data"
              >
                <div class="input input-small">
                  <label for="comment">Your Comment</label>
                  <input
                    id="comment"
                    name="comment"
                    type="text"
                    label="your comment"
                    v-model="data.commentMessage"
                  />
                </div>
                <button class="btn btn-primary btn-small" aria-label="publish">
                  Publish
                </button>
              </form>
            </div>
            <div
              v-for="comment in post.Comments"
              :key="comment.id"
              :comment="comment"
            >
              <div class="comment">
                <div class="user user-small">
                  <div class="avatar avatar-small">
                    <img :src="comment.User.photo" alt="Profil picture" />
                  </div>

                  <div class="user-container user-comment">
                    <div v-html="comment.User.pseudo" class="user-name"></div>
                    <div v-html="comment.message" class="user-content"></div>
                  </div>
                </div>

                <template
                  v-if="
                    $store.state.user.id === comment.UserId ||
                    $store.state.user.admin === true
                  "
                >
                  <button
                    @click="deleteComment(comment.id)"
                    class="btn btn-delete btn-small"
                    aria-label="delete comment"
                  >
                    Delete
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/sass/main.scss";
import PostService from "../services/PostService";

export default {
  name: "Posts",

  props: {
    post: {
      type: Object,
    },
  },

  data: function () {
    return {
      show: false,
      showoption: false,
      user: false,
      commentForm: false,
      userdata: [],
      showFeed: true,
      update: false,
      isValid: true,
      rules: {
        required: (value) => !!value || "Required.",
      },
      data: {
        commentMessage: "",
        commentPseudo: this.$store.state.user.pseudo,
      },
    };
  },
  computed: {
    isLiked() {
      const userId = this.$store.state.user.id;
      let userLike = this.post.Likes.map((a) => a.UserId);
      if (userLike.includes(userId)) {
        return "int_active";
      } else {
        return "";
      }
    },
  },

  methods: {
    async reloadFeed() {
      try {
        const response = await PostService.getPosts();
        this.posts = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.error;
      }
    },
    getProfile(id) {
      this.$router.push(`/account/${id}`);
    },
    deletePost() {
      this.$emit("deletePost", this.post.id);
    },
    likePost() {
      this.$emit("likePost", this.post.id);
    },
    getOnePost(id) {
      this.$router.push(`posts/${id}`);
    },
    onSubmitComment(id) {
      this.$store.dispatch("getPosts");
      this.$store.dispatch("commentPost", {
        id: id,
        data: this.data,
      });
      this.data.commentMessage = "";
      this.$store.dispatch("getPosts");
      this.$store.dispatch("getPostById", this.post.id);
    },

    deleteComment(id) {
      this.$store.dispatch("deleteComment", id), this.reloadFeed();
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

.l-comment {
  .form-comment {
    form {
      display: flex;
      align-items: center;
      button {
        height: fit-content;
        margin-left: 24px;
      }
    }
  }
  .comment {
    display: flex;
    align-items: center;

    button {
      margin-left: 24px;
      margin-top: 8px;
    }
  }
}
</style>
