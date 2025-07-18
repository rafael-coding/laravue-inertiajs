<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTaskStore } from '../Store/taskStore'
import type { Category, Priority } from '../Types'

interface Props {
  categories: Category[]
  priorities: Priority[]
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const taskStore = useTaskStore()

// Computed properties from store
const form = computed(() => taskStore.form)
const errors = computed(() => taskStore.formErrors)
const isSubmitting = computed(() => taskStore.isSubmitting)

// Methods
const handleSubmit = () => {
  taskStore.submitForm()
}

const resetForm = () => {
  taskStore.resetForm()
}

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = (e: Event) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

// Watch for successful form submission to close modal
watch(isSubmitting, (newValue, oldValue) => {
  if (oldValue && !newValue && Object.keys(errors.value).length === 0) {
    closeModal()
  }
})

// Close modal on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Add/remove event listener for Escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
  }
})
</script>

<template>
  <!-- Modal Backdrop -->
  <Transition
    name="modal"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <!-- Modal Content -->
      <Transition
        name="modal-content"
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Create New Task</h2>
            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 transition-colors disabled:opacity-50"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Title -->
                <div class="md:col-span-2">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    placeholder="Enter task title"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    ]"
                    :disabled="isSubmitting"
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-600">
                    {{ errors.title[0] }}
                  </p>
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    placeholder="Enter task description"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical',
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    ]"
                    :disabled="isSubmitting"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                    {{ errors.description[0] }}
                  </p>
                </div>

                <!-- Due Date -->
                <div>
                  <label for="due_date" class="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    id="due_date"
                    v-model="form.due_date"
                    type="date"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                      errors.due_date ? 'border-red-500' : 'border-gray-300'
                    ]"
                    :disabled="isSubmitting"
                  />
                  <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">
                    {{ errors.due_date[0] }}
                  </p>
                </div>

                <!-- Category -->
                <div>
                  <label for="category_id" class="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    v-model="form.category_id"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                      errors.category_id ? 'border-red-500' : 'border-gray-300'
                    ]"
                    :disabled="isSubmitting"
                  >
                    <option value="">Select a category</option>
                    <option
                      v-for="category in props.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                  <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">
                    {{ errors.category_id[0] }}
                  </p>
                </div>

                <!-- Priority -->
                <div>
                  <label for="priority_id" class="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    id="priority_id"
                    v-model="form.priority_id"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                      errors.priority_id ? 'border-red-500' : 'border-gray-300'
                    ]"
                    :disabled="isSubmitting"
                  >
                    <option value="">Select a priority</option>
                    <option
                      v-for="priority in props.priorities"
                      :key="priority.id"
                      :value="priority.id"
                    >
                      {{ priority.level }}
                    </option>
                  </select>
                  <p v-if="errors.priority_id" class="mt-1 text-sm text-red-600">
                    {{ errors.priority_id[0] }}
                  </p>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isSubmitting"
                  class="cursor-pointer px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="resetForm"
                  :disabled="isSubmitting"
                  class="cursor-pointer px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>{{ isSubmitting ? 'Creating...' : 'Create Task' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Additional styles for smooth transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(1rem);
}

.bg-black{
  background-color: #0000009c;
}
</style>
