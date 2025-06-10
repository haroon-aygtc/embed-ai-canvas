<?php

namespace App\Http\Requests\WidgetContent;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuickResponseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'text' => 'sometimes|required|string|max:500',
            'category' => 'nullable|string|max:100',
            'enabled' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'text.required' => 'Quick response text is required.',
            'text.max' => 'Quick response text cannot exceed 500 characters.',
            'category.max' => 'Category name cannot exceed 100 characters.',
            'sort_order.integer' => 'Sort order must be a valid integer.',
            'sort_order.min' => 'Sort order must be 0 or greater.',
        ];
    }
}
