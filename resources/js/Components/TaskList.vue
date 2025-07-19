<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Search Bar -->
    <div class="p-6 border-b border-gray-200">
      <div class="relative max-w-md">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search tasks..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="debounceSearch"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button
          v-if="searchTerm"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 font-semibold">{{ error }}</p>
      <button
        @click="refetchTasks"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="p-8 text-center">
      <div class="text-gray-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      </div>
      <p class="text-gray-500 font-semibold">No tasks found</p>
      <p class="text-gray-400 mt-2">
        {{ searchTerm ? 'Try adjusting your search criteria' : 'Create your first task to get started' }}
      </p>
    </div>

    <!-- Tasks List -->
    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ task.title }}
              </h3>
              <TaskStatusDropdown
                :task-id="task.id"
                :status="task.status"
              />
            </div>

            <p class="text-gray-600 mb-3 line-clamp-2">
              {{ task.description }}
            </p>

            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ formatDate(task.due_date) }}</span>
              </div>

              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span>{{ task.category?.name }}</span>
              </div>

              <span :class="getPriorityBadgeClass(task.priority)" class="px-2 py-1 text-xs rounded-full">
                {{ task.priority?.level }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} tasks
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="!hasPreviousPage"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span class="text-sm text-gray-700">
            Page {{ pagination.current_page }} of {{ totalPages }}
          </span>

          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="!hasNextPage"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
import TaskStatusDropdown from './TaskStatusDropdown.vue'

const taskStore = useTaskStore()
const searchTerm = ref('')
let searchTimeout: number | null = null

// Computed properties from store
const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)
const error = computed(() => taskStore.error)
const pagination = computed(() => taskStore.pagination)
const hasNextPage = computed(() => taskStore.hasNextPage)
const hasPreviousPage = computed(() => taskStore.hasPreviousPage)
const totalPages = computed(() => taskStore.totalPages)

// Methods
const getPriorityBadgeClass = (priority: any) => taskStore.getPriorityBadgeClass(priority)

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    taskStore.searchTasks(searchTerm.value)
  }, 300)
}

const clearSearch = () => {
  searchTerm.value = ''
  taskStore.clearSearch()
}

const changePage = (page: number) => {
  taskStore.changePage(page)
}

const refetchTasks = () => {
  taskStore.fetchTasks()
}

// Initialize
onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
