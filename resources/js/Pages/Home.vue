<script setup lang="ts">
import TaskForm from '../Components/TaskForm.vue';
import TaskList from '../Components/TaskList.vue';
import type { Category, Priority } from '../Types';

interface Props {
  categories: Category[];
  priorities: Priority[];
}

const props = defineProps<Props>();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Task Management</h1>
        <p class="mt-2 text-gray-600">Manage your tasks efficiently with real-time updates</p>
      </div>

      <!-- Task Creation Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
        <TaskForm
          :categories="props.categories"
          :priorities="props.priorities"
        />
      </div>

      <!-- Task List -->
      <TaskList />
    </div>
  </div>
</template>
