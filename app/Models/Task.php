<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'status',
        'category_id',
        'priority_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];
}
