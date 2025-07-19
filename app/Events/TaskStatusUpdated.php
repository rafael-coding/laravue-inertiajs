<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TaskStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct(Task $task)
    {
        $this->task = $task->load(['category', 'priority']);

        Log::info("TaskStatusUpdated event created for task: {$task->id} with status: {$task->status}");
    }

    public function broadcastOn()
    {
        return new Channel('tasks');
    }

    public function broadcastAs()
    {
        return 'task.status.updated';
    }

    public function broadcastWith()
    {
        Log::info("Broadcasting task update: {$this->task->id}");

        return [
            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
                'description' => $this->task->description,
                'status' => $this->task->status,
                'due_date' => $this->task->due_date,
                'category_id' => $this->task->category_id,
                'priority_id' => $this->task->priority_id,
                'category' => $this->task->category,
                'priority' => $this->task->priority,
                'created_at' => $this->task->created_at,
                'updated_at' => $this->task->updated_at,
            ],
            'timestamp' => now()->toDateTimeString(),
        ];
    }
}
