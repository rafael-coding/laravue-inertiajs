<?php

namespace Database\Seeders;

use App\Models\Priority;
use Illuminate\Database\Seeder;

class PrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $priorities = [
            ['level' => 'low'],
            ['level' => 'medium'],
            ['level' => 'high'],
            ['level' => 'urgent'],
        ];

        foreach ($priorities as $priority) {
            Priority::create($priority);
        }
    }
}
