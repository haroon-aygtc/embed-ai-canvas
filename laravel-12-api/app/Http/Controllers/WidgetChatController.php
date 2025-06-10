<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Widget;
use App\Models\WidgetConversation;
use App\Services\WidgetChatService;

class WidgetChatController extends Controller
{
    public function __construct(
        private WidgetChatService $chatService
    ) {}

    /**
     * Get conversations for a widget.
     */
    public function conversations(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $filters = $request->only(['status', 'date_from', 'date_to', 'per_page']);
        $result = $this->chatService->getConversations($widget, $filters);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Create a new conversation.
     */
    public function createConversation(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'session_id' => 'required|string|max:255',
            'visitor_id' => 'nullable|string|max:255'
        ]);

        $result = $this->chatService->createConversation($widget, $request->validated());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Get messages for a conversation.
     */
    public function messages(Request $request, Widget $widget, WidgetConversation $conversation): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the conversation belongs to the widget
        if ($conversation->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found for this widget'
            ], 404);
        }

        $filters = $request->only(['per_page']);
        $result = $this->chatService->getMessages($conversation, $filters);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(Request $request, Widget $widget, WidgetConversation $conversation): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the conversation belongs to the widget
        if ($conversation->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found for this widget'
            ], 404);
        }

        $request->validate([
            'content' => 'required|string|max:2000',
            'is_user' => 'boolean',
            'response_time' => 'nullable|integer|min:0',
            'ai_model_used' => 'nullable|string|max:255',
            'tokens_used' => 'nullable|integer|min:0'
        ]);

        $result = $this->chatService->sendMessage($conversation, $request->validated());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * End a conversation.
     */
    public function endConversation(Request $request, Widget $widget, WidgetConversation $conversation): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the conversation belongs to the widget
        if ($conversation->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found for this widget'
            ], 404);
        }

        $request->validate([
            'satisfaction_rating' => 'nullable|integer|min:1|max:5',
            'resolved' => 'boolean'
        ]);

        $result = $this->chatService->endConversation($conversation, $request->validated());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }
}
