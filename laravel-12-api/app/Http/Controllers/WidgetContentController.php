<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Widget;
use App\Models\WidgetQuickResponse;
use App\Models\WidgetConversationStarter;
use App\Services\WidgetContentService;

class WidgetContentController extends Controller
{
    public function __construct(
        private WidgetContentService $contentService
    ) {}

    /**
     * Get all content for a widget.
     */
    public function index(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->contentService->getWidgetContent($widget);

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
     * Get quick responses for a widget.
     */
    public function quickResponses(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->contentService->getQuickResponses($widget);

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
     * Create a new quick response.
     */
    public function storeQuickResponse(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'text' => 'required|string|max:500',
            'category' => 'nullable|string|max:100',
            'enabled' => 'boolean',
            'sort_order' => 'nullable|integer|min:1'
        ]);

        $result = $this->contentService->createQuickResponse($widget, $request->validated());

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
     * Update a quick response.
     */
    public function updateQuickResponse(Request $request, Widget $widget, WidgetQuickResponse $quickResponse): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the quick response belongs to the widget
        if ($quickResponse->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Quick response not found for this widget'
            ], 404);
        }

        $request->validate([
            'text' => 'sometimes|required|string|max:500',
            'category' => 'nullable|string|max:100',
            'enabled' => 'boolean',
            'sort_order' => 'nullable|integer|min:1'
        ]);

        $result = $this->contentService->updateQuickResponse($quickResponse, $request->validated());

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

    /**
     * Delete a quick response.
     */
    public function destroyQuickResponse(Request $request, Widget $widget, WidgetQuickResponse $quickResponse): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the quick response belongs to the widget
        if ($quickResponse->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Quick response not found for this widget'
            ], 404);
        }

        $result = $this->contentService->deleteQuickResponse($quickResponse);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Get conversation starters for a widget.
     */
    public function conversationStarters(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->contentService->getConversationStarters($widget);

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
     * Create a new conversation starter.
     */
    public function storeConversationStarter(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'message' => 'required|string|max:500',
            'trigger_type' => 'nullable|string|in:immediate,time_delay,scroll,exit_intent',
            'delay_seconds' => 'nullable|integer|min:0|max:300',
            'page_pattern' => 'nullable|string|max:255',
            'enabled' => 'boolean',
            'sort_order' => 'nullable|integer|min:1'
        ]);

        $result = $this->contentService->createConversationStarter($widget, $request->validated());

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
     * Update a conversation starter.
     */
    public function updateConversationStarter(Request $request, Widget $widget, WidgetConversationStarter $conversationStarter): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the conversation starter belongs to the widget
        if ($conversationStarter->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation starter not found for this widget'
            ], 404);
        }

        $request->validate([
            'message' => 'sometimes|required|string|max:500',
            'trigger_type' => 'nullable|string|in:immediate,time_delay,scroll,exit_intent',
            'delay_seconds' => 'nullable|integer|min:0|max:300',
            'page_pattern' => 'nullable|string|max:255',
            'enabled' => 'boolean',
            'sort_order' => 'nullable|integer|min:1'
        ]);

        $result = $this->contentService->updateConversationStarter($conversationStarter, $request->validated());

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

    /**
     * Delete a conversation starter.
     */
    public function destroyConversationStarter(Request $request, Widget $widget, WidgetConversationStarter $conversationStarter): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the conversation starter belongs to the widget
        if ($conversationStarter->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation starter not found for this widget'
            ], 404);
        }

        $result = $this->contentService->deleteConversationStarter($conversationStarter);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }
}
