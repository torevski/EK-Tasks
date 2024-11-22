<template>
    <div>
      <label :for="field.key">{{ field.label }}</label>
      <input
        v-if="field.type === 'text'"
        :id="field.key"
        v-model="modelValue"
        :placeholder="field.placeholder || ''"
      />
      <select v-else-if="field.type === 'dropdown'" :id="field.key" v-model="modelValue">
        <option v-for="option in field.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <input
        v-else-if="field.type === 'checkbox'"
        type="checkbox"
        :id="field.key"
        v-model="modelValue"
      />

    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    field: {
      type: Object,
      required: true,
    },
    modelValue: {
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const updateValue = (value) => emit('update:modelValue', value);
  </script>
  