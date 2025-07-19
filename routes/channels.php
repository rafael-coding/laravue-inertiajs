<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('tasks', function () {
    return true;
});
