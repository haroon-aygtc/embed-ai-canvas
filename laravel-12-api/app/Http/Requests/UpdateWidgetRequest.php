<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWidgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Basic Information
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            
            // Basic Settings
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'welcome_message' => ['sometimes', 'required', 'string', 'max:1000'],
            'placeholder' => ['sometimes', 'required', 'string', 'max:255'],
            'enabled' => ['boolean'],
            'show_branding' => ['boolean'],
            
            // Appearance Settings
            'theme' => ['sometimes', 'required', Rule::in(['light', 'dark', 'auto'])],
            'primary_color' => ['sometimes', 'required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'position' => ['sometimes', 'required', Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])],
            'size' => ['sometimes', 'required', Rule::in(['small', 'medium', 'large'])],
            
            // AI Model Configuration
            'selected_model_id' => ['nullable', 'string', 'max:255'],
            'ai_provider' => ['nullable', 'string', 'max:255'],
            
            // Behavior Settings
            'sound_notifications' => ['boolean'],
            'typing_indicators' => ['boolean'],
            'message_persistence' => ['boolean'],
            'auto_minimize' => ['boolean'],
            
            // Operating Hours
            'operating_hours_enabled' => ['boolean'],
            'timezone' => ['string', 'max:50'],
            'offline_message' => ['string', 'max:500'],
            'collect_offline_messages' => ['boolean'],
            
            // Trigger Settings
            'auto_open_enabled' => ['boolean'],
            'auto_open_trigger' => ['nullable', Rule::in(['immediate', 'time', 'scroll', 'exit'])],
            'auto_open_delay' => ['nullable', 'integer', 'min:1', 'max:300'],
            'auto_open_scroll_percent' => ['nullable', 'integer', 'min:1', 'max:100'],
            
            // Proactive Messaging
            'proactive_messaging_enabled' => ['boolean'],
            
            // Targeting Settings
            'new_visitors_only' => ['boolean'],
            'returning_visitors_behavior' => ['boolean'],
            'geographic_targeting' => ['string', 'max:50'],
            'page_targeting' => [Rule::in(['all', 'specific', 'exclude'])],
            
            // Rich Media Settings
            'file_uploads_enabled' => ['boolean'],
            'emoji_support_enabled' => ['boolean'],
            'link_previews_enabled' => ['boolean'],
            'voice_messages_enabled' => ['boolean'],
            
            // Language Settings
            'auto_detect_language' => ['boolean'],
            'primary_language' => ['string', 'max:5'],
            'real_time_translation' => ['boolean'],
            'translation_service' => ['string', 'max:50'],
            
            // Knowledge Base Settings
            'smart_responses_enabled' => ['boolean'],
            'fallback_to_human' => ['boolean'],
            'show_sources' => ['boolean'],
            'confidence_threshold_enabled' => ['boolean'],
            
            // Status
            'status' => [Rule::in(['active', 'inactive', 'draft'])],
            
            // Metadata
            'metadata' => ['nullable', 'array'],
            
            // Related Data
            'operating_hours' => ['nullable', 'array'],
            'operating_hours.*.day_of_week' => [Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])],
            'operating_hours.*.enabled' => ['boolean'],
            'operating_hours.*.start_time' => ['date_format:H:i'],
            'operating_hours.*.end_time' => ['date_format:H:i'],
            
            'quick_responses' => ['nullable', 'array'],
            'quick_responses.*.text' => ['required', 'string', 'max:500'],
            'quick_responses.*.category' => ['required', 'string', 'max:100'],
            'quick_responses.*.enabled' => ['boolean'],
            'quick_responses.*.sort_order' => ['integer', 'min:0'],
            
            'conversation_starters' => ['nullable', 'array'],
            'conversation_starters.*.message' => ['required', 'string', 'max:500'],
            'conversation_starters.*.trigger' => [Rule::in(['first_visit', 'return_visit', 'pricing_page', 'contact_page', 'checkout'])],
            'conversation_starters.*.delay_seconds' => ['integer', 'min:1', 'max:300'],
            'conversation_starters.*.enabled' => ['boolean'],
            
            'knowledge_bases' => ['nullable', 'array'],
            'knowledge_bases.*' => ['string', 'max:255'],
            
            'url_patterns' => ['nullable', 'array'],
            'url_patterns.*.pattern' => ['required', 'string', 'max:255'],
            'url_patterns.*.type' => [Rule::in(['include', 'exclude'])],
            'url_patterns.*.enabled' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Widget name is required.',
            'title.required' => 'Widget title is required.',
            'welcome_message.required' => 'Welcome message is required.',
            'placeholder.required' => 'Input placeholder is required.',
            'theme.required' => 'Theme selection is required.',
            'primary_color.required' => 'Primary color is required.',
            'primary_color.regex' => 'Primary color must be a valid hex color code.',
            'position.required' => 'Widget position is required.',
            'size.required' => 'Widget size is required.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'widget name',
            'title' => 'widget title',
            'welcome_message' => 'welcome message',
            'placeholder' => 'input placeholder',
            'primary_color' => 'primary color',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert boolean strings to actual booleans for partial updates
        $booleanFields = [
            'enabled', 'show_branding', 'sound_notifications', 'typing_indicators',
            'message_persistence', 'auto_minimize', 'operating_hours_enabled',
            'collect_offline_messages', 'auto_open_enabled', 'proactive_messaging_enabled',
            'new_visitors_only', 'returning_visitors_behavior', 'file_uploads_enabled',
            'emoji_support_enabled', 'link_previews_enabled', 'voice_messages_enabled',
            'auto_detect_language', 'real_time_translation', 'smart_responses_enabled',
            'fallback_to_human', 'show_sources', 'confidence_threshold_enabled'
        ];

        $updates = [];
        foreach ($booleanFields as $field) {
            if ($this->has($field)) {
                $updates[$field] = $this->boolean($field);
            }
        }

        if (!empty($updates)) {
            $this->merge($updates);
        }
    }
}
