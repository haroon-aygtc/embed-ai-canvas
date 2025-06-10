<?php

namespace App\Http\Requests\Widget;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWidgetRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'enabled' => 'boolean',
            'status' => ['nullable', Rule::in(['active', 'inactive', 'draft'])],
            'domain' => 'nullable|string|max:255',
            'configuration' => 'sometimes|required|array',

            // Configuration validation (all optional for updates)
            'configuration.theme' => ['sometimes', Rule::in(['light', 'dark', 'auto'])],
            'configuration.primaryColor' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'configuration.position' => ['sometimes', Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])],
            'configuration.size' => ['sometimes', Rule::in(['small', 'medium', 'large'])],
            'configuration.welcomeMessage' => 'nullable|string|max:500',
            'configuration.placeholder' => 'sometimes|string|max:255',
            'configuration.title' => 'sometimes|string|max:255',
            'configuration.subtitle' => 'nullable|string|max:255',
            'configuration.showBranding' => 'boolean',
            'configuration.selectedModelId' => 'nullable|exists:ai_models,id',

            // Knowledge Base configuration
            'configuration.knowledgeBase' => 'nullable|array',
            'configuration.knowledgeBase.selectedKnowledgeBases' => 'nullable|array',
            'configuration.knowledgeBase.selectedKnowledgeBases.*' => 'exists:knowledge_bases,id',
            'configuration.knowledgeBase.settings' => 'nullable|array',
            'configuration.knowledgeBase.settings.autoLearning' => 'boolean',
            'configuration.knowledgeBase.settings.contextAwareness' => 'boolean',
            'configuration.knowledgeBase.settings.realTimeUpdates' => 'boolean',
            'configuration.knowledgeBase.settings.confidenceThreshold' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Widget name is required.',
            'name.max' => 'Widget name cannot exceed 255 characters.',
            'configuration.required' => 'Widget configuration is required.',
            'configuration.theme.in' => 'Theme must be light, dark, or auto.',
            'configuration.primaryColor.regex' => 'Primary color must be a valid hex color (e.g., #FF0000).',
            'configuration.position.in' => 'Widget position must be bottom-right, bottom-left, top-right, or top-left.',
            'configuration.size.in' => 'Widget size must be small, medium, or large.',
            'configuration.placeholder.max' => 'Placeholder text cannot exceed 255 characters.',
            'configuration.title.max' => 'Widget title cannot exceed 255 characters.',
        ];
    }
}
