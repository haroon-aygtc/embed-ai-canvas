<?php

namespace App\Http\Requests\WidgetContent;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateQuickResponsesRequest extends FormRequest
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
            'action' => 'required|in:update,delete,enable,disable,reorder',
            'quick_responses' => 'required|array|min:1',
            'quick_responses.*.id' => 'required|integer|exists:widget_quick_responses,id',
            'quick_responses.*.text' => 'required_if:action,update|string|max:500',
            'quick_responses.*.category' => 'nullable|string|max:100',
            'quick_responses.*.enabled' => 'boolean',
            'quick_responses.*.sort_order' => 'required_if:action,reorder|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'action.required' => 'Bulk action is required.',
            'action.in' => 'Action must be one of: update, delete, enable, disable, reorder.',
            'quick_responses.required' => 'At least one quick response is required.',
            'quick_responses.min' => 'At least one quick response must be selected.',
            'quick_responses.*.id.required' => 'Quick response ID is required.',
            'quick_responses.*.id.exists' => 'Quick response does not exist.',
            'quick_responses.*.text.required_if' => 'Text is required when updating.',
            'quick_responses.*.text.max' => 'Text cannot exceed 500 characters.',
            'quick_responses.*.sort_order.required_if' => 'Sort order is required when reordering.',
        ];
    }
}
