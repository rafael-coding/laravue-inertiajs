<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Development'],
            ['name' => 'Design'],
            ['name' => 'Marketing'],
            ['name' => 'Testing'],
            ['name' => 'Documentation'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
