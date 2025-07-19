<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Task status is required.',
            'status.in' => 'Invalid task status. Valid statuses are: pending, in_progress, completed, cancelled.',
        ];
    }
}
