<?php

use App\Events\TaskStatusUpdated;
use App\Http\Controllers\TaskController;
use App\Models\Task;
use Illuminate\Support\Facades\Route;

Route::get('/', [TaskController::class, 'index'])->name('tasks.index');

Route::prefix('api')->name('api.')->group(function () {
    Route::get('/tasks', [TaskController::class, 'getAllTasks'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');

    Route::get('/tasks/updates', [TaskController::class, 'getUpdates'])->name('tasks.updates');
});
