<template>
  <div class="post-group row py-2 mt-2 mb-1">
    <div class="post-preview col-1 ms-3">
      <vue-link-preview :url="post.url">
        <template v-slot:loader>
          <div class="" aria-hidden="true">
            <div class="">
              <h5 class="placeholder-glow">
                <span
                  class="placeholder col-6 ps-3"
                  style="width: 50px; height: 50px"
                ></span>
              </h5>
            </div>
          </div>
        </template>
        <template v-slot:default="preview">
          <div>
            <a :href="post.url" target="_blank " class="text-decoration-none">
              <img
                height="50px"
                width="50px"
                :src="preview.img"
                alt="no image"
              />
            </a>
          </div>
        </template>
      </vue-link-preview>
    </div>

    <div class="post-data col-9">
      <h4>{{ truncatedTitle }}</h4>

      <p class="small">
        <span class="pe-3">
          <i class="bi bi-person p"></i>
          {{ searchResult ? post.author : post.by }}
        </span>
        <span class="pe-3">
          <i class="bi bi-heart"></i>
          {{ searchResult ? post.points : post.score }}
        </span>
        <span class="pe-3">
          <i class="bi bi-clock"></i>
          {{
            searchResult
              ? formatPostTime(post.created_at_i)
              : formatPostTime(post.time)
          }}</span
        >
        <a :href="post.url" target="_blank " class="text-decoration-none">
          <span class="small text-primary"> {{ post.url }} </span></a
        >
      </p>
    </div>

    <div class="comments-counter col-1 pt-4 d-flex me-0 ms-auto">
      <p class="small" @click="fetchComments(post.id)" style="cursor: pointer">
        <i class="bi bi-chat-left-dots pe-2"></i
        >{{ searchResult ? post.children.length : comments.length }}
      </p>
    </div>
    <div v-if="!showComments" class="comments-section mt-3">
      <CommentsElement :comments="comments" />
    </div>
  </div>
  <hr />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import VueLinkPreview from '@ashwamegh/vue-link-preview';
import { formatDistanceToNow } from 'date-fns';
import hnService from '../services/hnServiceInstance.js';
import CommentsElement from '@/components/CommentsElement.vue';

const comments = ref([]);
const showComments = ref(false);

const formatPostTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  searchResult: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  fetchComments(props.id);
});

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

const truncatedTitle = computed(() => truncateText(props.post.title, 100));
const truncatedUrl = computed(() => truncateText(props.post.url, 120));

const fetchComments = async (postId) => {
  try {
    showComments.value = !showComments.value; 
    if (showComments.value) {
      const post = await hnService.fetchPostComments(postId);
      comments.value = post.children || [];
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};
</script>

<style></style>
