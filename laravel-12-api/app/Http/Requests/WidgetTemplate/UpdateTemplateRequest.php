<?php

namespace App\Http\Requests\WidgetTemplate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTemplateRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('widget_templates', 'name')->ignore($this->route('template'))
            ],
            'description' => 'nullable|string|max:1000',
            'category' => 'sometimes|required|string|max:100',
            'preview_image' => 'nullable|url|max:500',
            'is_popular' => 'boolean',
            'configuration_json' => 'sometimes|required|array',

            // Configuration validation (optional for updates)
            'configuration_json.theme' => 'sometimes|in:light,dark,auto',
            'configuration_json.primaryColor' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'configuration_json.position' => 'sometimes|in:bottom-right,bottom-left,top-right,top-left',
            'configuration_json.size' => 'sometimes|in:small,medium,large',
            'configuration_json.title' => 'sometimes|string|max:255',
            'configuration_json.placeholder' => 'sometimes|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Template name is required.',
            'name.unique' => 'Template name already exists.',
            'category.required' => 'Template category is required.',
            'configuration_json.required' => 'Template configuration is required.',
            'configuration_json.primaryColor.regex' => 'Primary color must be a valid hex color.',
        ];
    }
}
