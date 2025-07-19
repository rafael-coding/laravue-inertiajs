<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Category;
use App\Models\Priority;
use App\Models\Task;
use App\Services\TaskService;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(protected TaskService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return Inertia::render('Home', [
            'categories' => Category::all(),
            'priorities' => Priority::all(),
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->service->create($request->validated());

        return response()->json([
            'message' => 'Task created successfully!',
            'data' => $task
        ], 201);
    }

    public function getAllTasks(Request $request): JsonResponse
    {
        $search = $request->get('search');
        $tasks = $this->service->getAllTasks($search);

        return response()->json([
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks
        ], 200);
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        $task = $this->service->update($task, $request->validated()['status']);
        return response()->json([
            'message' => 'Task status updated successfully',
            'data' => $task
        ], 200);
    }

    public function getUpdates(Request $request): JsonResponse
    {
        $lastCheck = $request->get('last_check', now()->subSeconds(10)->timestamp);

        $result = $this->service->getRecentUpdates($lastCheck);

        return response()->json([
            'message' => 'Updates retrieved successfully',
            'updates' => $result['updates'],
            'timestamp' => $result['timestamp'],
            'broadcast_driver' => $result['broadcast_driver']
        ], 200);
    }
}
