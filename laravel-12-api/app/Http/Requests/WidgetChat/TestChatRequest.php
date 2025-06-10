<?php

namespace App\Http\Requests\WidgetChat;

use Illuminate\Foundation\Http\FormRequest;

class TestChatRequest extends FormRequest
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
            'message' => 'required|string|max:2000',
            'test_mode' => 'boolean',
            'ai_model_id' => 'nullable|exists:ai_models,id',
            'context' => 'nullable|array',
            'context.page_url' => 'nullable|url|max:500',
            'context.page_title' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Test message is required.',
            'message.max' => 'Test message cannot exceed 2000 characters.',
            'ai_model_id.exists' => 'Selected AI model does not exist.',
            'context.page_url.url' => 'Page URL must be a valid URL.',
        ];
    }
}
