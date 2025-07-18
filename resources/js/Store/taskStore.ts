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
    try {
      loading.value = true
      // Implementar quando tiver a rota de atualização
      // await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus })

      // Atualizar localmente por enquanto
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.value[taskIndex].status = newStatus
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task status'
      console.error('Error updating task status:', err)
    } finally {
      loading.value = false
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

    // Computed properties
    hasNextPage,
    hasPreviousPage,
    totalPages
  }
})
