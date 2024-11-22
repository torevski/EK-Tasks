<template>
  <div>
    <div class="row hn-navbar m-0 d-flex align-items-center">
      <div class="logo col-1">
        <img src="@/assets/H_Logo_2.png" alt="Vue.js logo" />
      </div>
      <div class="col-4 ms-4">
        <input
          class="form-control"
          type="text"
          placeholder="Search posts..."
          v-model="query"
          @input="handleSearch"
        />
      </div>

      <div class="col-3 ms-4">
        <select v-model="filterType" @change="applyFilter" class="form-select">
          <option value="">Sort Posts</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="comments_asc">Comments (Ascending)</option>
          <option value="comments_desc">Comments (Descending)</option>
        </select>
      </div>
    </div>

    <div class="posts-section">
      <!-- Search Posts -->
      <div class="search-post-section" v-if="searchResults.length > 0">
        <h4 class="text-center py-2 search-title-color text-white">
          Search results
        </h4>
        <div v-for="result in filteredSearchResults" :key="result.objectID">
          <PostElement
            :post="result"
            :id="result.story_id"
            :searchResult="true"
          />
        </div>
      </div>

      <!-- Top Posts -->
      <h4 class="text-center py-2 story-title-color text-white">Top Posts</h4>
      <hr />
      <div v-for="post in filteredTopStories" :key="post.id">
        <PostElement :post="post" :id="post.id" />
      </div>

      <div v-if="loadingMore" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import hnService from '../services/hnServiceInstance.js';
import { onMounted, ref, onUnmounted, computed } from 'vue';

import PostElement from '@/components/PostElement.vue';

const posts = ref([]);
const searchResults = ref([]);
const query = ref('');
const error = ref(null);

const topStories = ref([]);
const loadingMore = ref(false);
const limit = 20;
const LOCAL_STORAGE_KEY = 'hn_top_stories';

const filterType = ref('');

const fetchTopStories = async () => {
  if (loadingMore.value) return;
  loadingMore.value = true;

  try {
    const fetchedStories = await hnService.getTopStories(limit);
    topStories.value = [...topStories.value, ...fetchedStories];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topStories.value));
  } catch (err) {
    const cachedStories = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedStories && topStories.value.length === 0) {
      topStories.value = JSON.parse(cachedStories);
      error.value = 'Showing cached data due to network issues.';
    } else {
      error.value =
        'Failed to fetch top stories, and no cached data is available.';
    }
  } finally {
    loadingMore.value = false;
  }
};

const handleSearch = async () => {
  if (query.value === '') {
    searchResults.value = [];
    return;
  }

  try {
    searchResults.value = await hnService.searchPosts(query.value);
  } catch (err) {
    error.value = err.message;
  }
};

const applyFilter = () => {
  filterType.value;
};

const filteredTopStories = computed(() => {
  const stories = [...topStories.value];
  if (filterType.value === 'latest') {
    return stories.sort((a, b) => b.time - a.time);
  } else if (filterType.value === 'oldest') {
    return stories.sort((a, b) => a.time - b.time);
  } else if (filterType.value === 'popular') {
    return stories.sort((a, b) => b.score - a.score);
  } else if (filterType.value === 'comments_asc') {
    return stories.sort(
      (a, b) => (a.kids?.length || 0) - (b.kids?.length || 0)
    );
  } else if (filterType.value === 'comments_desc') {
    return stories.sort(
      (a, b) => (b.kids?.length || 0) - (a.kids?.length || 0)
    );
  }
  return stories;
});

const filteredSearchResults = computed(() => {
  const results = [...searchResults.value];
  if (filterType.value === 'latest') {
    return results.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } else if (filterType.value === 'oldest') {
    return results.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  } else if (filterType.value === 'popular') {
    return results.sort((a, b) => b.points - a.points);
  } else if (filterType.value === 'comments_asc') {
    return results.sort((a, b) => a.num_comments - b.num_comments);
  } else if (filterType.value === 'comments_desc') {
    return results.sort((a, b) => b.num_comments - a.num_comments);
  }
  return results;
});

const handleScroll = () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const threshold = document.documentElement.scrollHeight - 100;
  if (scrollPosition >= threshold) {
    fetchTopStories();
  }
};

onMounted(() => {
  fetchTopStories();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.hn-navbar {
  background-color: #f8f9fa;
  height: 50px;
  border-bottom: 1px solid #e9ecef;
}
.hn-navbar img {
  height: 40px;
  margin: 5px;
}
.search-title-color {
  background-color: #6db0f7bd;
}
.story-title-color {
  background-color: #72ddab;
}
</style>
