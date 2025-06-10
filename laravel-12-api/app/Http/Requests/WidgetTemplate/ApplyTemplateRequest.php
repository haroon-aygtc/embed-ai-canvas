<?php

namespace App\Http\Requests\WidgetTemplate;

use Illuminate\Foundation\Http\FormRequest;

class ApplyTemplateRequest extends FormRequest
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
            'override_existing' => 'boolean',
            'preserve_content' => 'boolean',
            'preserve_behavior' => 'boolean',
            'create_backup' => 'boolean',
            'custom_overrides' => 'nullable|array',
            'custom_overrides.title' => 'nullable|string|max:255',
            'custom_overrides.primaryColor' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'custom_overrides.welcomeMessage' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'custom_overrides.title.max' => 'Custom title cannot exceed 255 characters.',
            'custom_overrides.primaryColor.regex' => 'Custom primary color must be a valid hex color.',
            'custom_overrides.welcomeMessage.max' => 'Custom welcome message cannot exceed 500 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'override_existing' => $this->override_existing ?? true,
            'preserve_content' => $this->preserve_content ?? true,
            'preserve_behavior' => $this->preserve_behavior ?? false,
            'create_backup' => $this->create_backup ?? true,
        ]);
    }
}
