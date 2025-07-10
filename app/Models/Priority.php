<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Priority extends Model
{
    protected $fillable = ['name', 'level'];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
