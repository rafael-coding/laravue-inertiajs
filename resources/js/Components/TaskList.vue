<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header com busca -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Tasks</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            type="text"
            placeholder="Search tasks..."
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          Total: {{ pagination.total }} tasks
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <p class="text-red-600 font-medium">{{ error }}</p>
      <button @click="fetchTasks()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ currentSearch ? 'No tasks found' : 'No tasks yet' }}
      </h3>
      <p class="text-gray-500">
        {{ currentSearch ? 'Try adjusting your search terms' : 'Get started by creating your first task!' }}
      </p>
      <button
        v-if="currentSearch"
        @click="clearSearch"
        class="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Clear Search
      </button>
    </div>

    <!-- Tasks List -->
    <div v-else>
      <div class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ task.title }}
              </h3>
              <p class="text-gray-600 mb-3 leading-relaxed">
                {{ task.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ task.category.name }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getPriorityBadgeClass(task.priority)"
                >
                  {{ task.priority.level }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(task.status)"
                >
                  {{ formatStatus(task.status) }}
                </span>
              </div>
            </div>
            <div class="flex-shrink-0 sm:ml-4 mt-2 sm:mt-0">
              <div class="text-sm text-gray-500 mb-2">
                Due: {{ formatDate(task.due_date) }}
              </div>
              <div class="text-xs text-gray-400">
                Created: {{ formatDate(task.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} to
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} of
          {{ pagination.total }} results
        </div>

        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <template v-for="page in getPageNumbers()" :key="page">
            <button
              v-if="page !== '...'"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === pagination.current_page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
          </template>

          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../Store/taskStore'
import { debounce } from 'lodash'

const taskStore = useTaskStore()
const searchTerm = ref('')

// Computed properties
const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)
const error = computed(() => taskStore.error)
const pagination = computed(() => taskStore.pagination)
const currentSearch = computed(() => taskStore.currentSearch)

// Debounced search
const debouncedSearch = debounce(() => {
  taskStore.searchTasks(searchTerm.value)
}, 300)

// Methods
const fetchTasks = () => {
  taskStore.fetchTasks()
}

const changePage = (page) => {
  taskStore.changePage(page)
}

const clearSearch = () => {
  searchTerm.value = ''
  taskStore.clearSearch()
}

const getPriorityBadgeClass = (priority) => {
  return taskStore.getPriorityBadgeClass(priority)
}

const getStatusBadgeClass = (status) => {
  return taskStore.getStatusBadgeClass(status)
}

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getPageNumbers = (): (number | string)[] => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  const range: (number | string)[] = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < last - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (last !== 1) {
    range.push(last)
  }

  return range
}

// Lifecycle
onMounted(() => {
  fetchTasks()
})
</script>
