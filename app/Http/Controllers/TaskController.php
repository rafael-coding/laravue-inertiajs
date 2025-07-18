<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Category;
use App\Models\Priority;
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
}
