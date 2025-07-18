<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from '../Components/TaskForm.vue'
import TaskList from '../Components/TaskList.vue'
import type { Category, Priority } from '../Types'

interface Props {
  categories: Category[]
  priorities: Priority[]
}

const props = defineProps<Props>()

// Modal state
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with Create Task Button -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Task Management</h1>
          <p class="mt-2 text-gray-600">Manage your tasks efficiently with real-time updates</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            @click="openModal"
            class="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Task
          </button>
        </div>
      </div>

      <!-- Task List -->
      <TaskList />

      <!-- Task Form Modal -->
      <TaskForm
        :categories="props.categories"
        :priorities="props.priorities"
        :is-open="isModalOpen"
        @close="closeModal"
      />
    </div>
  </div>
</template>
