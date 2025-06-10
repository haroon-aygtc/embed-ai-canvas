<?php

namespace App\Http\Requests\WidgetBehavior;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTriggersRequest extends FormRequest
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
            'immediate_trigger' => 'boolean',
            'time_delay_trigger' => 'boolean',
            'scroll_trigger' => 'boolean',
            'exit_intent_trigger' => 'boolean',
            'time_delay_seconds' => 'required_if:time_delay_trigger,true|nullable|integer|min:1|max:300',
            'scroll_percentage' => 'required_if:scroll_trigger,true|nullable|integer|min:1|max:100',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'time_delay_seconds.required_if' => 'Time delay seconds is required when time delay trigger is enabled.',
            'time_delay_seconds.min' => 'Time delay must be at least 1 second.',
            'time_delay_seconds.max' => 'Time delay cannot exceed 300 seconds (5 minutes).',
            'scroll_percentage.required_if' => 'Scroll percentage is required when scroll trigger is enabled.',
            'scroll_percentage.min' => 'Scroll percentage must be at least 1%.',
            'scroll_percentage.max' => 'Scroll percentage cannot exceed 100%.',
        ];
    }
}
