<template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h5>{{ title }}</h5>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="taskTitle">Title:</label>
              <input
                id="taskTitle"
                type="text"
                class="form-control"
                v-model="taskTitle"
                required
                placeholder="Enter task title"
              />
            </div>
            <div class="form-group">
              <label for="taskDescription">Description:</label>
              <textarea
                id="taskDescription"
                class="form-control"
                v-model="taskDescription"
                rows="3"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="taskPriority">Priority:</label>
              <select
                id="taskPriority"
                class="form-select"
                v-model="taskPriority"
                required
              >
                <option v-for="priority in newPriorityOptions" :key="priority" :value="priority">
                  {{ priority }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  const props = defineProps({
    visible: Boolean,
    title: String,
    priorityOptions: {
      type: Array,
      required: true,
      default: () => ['Low', 'Medium', 'High'] 
    }
  });
  // removing "All" from the priority options
  const newPriorityOptions = props.priorityOptions.filter((option) => option !== 'All');
  

  const emit = defineEmits(['close', 'save']);
  
 
  const taskTitle = ref('');
  const taskDescription = ref('');
  const taskPriority = ref(props.priorityOptions[0] || 'Low');
  

  const closeModal = () => {
    emit('close');
  };
  

const submitForm = () => {
  const taskData = {
    title: taskTitle.value,
    description: taskDescription.value,
    priority: taskPriority.value,
  };

  emit('save', taskData);

  resetForm();
  closeModal();
};
  

  const resetForm = () => {
    taskTitle.value = '';
    taskDescription.value = '';
    taskPriority.value = props.priorityOptions[0] || 'Low';
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    width: 400px;
    max-width: 90%;
    padding: 20px;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .modal-header h5 {
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .modal-body {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  