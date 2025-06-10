<?php

namespace App\Http\Requests\Widget;

use Illuminate\Foundation\Http\FormRequest;

class DuplicateWidgetRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'enabled' => 'boolean',
            'copy_configuration' => 'boolean',
            'copy_behavior_settings' => 'boolean',
            'copy_content' => 'boolean',
            'copy_analytics' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'New widget name is required for duplication.',
            'name.max' => 'Widget name cannot exceed 255 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'copy_configuration' => 'copy configuration',
            'copy_behavior_settings' => 'copy behavior settings',
            'copy_content' => 'copy content',
            'copy_analytics' => 'copy analytics',
        ];
    }
}
