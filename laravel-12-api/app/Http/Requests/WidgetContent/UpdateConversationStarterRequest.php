<?php

namespace App\Http\Requests\WidgetContent;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConversationStarterRequest extends FormRequest
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
            'message' => 'sometimes|required|string|max:500',
            'trigger_type' => ['sometimes', Rule::in(['immediate', 'time_delay', 'scroll', 'exit_intent', 'page_visit'])],
            'delay_seconds' => 'required_if:trigger_type,time_delay|nullable|integer|min:1|max:300',
            'page_pattern' => 'nullable|string|max:255',
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
            'message.required' => 'Conversation starter message is required.',
            'message.max' => 'Message cannot exceed 500 characters.',
            'trigger_type.in' => 'Trigger type must be one of: immediate, time_delay, scroll, exit_intent, page_visit.',
            'delay_seconds.required_if' => 'Delay seconds is required when trigger type is time_delay.',
            'delay_seconds.min' => 'Delay must be at least 1 second.',
            'delay_seconds.max' => 'Delay cannot exceed 300 seconds (5 minutes).',
            'page_pattern.max' => 'Page pattern cannot exceed 255 characters.',
            'sort_order.integer' => 'Sort order must be a valid integer.',
            'sort_order.min' => 'Sort order must be 0 or greater.',
        ];
    }
}
