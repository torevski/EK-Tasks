<template>
  <div class="row d-flex justify-content-center">
    <div class="card col-10 px-0">
      <div class="card-header m-0 text-center">
        <h4>Add New Field</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="mb-3 col-6">
            <label class="form-label">Label</label>
            <input
              type="text"
              v-model="newField.label"
              class="form-control"
              placeholder="Enter field label"
            />
          </div>

          <div class="mb-3 col-6">
            <label class="form-label">Field Type</label>
            <select v-model="newField.type" class="form-select">
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>

          <div
            class="mb-3 col-6"
            v-if="newField.type === 'text' || newField.type === 'number'"
          >
            <label class="form-label">Placeholder</label>
            <input
              type="text"
              v-model="newField.placeholder"
              class="form-control"
              placeholder="Enter field placeholder"
            />
          </div>

          <div v-if="newField.type === 'dropdown'" class="mb-3 col-6">
            <label class="form-label">Dropdown Options (comma-separated)</label>
            <input
              type="text"
              v-model="newField.optionsInput"
              class="form-control"
              placeholder="Option1, Option2, Option3"
            />
          </div>

          <!-- Conditional Rendering Inputs -->
          <div class="mb-3 col-6">
            <label class="form-label">Conditionally Rendered?</label>
            <select v-model="newField.conditional.key" class="form-select">
              <option value="">No Condition</option>
              <option
                v-for="field in formSchema.fields"
                :key="field.key"
                :value="field.key"
              >
                {{ field.label }}
              </option>
            </select>
          </div>
          <div v-if="newField.conditional.key" class="mb-3 col-6">
            <label class="form-label">Show When Value Is True:</label>
            <input
              type="checkbox"
              v-model="newField.conditional.value"
              class="form-check-input"
            />
          </div>

          <div>
            <button class="btn btn-primary" @click="addField">Add Field</button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center pt-3">
      <div class="card col-5 px-0 me-2">
        <div class="card-header text-center">
          <h4>Dynamic Form Preview</h4>
        </div>
        <div class="card-body preview-content">
          <form @submit.prevent="submitForm">
            <div
              v-for="field in formSchema.fields"
              :key="field.key"
              class="d-flex align-items-center mb-3"
            >
              <!-- Field Input -->
              <div class="flex-grow-1" v-if="shouldFieldRender(field)">
                <!-- Text Field -->
                <div v-if="field.type === 'text'" class="mb-3">
                  <label :for="field.key" class="form-label">{{
                    field.label
                  }}</label>
                  <input
                    type="text"
                    :id="field.key"
                    v-model="formValues[field.key]"
                    :placeholder="field.placeholder"
                    class="form-control"
                    @blur="validateField(field)"
                  />
                  <small v-if="errors[field.key]" class="text-danger">
                    {{ errors[field.key] }}
                  </small>
                </div>

                <!-- Number Field -->
                <div v-else-if="field.type === 'number'" class="mb-3">
                  <label :for="field.key" class="form-label">{{
                    field.label
                  }}</label>
                  <input
                    type="number"
                    :id="field.key"
                    v-model="formValues[field.key]"
                    :placeholder="field.placeholder"
                    class="form-control"
                    @blur="validateField(field)"
                  />
                  <small v-if="errors[field.key]" class="text-danger">
                    {{ errors[field.key] }}
                  </small>
                </div>

                <!-- Checkbox -->
                <div
                  v-else-if="field.type === 'checkbox'"
                  class="form-check mb-3"
                >
                  <input
                    type="checkbox"
                    :id="field.key"
                    v-model="formValues[field.key]"
                    class="form-check-input"
                    @change="validateField(field)"
                  />
                  <label :for="field.key" class="form-check-label">
                    {{ field.label }}
                  </label>
                </div>

                <!-- Dropdown -->
                <div v-else-if="field.type === 'dropdown'" class="mb-3">
                  <label :for="field.key" class="form-label">{{
                    field.label
                  }}</label>
                  <select
                    :id="field.key"
                    v-model="formValues[field.key]"
                    class="form-select"
                  >
                    <option
                      v-for="option in field.options"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>

              <button
                v-if="shouldFieldRender(field)"
                type="button"
                class="btn btn-danger btn-sm ms-2 mt-2"
                @click="removeField(field.key)"
                title="Remove Field"
              >
                x
              </button>
            </div>
            <div class="d-flex">
              <button type="submit" class="btn btn-primary mt-3">Submit</button>
              <div></div>
              <button
                @click="clearLocalStorage"
                class="btn btn-danger mt-3 ms-auto"
              >
                Clear Local Storage
              </button>
            </div>
            <small class="text-body-secondary pt-2 ms-auto d-block text-end"
              >*all changes are saved in local storage</small
            >
          </form>
        </div>
      </div>

      <div class="card col-5 px-0 ms-1">
        <div class="card-header text-center">
          <h4>Preview Form Schema (JSON)</h4>
        </div>
        <div class="card-body preview-content">
          <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import formSchema from '@/schemas/formSchema.json';
