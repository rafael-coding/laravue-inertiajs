<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'due_date' => ['required', 'date', 'after:today'],
            'category_id' => ['required', 'exists:categories,id'],
            'priority_id' => ['required', 'exists:priorities,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required and cannot be empty.',
            'title.max' => 'Task title must not exceed 255 characters.',
            'description.required' => 'Task description is required.',
            'description.max' => 'Task description must not exceed 1000 characters.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be in the future.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category does not exist.',
            'priority_id.required' => 'Please select a priority level.',
            'priority_id.exists' => 'Selected priority does not exist.',
        ];
    }
}
