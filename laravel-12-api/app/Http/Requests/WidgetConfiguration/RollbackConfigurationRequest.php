<?php

namespace App\Http\Requests\WidgetConfiguration;

use Illuminate\Foundation\Http\FormRequest;

class RollbackConfigurationRequest extends FormRequest
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
            'version' => 'required|integer|min:1',
            'create_backup' => 'boolean',
            'reason' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'version.required' => 'Version number is required for rollback.',
            'version.integer' => 'Version must be a valid integer.',
            'version.min' => 'Version must be at least 1.',
            'reason.max' => 'Rollback reason cannot exceed 500 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'create_backup' => 'create backup',
        ];
    }
}
