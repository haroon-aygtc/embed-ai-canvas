<?php

namespace App\Http\Requests\WidgetTemplate;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:widget_templates,name',
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|max:100',
            'preview_image' => 'nullable|url|max:500',
            'is_popular' => 'boolean',
            'configuration_json' => 'required|array',

            // Configuration validation
            'configuration_json.theme' => 'required|in:light,dark,auto',
            'configuration_json.primaryColor' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'configuration_json.position' => 'required|in:bottom-right,bottom-left,top-right,top-left',
            'configuration_json.size' => 'required|in:small,medium,large',
            'configuration_json.title' => 'required|string|max:255',
            'configuration_json.placeholder' => 'required|string|max:255',
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
            'configuration_json.theme.required' => 'Theme is required in template configuration.',
            'configuration_json.primaryColor.required' => 'Primary color is required in template configuration.',
            'configuration_json.primaryColor.regex' => 'Primary color must be a valid hex color.',
        ];
    }
}
