import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type {
  TaskForm,
  Task,
  Priority,
  Category,
  TaskStatus,
  Pagination
} from '../Types'

declare global {
  interface Window {
    Echo: any;
    Pusher: any;
  }
}

export const useTaskStore = defineStore('tasks', () => {
  // Form state
  const form = ref<TaskForm>({
    title: '',
    description: '',
    due_date: '',
    category_id: null,
    priority_id: null,
  })

  const formErrors = ref<Record<string, string[]>>({})
  const isSubmitting = ref(false)

  // Tasks list state
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  })
  const currentSearch = ref('')

  // Status update state
  const updatingTasks = ref<Set<number>>(new Set())

  // WebSocket connection state
  const isWebSocketConnected = ref(false)
  let echoChannel: any = null
  let connectionCheckInterval: any = null

  // Polling state
  const isPollingActive = ref(false)
  let pollingInterval: any = null

  // Update task in local store
  const updateTaskInStore = (updatedTask: Task) => {
    const taskIndex = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = updatedTask
      console.log('Task updated in store:', updatedTask)
    } else {
      console.log('Task not found in current page:', updatedTask.id)
    }
  }

  // Polling system
  const startPollingFallback = () => {
    if (isPollingActive.value) {
      console.log('Polling already active')
      return
    }

    console.log('Starting polling for real-time updates')
    isPollingActive.value = true

    pollingInterval = setInterval(async () => {
      try {
        const response = await axios.get('/api/tasks/updates', {
          params: { last_check: Math.floor(Date.now() / 1000) - 5 }
        })

        if (response.data && response.data.updates) {
          response.data.updates.forEach((update: any) => {
            if (update.payload && update.payload.task) {
              updateTaskInStore(update.payload.task)
            }
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds
  }

  const stopPollingFallback = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
      isPollingActive.value = false
      console.log('Polling fallback stopped')
    }
  }

  // Initialize WebSocket connection with fallback
  const initializeWebSocket = () => {
    console.log('Initializing connection...')

    // For local development, always use polling
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Local environment detected, using polling fallback')
      startPollingFallback()
      return
    }

    // For production, try WebSocket first
    if (typeof window === 'undefined' || !window.Echo) {
      console.warn('WebSocket not available, using polling fallback')
      startPollingFallback()
      return
    }

    try {
      // Clean previous connection if exists
      cleanupWebSocket()

      // Connect to channel
      echoChannel = window.Echo.channel('tasks')
      console.log('Echo channel created:', echoChannel)

      // Listen to events
      echoChannel.listen('.task.status.updated', (data: any) => {
        console.log('WebSocket event received:', data)

        if (data.task) {
          updateTaskInStore(data.task)
          // Stop polling if WebSocket works
          stopPollingFallback()
        }
      })

      // Monitor connection state
      if (window.Echo.connector && window.Echo.connector.pusher) {
        const pusher = window.Echo.connector.pusher

        pusher.connection.bind('connected', () => {
          isWebSocketConnected.value = true
          console.log('WebSocket connected successfully')
          stopPollingFallback() // Stop polling if WebSocket connects
        })

        pusher.connection.bind('disconnected', () => {
          isWebSocketConnected.value = false
          console.log('WebSocket disconnected')
          startPollingFallback() // Start polling if disconnected
        })

        pusher.connection.bind('error', (error: any) => {
          isWebSocketConnected.value = false
          console.error('WebSocket error:', error)
          startPollingFallback() // Start polling on error
        })

        pusher.connection.bind('state_change', (states: any) => {
          console.log('WebSocket state change:', states)
          isWebSocketConnected.value = states.current === 'connected'

          if (states.current !== 'connected') {
            startPollingFallback()
          } else {
            stopPollingFallback()
          }
        })
      }

      // Check connection periodically
      startConnectionCheck()

      // Fallback: if after 5 seconds it didn't connect, start polling
      setTimeout(() => {
        if (!isWebSocketConnected.value) {
          console.log('WebSocket timeout, starting polling fallback')
          startPollingFallback()
        }
      }, 5000)

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      isWebSocketConnected.value = false
      startPollingFallback()
    }
  }

  // Check connection periodically
  const startConnectionCheck = () => {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval)
    }

    connectionCheckInterval = setInterval(() => {
      if (window.Echo && window.Echo.connector && window.Echo.connector.pusher) {
        const state = window.Echo.connector.pusher.connection.state
        const wasConnected = isWebSocketConnected.value
        isWebSocketConnected.value = state === 'connected'

        // If lost connection, start polling
        if (wasConnected && !isWebSocketConnected.value) {
          startPollingFallback()
        }
        // If reconnected, stop polling
        else if (!wasConnected && isWebSocketConnected.value) {
          stopPollingFallback()
        }
      }
    }, 5000) // Check every 5 seconds
  }

  // Cleanup WebSocket connection
  const cleanupWebSocket = () => {
    console.log('Cleaning up WebSocket connection...')

    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval)
      connectionCheckInterval = null
    }

    stopPollingFallback()

    if (echoChannel) {
      try {
        window.Echo.leaveChannel('tasks')
        echoChannel = null
        console.log('WebSocket channel cleaned up')
      } catch (error) {
        console.error('Error cleaning up WebSocket:', error)
      }
    }

    isWebSocketConnected.value = false
  }

  // Form methods
  const resetForm = (): void => {
    form.value = {
      title: '',
      description: '',
      due_date: '',
      category_id: null,
      priority_id: null,
    }
    formErrors.value = {}
  }

  const validateForm = (): boolean => {
    formErrors.value = {}

    if (!form.value.title) formErrors.value.title = ['Title is required']
    if (!form.value.description) formErrors.value.description = ['Description is required']
    if (!form.value.due_date) formErrors.value.due_date = ['Due date is required']
    if (!form.value.category_id) formErrors.value.category_id = ['Category is required']
    if (!form.value.priority_id) formErrors.value.priority_id = ['Priority is required']

    return Object.keys(formErrors.value).length === 0
  }

  const submitForm = async (): Promise<void> => {
    if (!validateForm()) return

    isSubmitting.value = true
    formErrors.value = {}

    try {
      const response = await axios.post('/api/tasks', form.value)
      if (response.data && response.data.data) {
        addTask(response.data.data)
        resetForm()
        await fetchTasks(1, currentSearch.value)
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors || {}
        const normalizedErrors: Record<string, string[]> = {}

        for (const key in serverErrors) {
          const value = serverErrors[key]
          normalizedErrors[key] = Array.isArray(value) ? value : [value]
        }

        formErrors.value = normalizedErrors
      } else {
        error.value = err.response?.data?.message || 'Failed to create task'
        console.error('Error creating task:', err)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Tasks list methods
  const fetchTasks = async (page = 1, search = ''): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        page: page.toString()
      })

      if (search) {
        params.append('search', search)
      }

      const response = await axios.get(`/api/tasks?${params}`)

      if (response.data && response.data.data) {
        tasks.value = response.data.data.data
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          from: response.data.data.from || 0,
          to: response.data.data.to || 0
        }
        currentSearch.value = search
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      loading.value = false
    }
  }

  const changePage = (page: number): void => {
    if (page >= 1 && page <= pagination.value.last_page) {
      fetchTasks(page, currentSearch.value)
    }
  }

  const searchTasks = (searchTerm: string): void => {
    fetchTasks(1, searchTerm)
  }

  const clearSearch = (): void => {
    fetchTasks(1, '')
  }

  const getPriorityBadgeClass = (priority: Priority): string => {
    const classes: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800',
      'urgent': 'bg-purple-100 text-purple-800'
    }

    return classes[priority?.level?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const getStatusBadgeClass = (status: TaskStatus): string => {
    const classes: Record<TaskStatus, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }

    return classes[status] || 'bg-gray-100 text-gray-800'
  }

  const updateTaskStatus = async (taskId: number, newStatus: TaskStatus): Promise<void> => {
    console.log(`Updating task ${taskId} to status: ${newStatus}`)

    // Add to updating set
    updatingTasks.value.add(taskId)

    try {
      const response = await axios.patch(`/api/tasks/${taskId}/status`, {
        status: newStatus
      })

      console.log('Task status updated successfully:', response.data)

      // If neither WebSocket nor polling are working, update locally
      if (!isWebSocketConnected.value && !isPollingActive.value && response.data && response.data.data) {
        updateTaskInStore(response.data.data)
        console.log('Task updated locally (no real-time connection)')
      }
    } catch (err: any) {
      console.error('Failed to update task status:', err)
      throw new Error(err.response?.data?.message || 'Failed to update task status')
    } finally {
      // Remove from updating set
      updatingTasks.value.delete(taskId)
    }
  }

  const addTask = (newTask: Task): void => {
    tasks.value.unshift(newTask)
    pagination.value.total += 1
  }

  const removeTask = (taskId: number): void => {
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      pagination.value.total -= 1
    }
  }

  const isTaskUpdating = (taskId: number): boolean => {
    return updatingTasks.value.has(taskId)
  }

  // Computed properties
  const hasNextPage = computed((): boolean =>
    pagination.value.current_page < pagination.value.last_page
  )

  const hasPreviousPage = computed((): boolean =>
    pagination.value.current_page > 1
  )

  const totalPages = computed((): number =>
    pagination.value.last_page
  )

  return {
    // Form state
    form,
    formErrors,
    isSubmitting,

    // Tasks list state
    tasks,
    loading,
    error,
    pagination,
    currentSearch,

    // Status update state
    updatingTasks,

    // WebSocket state
    isWebSocketConnected,
    isPollingActive,

    // Form methods
    resetForm,
    submitForm,

    // Tasks list methods
    fetchTasks,
    changePage,
    searchTasks,
    clearSearch,
    getPriorityBadgeClass,
    getStatusBadgeClass,
    updateTaskStatus,
    addTask,
    removeTask,
    isTaskUpdating,

    // WebSocket methods
    initializeWebSocket,
    cleanupWebSocket,

    // Computed properties
    hasNextPage,
    hasPreviousPage,
    totalPages
  }
})
