<?php

namespace App\Services;

use App\Models\Task;

class TaskService
{
    public function create(array $data): Task
    {
        $task = Task::create($data);

        return $task;
    }
}
