<template>
  <div>
    <ul class="nav justify-content-center py-2 mb-4 bg-info-subtle">
      <li class="nav-item">
        <router-link
          :class="[
            isActiveLink('/form-builder') ? 'active-link' : '',
            'nav-link',
          ]"
          aria-current="page"
          to="/form-builder"
        >
          Dynamic Form Builder
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :class="[
            isActiveLink('/task-viewer') ? 'active-link' : '',
            'nav-link',
          ]"
          to="/task-viewer"
        >
          Task Viewer
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :class="[
            isActiveLink('/hacker-news-clone') ? 'active-link' : '',
            'nav-link',
          ]"
          to="/hacker-news-clone"
        >
          Hacker News Clone
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<style scoped>
.nav-link {
  color: rgb(235, 76, 76);
  text-decoration: none;
}

.nav-link.active-link {
  color: rgb(49, 170, 49);
  font-weight: bold;
}
</style>
