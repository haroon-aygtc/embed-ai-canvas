<?php

namespace App\Http\Requests\WidgetConfiguration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConfigurationRequest extends FormRequest
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
            // Appearance settings
            'theme' => ['required', Rule::in(['light', 'dark', 'auto'])],
            'primary_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'position' => ['required', Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])],
            'size' => ['required', Rule::in(['small', 'medium', 'large'])],

            // Content settings
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'welcome_message' => 'nullable|string|max:500',
            'placeholder' => 'required|string|max:255',

            // Basic settings
            'enabled' => 'boolean',
            'show_branding' => 'boolean',

            // AI Model
            'selected_model_id' => 'nullable|exists:ai_models,id',

            // Knowledge Base configuration
            'knowledge_base_config' => 'nullable|array',
            'knowledge_base_config.selectedKnowledgeBases' => 'nullable|array',
            'knowledge_base_config.selectedKnowledgeBases.*' => 'exists:knowledge_bases,id',
            'knowledge_base_config.settings' => 'nullable|array',
            'knowledge_base_config.settings.autoLearning' => 'boolean',
            'knowledge_base_config.settings.contextAwareness' => 'boolean',
            'knowledge_base_config.settings.realTimeUpdates' => 'boolean',
            'knowledge_base_config.settings.confidenceThreshold' => 'boolean',

            // Additional configuration
            'additional_config' => 'nullable|array',

            // Version control
            'version' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'theme.required' => 'Theme selection is required.',
            'theme.in' => 'Theme must be light, dark, or auto.',
            'primary_color.required' => 'Primary color is required.',
            'primary_color.regex' => 'Primary color must be a valid hex color (e.g., #FF0000).',
            'position.required' => 'Widget position is required.',
            'position.in' => 'Widget position must be bottom-right, bottom-left, top-right, or top-left.',
            'size.required' => 'Widget size is required.',
            'size.in' => 'Widget size must be small, medium, or large.',
            'title.required' => 'Widget title is required.',
            'title.max' => 'Widget title cannot exceed 255 characters.',
            'placeholder.required' => 'Placeholder text is required.',
            'placeholder.max' => 'Placeholder text cannot exceed 255 characters.',
            'welcome_message.max' => 'Welcome message cannot exceed 500 characters.',
            'selected_model_id.exists' => 'Selected AI model does not exist.',
        ];
    }
}
