<template>
  <div class="card">
    <div class="card-header text-center">
      <h4>Task viewer</h4>
    </div>
    <div class="card-body">
      <div
        class="row view-actions align-items-center py-3 d-flex justify-content-center"
      >
        <!-- Filters -->

        <div class="filter col-2">
          <label>Filter by Priority:</label>
          <select class="form-select" v-model="filterPriority">
            <option
              v-for="option in priorityOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
        <div class="show-copmleted col-2">
          <label>Show Completed:</label>
          <select class="form-select" v-model="filterCompleted">
            <option
              v-for="status in FilterStatusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>
        <div class="sort col-2">
          <label>Sort by:</label>
          <select class="form-select" v-model="sortOption">
            <option
              v-for="option in sortOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="clear-completed col-2">
          <button class="btn btn-success btn-sm mt-4" @click="clearCompleted">
            Clear Completed
          </button>
        </div>

        <div class="add-task col-2">
          <button class="btn btn-primary btn-sm mt-4" @click="openModal">
            Add New Task
          </button>
        </div>
      </div>

      <!-- color legend -->

      <div class="row color-legend d-flex justify-content-center mt-3">
        <p class="muted text-center text-line m-2">
          <span class="small">priority colors</span>
        </p>
        <div class="legend-item d-flex align-items-center col-2">
          <div
            class="legend-color me-2"
            style="
              background-color: #ccffcc;
              width: 20px;
              height: 20px;
              border-radius: 50px;
            "
          ></div>
          <p class="legend-text mb-0 small">low</p>
        </div>
        <div class="legend-item d-flex align-items-center col-2">
          <div
            class="legend-color me-2"
            style="
              background-color: #fff4cc;
              width: 20px;
              height: 20px;
              border-radius: 50px;
            "
          ></div>
          <p class="legend-text mb-0 small">medium</p>
        </div>
        <div class="legend-item d-flex align-items-center col-2">
          <div
            class="legend-color me-2"
            style="
              background-color: #ffcccc;
              width: 20px;
              height: 20px;
              border-radius: 50px;
            "
          ></div>
          <p class="legend-text mb-0 small">high</p>
        </div>
        <hr class="mt-2" />
      </div>

      <!-- Task List -->
      <div class="row py-5">
        <div
          class="task-card col-3 m-0"
          v-for="task in filteredAndSortedTasks"
          :key="task.title"
        >
          <div class="card mt-3" :class="getPriorityClass(task.priority)">
            <div
              class="card-header text-center d-flex justify-content-between"
              :style="{ backgroundColor: getPriorityColor(task.priority) }"
            >
              <input
                type="checkbox"
                v-model="task.completed"
                @change="saveTasks"
              />
              <strong :class="{ completed: task.completed }">{{
                task.title
              }}</strong>
              <button class="btn btn-danger btn-sm" @click="removeTask(task)">
                x
              </button>
            </div>
            <div class="card-body">
              <p>{{ task.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Task Modal -->
      <CreateTaskModal
        v-if="isModalVisible"
        :visible="isModalVisible"
        title="Create New Task"
        :priorityOptions="priorityOptions"
        @close="closeModal"
        @save="handleSaveTask"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CreateTaskModal from './CreateTaskModal.vue';
import Task from '@/classes/Task';

const priorityOptions = ['All', 'Low', 'Medium', 'High'];
const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Date', value: 'createdAt' },
  { label: 'Priority', value: 'priority' },
];
const FilterStatusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Completed', value: true },
  { label: 'Not Completed', value: false },
];

const newTaskTitle = ref('');
const newTaskDescription = ref('');
const newTaskPriority = ref('Low');
const tasks = ref([]);

const filterPriority = ref('All');
const filterCompleted = ref('All');
const sortOption = ref('title');

const isModalVisible = ref(false);

onMounted(() => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.value = savedTasks.map(
    (task) =>
      new Task(task.title, task.description, task.completed, task.priority)
  );
});

const removeTask = (task) => {
  if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
    tasks.value = tasks.value.filter((t) => t !== task);
    saveTasks();
  }
};

const clearCompleted = () => {
  tasks.value = tasks.value.filter((task) => !task.completed);
  saveTasks();
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

const filteredAndSortedTasks = computed(() => {
  let filteredTasks = tasks.value;

  if (filterPriority.value !== 'All') {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === filterPriority.value
    );
  }

  if (filterCompleted.value !== 'All') {
    filteredTasks = filteredTasks.filter(
      (task) => task.completed === (filterCompleted.value === true)
    );
  }

  filteredTasks.sort((a, b) => {
    if (sortOption.value === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOption.value === 'createdAt') {
      return a.createdAt - b.createdAt;
    } else if (sortOption.value === 'priority') {
      const priorityOrder = ['Low', 'Medium', 'High'];
      return (
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );
    }
    return 0;
  });

  return filteredTasks;
});

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleSaveTask = (taskData) => {
  tasks.value.push(taskData);
};

const getPriorityClass = (priority) => {
  if (priority === 'High') {
    return 'shadow-high';
  } else if (priority === 'Medium') {
    return 'shadow-medium';
  } else {
    return 'shadow-low';
  }
};
const getPriorityColor = (priority) => {
  if (priority === 'High') return '#ffcccc';
  if (priority === 'Medium') return '#fff4cc';
  return '#ccffcc';
};
</script>

<style scoped>
.task-card .card-body {
  height: 150px;
  overflow: scroll;
}

.shadow-high {
  box-shadow: 0 4px 8px #ffcccc;
}

.shadow-medium {
  box-shadow: 0 4px 8px #fff4cc;
}

.shadow-low {
  box-shadow: 0 4px 8px #ccffcc;
}

.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
}
.text-line {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #0000002c;
  line-height: 0.1em;
  margin: 10px 0 20px;
  color: #00000060;
}
.text-line span {
  background: #fff;
  padding: 0 10px;
}
</style>
