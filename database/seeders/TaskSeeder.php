<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Category;
use App\Models\Priority;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = [
            [
                'title' => 'Implement authentication system',
                'description' => 'Create complete login and user registration system with email validation.',
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'in_progress',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'high')->first()->id,
            ],
            [
                'title' => 'Homepage design',
                'description' => 'Create wireframes and mockups for the new website homepage.',
                'due_date' => Carbon::now()->addDays(5),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Design')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Email marketing campaign',
                'description' => 'Develop email marketing campaign for product launch.',
                'due_date' => Carbon::now()->addDays(10),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Marketing')->first()->id,
                'priority_id' => Priority::where('level', 'high')->first()->id,
            ],
            [
                'title' => 'Payment module unit tests',
                'description' => 'Create unit tests to validate all payment module functionalities.',
                'due_date' => Carbon::now()->addDays(3),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Testing')->first()->id,
                'priority_id' => Priority::where('level', 'urgent')->first()->id,
            ],
            [
                'title' => 'API documentation',
                'description' => 'Create complete documentation for REST API endpoints.',
                'due_date' => Carbon::now()->addDays(14),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Documentation')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Performance optimization',
                'description' => 'Analyze and optimize database queries to improve performance.',
                'due_date' => Carbon::now()->addDays(12),
                'status' => 'in_progress',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'high')->first()->id,
            ],
            [
                'title' => 'Dashboard redesign',
                'description' => 'Redesign administrative dashboard interface with focus on UX.',
                'due_date' => Carbon::now()->addDays(20),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Design')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Setup CI/CD',
                'description' => 'Implement continuous integration pipeline and automated deployment.',
                'due_date' => Carbon::now()->addDays(8),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'high')->first()->id,
            ],
            [
                'title' => 'SEO analysis',
                'description' => 'Perform complete SEO audit and implement improvements.',
                'due_date' => Carbon::now()->addDays(15),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Marketing')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
            [
                'title' => 'Integration tests',
                'description' => 'Create integration test suite for all main functionalities.',
                'due_date' => Carbon::now()->addDays(6),
                'status' => 'in_progress',
                'category_id' => Category::where('name', 'Testing')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Implement push notifications',
                'description' => 'Add push notification system for mobile users.',
                'due_date' => Carbon::now()->addDays(18),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
            [
                'title' => 'Create user guide',
                'description' => 'Develop comprehensive application usage guide for new users.',
                'due_date' => Carbon::now()->addDays(25),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Documentation')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
            [
                'title' => 'Implement backup system',
                'description' => 'Configure automated data backup system.',
                'due_date' => Carbon::now()->addDays(4),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'urgent')->first()->id,
            ],
            [
                'title' => 'Icon design',
                'description' => 'Create custom icon set for the application.',
                'due_date' => Carbon::now()->addDays(16),
                'status' => 'completed',
                'category_id' => Category::where('name', 'Design')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
            [
                'title' => 'Social media campaign',
                'description' => 'Plan and execute social media marketing campaign.',
                'due_date' => Carbon::now()->addDays(9),
                'status' => 'in_progress',
                'category_id' => Category::where('name', 'Marketing')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Usability testing',
                'description' => 'Conduct usability testing with real users.',
                'due_date' => Carbon::now()->addDays(22),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Testing')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Implement logging system',
                'description' => 'Add detailed logging system for monitoring.',
                'due_date' => Carbon::now()->addDays(11),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'medium')->first()->id,
            ],
            [
                'title' => 'Create email templates',
                'description' => 'Develop responsive templates for transactional emails.',
                'due_date' => Carbon::now()->addDays(13),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Design')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
            [
                'title' => 'Configure monitoring',
                'description' => 'Implement performance and uptime monitoring system.',
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'cancelled',
                'category_id' => Category::where('name', 'Development')->first()->id,
                'priority_id' => Priority::where('level', 'high')->first()->id,
            ],
            [
                'title' => 'Technical manual',
                'description' => 'Create detailed technical manual for development team.',
                'due_date' => Carbon::now()->addDays(30),
                'status' => 'pending',
                'category_id' => Category::where('name', 'Documentation')->first()->id,
                'priority_id' => Priority::where('level', 'low')->first()->id,
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
