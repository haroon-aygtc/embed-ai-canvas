<?php

namespace App\Http\Requests\WidgetAnalytics;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExportAnalyticsRequest extends FormRequest
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
            'format' => ['required', Rule::in(['csv', 'xlsx', 'pdf', 'json'])],
            'start_date' => 'nullable|date|before_or_equal:end_date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period' => ['nullable', Rule::in(['today', 'yesterday', 'last_7_days', 'last_30_days', 'last_90_days', 'custom'])],
            'metrics' => 'nullable|array',
            'metrics.*' => Rule::in(['conversations', 'messages', 'response_time', 'satisfaction', 'bounce_rate']),
            'include_charts' => 'boolean',
            'include_summary' => 'boolean',
            'timezone' => 'nullable|string|timezone',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'format.required' => 'Export format is required.',
            'format.in' => 'Export format must be one of: csv, xlsx, pdf, json.',
            'start_date.date' => 'Start date must be a valid date.',
            'start_date.before_or_equal' => 'Start date must be before or equal to end date.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'period.in' => 'Period must be one of: today, yesterday, last_7_days, last_30_days, last_90_days, custom.',
            'metrics.*.in' => 'Invalid metric. Available metrics: conversations, messages, response_time, satisfaction, bounce_rate.',
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
            'format' => $this->format ?? 'csv',
            'period' => $this->period ?? 'last_7_days',
            'include_charts' => $this->include_charts ?? false,
            'include_summary' => $this->include_summary ?? true,
            'timezone' => $this->timezone ?? 'UTC',
        ]);
    }
}
