<?php

namespace App\Http\Requests\WidgetAnalytics;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FetchAnalyticsRequest extends FormRequest
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
            'start_date' => 'nullable|date|before_or_equal:end_date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period' => ['nullable', Rule::in(['today', 'yesterday', 'last_7_days', 'last_30_days', 'last_90_days', 'custom'])],
            'metrics' => 'nullable|array',
            'metrics.*' => Rule::in(['conversations', 'messages', 'response_time', 'satisfaction', 'bounce_rate']),
            'group_by' => ['nullable', Rule::in(['day', 'week', 'month'])],
            'timezone' => 'nullable|string|timezone',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'start_date.date' => 'Start date must be a valid date.',
            'start_date.before_or_equal' => 'Start date must be before or equal to end date.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'period.in' => 'Period must be one of: today, yesterday, last_7_days, last_30_days, last_90_days, custom.',
            'metrics.*.in' => 'Invalid metric. Available metrics: conversations, messages, response_time, satisfaction, bounce_rate.',
            'group_by.in' => 'Group by must be one of: day, week, month.',
            'timezone.timezone' => 'Timezone must be a valid timezone.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'period' => $this->period ?? 'last_7_days',
            'group_by' => $this->group_by ?? 'day',
            'timezone' => $this->timezone ?? 'UTC',
        ]);
    }
}
