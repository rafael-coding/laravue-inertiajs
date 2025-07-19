<?php

namespace App\Services;

use App\Events\TaskStatusUpdated;
use App\Models\Task;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskService
{
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function getAllTasks(?string $search = null): LengthAwarePaginator
    {
        return Task::query()
            ->with(['category', 'priority'])
            ->when($search, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function update(Task $task, string $newStatus): Task
    {
        $oldStatus = $task->status;

        $task->update(['status' => $newStatus]);

        $task->load(['category', 'priority']);

        if ($oldStatus !== $newStatus) {
            Log::info("TaskService: Status changed from {$oldStatus} to {$newStatus} for task {$task->id}");
            broadcast(new TaskStatusUpdated($task))->toOthers();
        }

        return $task;
    }

    public function getRecentUpdates(int $lastCheck): array
    {
        $updates = [];

        try {
            $recentTasks = Task::with(['category', 'priority'])
                ->where('updated_at', '>', date('Y-m-d H:i:s', $lastCheck))
                ->get();

            foreach ($recentTasks as $task) {
                $updates[] = [
                    'channel' => 'tasks',
                    'event' => 'task.status.updated',
                    'payload' => [
                        'task' => $task->toArray(),
                        'timestamp' => $task->updated_at->toDateTimeString()
                    ],
                    'timestamp' => $task->updated_at->toDateTimeString()
                ];
            }

            Log::info("Polling: Found " . count($updates) . " updates since " . date('Y-m-d H:i:s', $lastCheck));
        } catch (\Exception $e) {
            Log::error("Error in getRecentUpdates: " . $e->getMessage());
        }

        return [
            'updates' => $updates,
            'timestamp' => now()->timestamp,
            'broadcast_driver' => config('broadcasting.default')
        ];
    }
}
