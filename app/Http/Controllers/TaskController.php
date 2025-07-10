<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Services\TaskService;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function __construct(protected TaskService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return Inertia::render('Home');
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->service->create($request->validated());

        $task->load(['category', 'priority']);

        return redirect()->back()->with('success', 'Task created successfully!');
    }
}
