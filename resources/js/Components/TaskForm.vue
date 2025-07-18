<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '../Store/taskStore'
import type { Category, Priority } from '../Types'

interface Props {
  categories: Category[]
  priorities: Priority[]
}

const props = defineProps<Props>()
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
</script>

<template>
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

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4 pt-4">
      <button
        type="button"
        @click="resetForm"
        :disabled="isSubmitting"
        class="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        <span>{{ isSubmitting ? 'Creating...' : 'Create Task' }}</span>
      </button>
    </div>
  </form>
</template>
