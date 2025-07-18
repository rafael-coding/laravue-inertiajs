export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Priority {
  id: number
  level: string
  created_at: string
  updated_at: string
}

export interface TaskForm {
  title: string
  description: string
  due_date: string
  category_id: number | null
  priority_id: number | null
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  status: TaskStatus
  category_id: number
  priority_id: number
  category: Category
  priority: Priority
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  prev_page_url: string | null
  next_page_url: string | null
}

export interface TaskListResponse extends PaginatedResponse<Task> {}

// Task Store specific types
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface TaskStoreState {
  // Form state
  form: TaskForm
  formErrors: Record<string, string[]>
  isSubmitting: boolean

  // Tasks list state
  tasks: Task[]
  loading: boolean
  error: string | null
  pagination: Pagination
  currentSearch: string
}

export interface TaskStoreActions {
  // Form methods
  resetForm: () => void
  submitForm: () => void

  // Tasks list methods
  fetchTasks: (page?: number, search?: string) => Promise<void>
  changePage: (page: number) => void
  searchTasks: (searchTerm: string) => void
  clearSearch: () => void
  getPriorityBadgeClass: (priority: Priority) => string
  getStatusBadgeClass: (status: TaskStatus) => string
  updateTaskStatus: (taskId: number, newStatus: TaskStatus) => Promise<void>
  addTask: (newTask: Task) => void
  removeTask: (taskId: number) => void
}

export interface TaskStoreGetters {
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
}

export type TaskStore = TaskStoreState & TaskStoreActions & TaskStoreGetters