import { reactive } from 'vue';
import {
  TextField,
  NumberField,
  CheckboxField,
  DropdownField,
} from '@/classes/FormFields.js';

const formValues = reactive({});
const errors = reactive({});

const newField = reactive({
  key: '',
  label: '',
  type: 'text',
  optionsInput: '',
  options: [],
  conditional: {
    key: '',
    value: false,
  },
});

formSchema.fields.forEach((field) => {
  formValues[field.key] = field.type === 'checkbox' ? false : '';
  errors[field.key] = '';
});

const shouldFieldRender = (field) => {
  if (!field.conditional) return true;
  const { key, value } = field.conditional;
  return formValues[key] === value;
};

const saveToLocalStorage = () => {
  localStorage.setItem('formSchema', JSON.stringify(formSchema));
};

// Load the schema from localStorage
const loadFromLocalStorage = () => {
  const savedSchema = localStorage.getItem('formSchema');
  if (savedSchema) {
    formSchema.fields = JSON.parse(savedSchema).fields;
  }
};

loadFromLocalStorage();

const addField = () => {
  if (!newField.label || !newField.type) {
    alert('Label and Type are required!');
    return;
  }

  const key = newField.label.toLowerCase().replace(/\s+/g, '_');
  let field;

  if (newField.type === 'text') {
    field = new TextField({
      key,
      label: newField.label,
      placeholder: newField.placeholder,
    });
  } else if (newField.type === 'number') {
    field = new NumberField({
      key,
      label: newField.label,
      placeholder: newField.placeholder,
    });
  } else if (newField.type === 'checkbox') {
    field = new CheckboxField({ key, label: newField.label });
  } else if (newField.type === 'dropdown') {
    const options = newField.optionsInput.split(',').map((opt) => opt.trim());
    field = new DropdownField({ key, label: newField.label, options });
  } else {
    console.error(`Unsupported field type: ${newField.type}`);
    return;
  }

  if (newField.conditional.key && newField.conditional.value) {
    field.conditional = {
      key: newField.conditional.key,
      value: newField.conditional.value,
    };
  }

  formSchema.fields.push(field);
  formValues[key] = newField.type === 'checkbox' ? false : '';
  errors[key] = '';

  Object.assign(newField, {
    key: '',
    label: '',
    type: 'text',
    optionsInput: '',
    options: [],
    conditional: { key: '', value: '' },
    placeholder: '',
  });
  saveToLocalStorage();
};

const removeField = (key) => {
  const index = formSchema.fields.findIndex((field) => field.key === key);
  if (index !== -1) {
    formSchema.fields.splice(index, 1);
    delete formValues[key];
    delete errors[key];
  }
  saveToLocalStorage();
};

const validateField = (field) => {
  const value = formValues[field.key];
  const rules = field.validation;

  if (!rules) return;

  if (rules.required && !value) {
    errors[field.key] = `${field.label} is required.`;
    return;
  }

  if (field instanceof NumberField) {
    if (rules.min !== undefined && value < rules.min) {
      errors[field.key] = `${field.label} must be at least ${rules.min}.`;
    } else if (rules.max !== undefined && value > rules.max) {
      errors[field.key] = `${field.label} must be at most ${rules.max}.`;
    }
  }

  errors[field.key] = '';
};

const submitForm = () => {
  formSchema.fields.forEach(validateField);

  const hasErrors = Object.values(errors).some((error) => error !== '');
  if (hasErrors) {
    console.error('Form has errors:', errors);
    return;
  }
};

const clearLocalStorage = () => {
  localStorage.removeItem('formSchema');
  loadFromLocalStorage();
  window.location.reload();
};
</script>

<style scoped>
.preview-content {
  height: 700px;
  overflow: scroll;
}
.posts-section {
  padding: 20px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
