<?php

namespace App\Http\Requests\WidgetBehavior;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBehaviorSettingsRequest extends FormRequest
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
            // Basic Behavior
            'sound_notifications' => 'boolean',
            'typing_indicators' => 'boolean',
            'message_persistence' => 'boolean',
            'auto_minimize' => 'boolean',

            // Operating Hours
            'operating_hours_enabled' => 'boolean',
            'timezone' => 'nullable|string|timezone',
            'offline_message' => 'nullable|string|max:500',
            'collect_offline_messages' => 'boolean',

            // Rich Media
            'file_uploads_enabled' => 'boolean',
            'emoji_support' => 'boolean',
            'link_previews' => 'boolean',
            'voice_messages' => 'boolean',

            // Auto-open Triggers
            'immediate_trigger' => 'boolean',
            'time_delay_trigger' => 'boolean',
            'scroll_trigger' => 'boolean',
            'exit_intent_trigger' => 'boolean',
            'time_delay_seconds' => 'nullable|integer|min:1|max:300',
            'scroll_percentage' => 'nullable|integer|min:1|max:100',

            // Targeting
            'new_visitors_only' => 'boolean',
            'returning_visitors' => 'boolean',
            'geographic_targeting' => 'boolean',

            // Page Rules
            'page_rules' => ['nullable', Rule::in(['all', 'specific', 'exclude'])],
            'url_patterns' => 'nullable|array',
            'url_patterns.*' => 'string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'timezone.timezone' => 'Timezone must be a valid timezone.',
            'offline_message.max' => 'Offline message cannot exceed 500 characters.',
            'time_delay_seconds.min' => 'Time delay must be at least 1 second.',
            'time_delay_seconds.max' => 'Time delay cannot exceed 300 seconds (5 minutes).',
            'scroll_percentage.min' => 'Scroll percentage must be at least 1%.',
            'scroll_percentage.max' => 'Scroll percentage cannot exceed 100%.',
            'page_rules.in' => 'Page rules must be one of: all, specific, exclude.',
            'url_patterns.*.max' => 'URL pattern cannot exceed 255 characters.',
        ];
    }
}
