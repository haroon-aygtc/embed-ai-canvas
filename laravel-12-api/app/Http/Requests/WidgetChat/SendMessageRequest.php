<?php

namespace App\Http\Requests\WidgetChat;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
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
            'conversation_id' => 'nullable|exists:widget_conversations,id',
            'session_id' => 'nullable|string|max:255',
            'visitor_id' => 'nullable|string|max:255',
            'context' => 'nullable|array',
            'context.page_url' => 'nullable|url|max:500',
            'context.page_title' => 'nullable|string|max:255',
            'context.user_agent' => 'nullable|string|max:500',
            'context.referrer' => 'nullable|url|max:500',
            'attachments' => 'nullable|array|max:5',
            'attachments.*.type' => 'required_with:attachments|in:image,file,audio',
            'attachments.*.url' => 'required_with:attachments|url',
            'attachments.*.name' => 'required_with:attachments|string|max:255',
            'attachments.*.size' => 'nullable|integer|max:10485760', // 10MB
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Message content is required.',
            'message.max' => 'Message cannot exceed 2000 characters.',
            'conversation_id.exists' => 'Conversation does not exist.',
            'context.page_url.url' => 'Page URL must be a valid URL.',
            'context.referrer.url' => 'Referrer must be a valid URL.',
            'attachments.max' => 'Cannot attach more than 5 files.',
            'attachments.*.type.in' => 'Attachment type must be image, file, or audio.',
            'attachments.*.url.url' => 'Attachment URL must be valid.',
            'attachments.*.size.max' => 'Attachment size cannot exceed 10MB.',
        ];
    }
}
