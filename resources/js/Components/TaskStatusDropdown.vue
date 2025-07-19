<template>
  <div class="relative">
    <select
      :value="currentStatus"
      @change="handleStatusChange"
      :disabled="isUpdating"
      :class="[
        'px-3 py-1 text-sm rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200',
        getStatusClass(currentStatus),
        isUpdating ? 'opacity-50 cursor-not-allowed' : '',
        hasError ? 'ring-2 ring-red-500' : ''
      ]"
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>

    <!-- Loading indicator -->
    <div v-if="isUpdating" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Success indicator -->
    <div v-if="showSuccess" class="absolute -top-1 -right-1">
      <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
    </div>

    <!-- Error indicator -->
    <div v-if="hasError" class="absolute -top-1 -right-1">
      <div class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '../Store/taskStore'
import type { TaskStatus } from '../Types'

interface Props {
  taskId: number
  status: TaskStatus
}

const props = defineProps<Props>()
const taskStore = useTaskStore()

const currentStatus = ref<TaskStatus>(props.status)
const isUpdating = ref(false)
const hasError = ref(false)
const showSuccess = ref(false)
const retryCount = ref(0)
const maxRetries = 3

// Watch for external status changes (from WebSocket)
watch(() => props.status, (newStatus) => {
  if (newStatus !== currentStatus.value && !isUpdating.value) {
    console.log(`📡 Status updated via WebSocket: ${currentStatus.value} → ${newStatus}`)
    currentStatus.value = newStatus
    showSuccessIndicator()
  }
})

const getStatusClass = (status: TaskStatus): string => {
  const classes: Record<TaskStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'in_progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'completed': 'bg-green-100 text-green-800 hover:bg-green-200',
    'cancelled': 'bg-red-100 text-red-800 hover:bg-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
}

const showSuccessIndicator = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}

const handleStatusChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value as TaskStatus
  const previousStatus = currentStatus.value

  if (newStatus === previousStatus) {
    return
  }

  console.log(`Manual status change: ${previousStatus} → ${newStatus}`)

  // Optimistic update
  currentStatus.value = newStatus
  isUpdating.value = true
  hasError.value = false

  try {
    await taskStore.updateTaskStatus(props.taskId, newStatus)
    retryCount.value = 0
    showSuccessIndicator()
    console.log(`Status updated successfully: ${newStatus}`)
  } catch (error) {
    console.error('Failed to update task status:', error)

    // Revert optimistic update
    currentStatus.value = previousStatus
    hasError.value = true

    // Show error briefly
    setTimeout(() => {
      hasError.value = false
    }, 3000)

    // Attempt retry with exponential backoff
    if (retryCount.value < maxRetries) {
      retryCount.value++
      const delay = 1000 * Math.pow(2, retryCount.value - 1) // 1s, 2s, 4s

      console.log(`🔄 Retrying in ${delay}ms (attempt ${retryCount.value}/${maxRetries})`)

      setTimeout(() => {
        if (currentStatus.value === previousStatus) {
          // Reset select value and try again
          target.value = newStatus
          handleStatusChange(event)
        }
      }, delay)
    }
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
/* Custom select styling */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:disabled {
  background-image: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
