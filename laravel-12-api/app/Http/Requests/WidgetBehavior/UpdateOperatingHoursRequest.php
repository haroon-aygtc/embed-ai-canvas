<?php

namespace App\Http\Requests\WidgetBehavior;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOperatingHoursRequest extends FormRequest
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
            'operating_hours' => 'required|array|size:7',
            'operating_hours.*.day_of_week' => 'required|integer|between:0,6',
            'operating_hours.*.enabled' => 'boolean',
            'operating_hours.*.start_time' => 'required_if:operating_hours.*.enabled,true|nullable|date_format:H:i',
            'operating_hours.*.end_time' => 'required_if:operating_hours.*.enabled,true|nullable|date_format:H:i|after:operating_hours.*.start_time',
            'timezone' => 'required|string|timezone',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'operating_hours.required' => 'Operating hours configuration is required.',
            'operating_hours.size' => 'Operating hours must include all 7 days of the week.',
            'operating_hours.*.day_of_week.required' => 'Day of week is required.',
            'operating_hours.*.day_of_week.between' => 'Day of week must be between 0 (Sunday) and 6 (Saturday).',
            'operating_hours.*.start_time.required_if' => 'Start time is required when day is enabled.',
            'operating_hours.*.start_time.date_format' => 'Start time must be in HH:MM format.',
            'operating_hours.*.end_time.required_if' => 'End time is required when day is enabled.',
            'operating_hours.*.end_time.date_format' => 'End time must be in HH:MM format.',
            'operating_hours.*.end_time.after' => 'End time must be after start time.',
            'timezone.required' => 'Timezone is required.',
            'timezone.timezone' => 'Timezone must be a valid timezone.',
        ];
    }
}
