<template>
  <hr class="m-0" />
  <ul class="comment-list pt-3">
    <li
      v-for="comment in comments"
      :key="comment.id"
      class="mb-3 comment-item"
      :style="{ '--line-color': getRandomColor() }"
    >
      <div class="comment">
        <div class="d-flex">
          <div>
            <AcronimBageAvatar :name="comment.author" />
          </div>
          <div>
            <p class="text-muted small ps-2">{{ comment.author }}</p>
          </div>
          <div>
            <p class="ps-2 pe-3 mb-3 small text-secondary">
              - {{ formatPostTime(comment.created_at_i) }}
            </p>
          </div>
        </div>
        <p v-html="comment.text"></p>
        <hr />
        <!-- Nested comments -->
        <CommentsElement
          v-if="comment.children && comment.children.length"
          :comments="comment.children"
        />
      </div>
    </li>
  </ul>
</template>

<script setup>
import AcronimBageAvatar from '@/components/AcronimBageAvatar.vue';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});

const formatPostTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};

const getRandomColor = () => {
  const colors = [
    '#00ffaa71',
    '#f4f26094',
    '#5977ff79',
    '#af59ff93',
    '#ff599983',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
</script>

<style scoped>
.comment-list {
  list-style: none;
  padding-left: 20px;
  position: relative;
  background-color: rgba(127, 204, 255, 0.027);
}

.comment-item {
  position: relative;
  margin-bottom: 15px;
  padding-left: 15px;
  border-left: 2px solid var(--line-color);
}

.comment {
  margin-left: 10px;
  padding-left: 10px;
}
</style>
