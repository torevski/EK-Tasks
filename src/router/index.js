import { createRouter, createWebHistory } from 'vue-router';
import TaskViewer from '@/components/TaskViewer.vue';
import DynamicForm from '@/components/DynamicForm.vue';
import HackerNewsClone from '@/components/HackerNewsClone.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/form-builder',
      name: 'Form Builder',
      component: DynamicForm,
    },
    {
      path: '/task-viewer',
      name: 'Task Viewer',
      component: TaskViewer,
    },
    {
      path: '/hacker-news-clone',
      name: 'Haccer News Clone',
      component: HackerNewsClone,
    },
  ],
});

export default router;
