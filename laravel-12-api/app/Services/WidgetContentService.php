<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetQuickResponse;
use App\Models\WidgetConversationStarter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class WidgetContentService
{
    /**
     * Get all content for a widget (quick responses and conversation starters).
     */
    public function getWidgetContent(Widget $widget): array
    {
        try {
            $quickResponses = $widget->quickResponses()
                ->orderBy('sort_order')
                ->get()
                ->map(function ($response) {
                    return $this->transformQuickResponseForFrontend($response);
                });

            $conversationStarters = $widget->conversationStarters()
                ->orderBy('sort_order')
                ->get()
                ->map(function ($starter) {
                    return $this->transformConversationStarterForFrontend($starter);
                });

            return [
                'success' => true,
                'data' => [
                    'quickResponses' => $quickResponses,
                    'conversationStarters' => $conversationStarters
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch widget content', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch widget content',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get quick responses for a widget.
     */
    public function getQuickResponses(Widget $widget): array
    {
        try {
            $responses = $widget->quickResponses()
                ->orderBy('sort_order')
                ->get()
                ->map(function ($response) {
                    return $this->transformQuickResponseForFrontend($response);
                });

            return [
                'success' => true,
                'data' => $responses
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch quick responses', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch quick responses',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new quick response.
     */
    public function createQuickResponse(Widget $widget, array $data): array
    {
        try {
            $response = WidgetQuickResponse::create([
                'widget_id' => $widget->id,
                'text' => $data['text'],
                'category' => $data['category'] ?? 'General',
                'enabled' => $data['enabled'] ?? true,
                'sort_order' => $data['sort_order'] ?? $this->getNextSortOrder($widget, 'quick_responses')
            ]);

            return [
                'success' => true,
                'message' => 'Quick response created successfully',
                'data' => $this->transformQuickResponseForFrontend($response)
            ];
        } catch (Exception $e) {
            Log::error('Failed to create quick response', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create quick response',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update a quick response.
     */
    public function updateQuickResponse(WidgetQuickResponse $response, array $data): array
    {
        try {
            $updateData = array_filter([
                'text' => $data['text'] ?? null,
                'category' => $data['category'] ?? null,
                'enabled' => $data['enabled'] ?? null,
                'sort_order' => $data['sort_order'] ?? null,
            ], fn($value) => $value !== null);

            $response->update($updateData);

            return [
                'success' => true,
                'message' => 'Quick response updated successfully',
                'data' => $this->transformQuickResponseForFrontend($response)
            ];
        } catch (Exception $e) {
            Log::error('Failed to update quick response', [
                'response_id' => $response->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to update quick response',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a quick response.
     */
    public function deleteQuickResponse(WidgetQuickResponse $response): array
    {
        try {
            $response->delete();

            return [
                'success' => true,
                'message' => 'Quick response deleted successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to delete quick response', [
                'response_id' => $response->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to delete quick response',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get conversation starters for a widget.
     */
    public function getConversationStarters(Widget $widget): array
    {
        try {
            $starters = $widget->conversationStarters()
                ->orderBy('sort_order')
                ->get()
                ->map(function ($starter) {
                    return $this->transformConversationStarterForFrontend($starter);
                });

            return [
                'success' => true,
                'data' => $starters
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch conversation starters', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch conversation starters',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new conversation starter.
     */
    public function createConversationStarter(Widget $widget, array $data): array
    {
        try {
            $starter = WidgetConversationStarter::create([
                'widget_id' => $widget->id,
                'message' => $data['message'],
                'trigger_type' => $data['trigger_type'] ?? 'immediate',
                'delay_seconds' => $data['delay_seconds'] ?? 0,
                'page_pattern' => $data['page_pattern'] ?? null,
                'enabled' => $data['enabled'] ?? true,
                'sort_order' => $data['sort_order'] ?? $this->getNextSortOrder($widget, 'conversation_starters')
            ]);

            return [
                'success' => true,
                'message' => 'Conversation starter created successfully',
                'data' => $this->transformConversationStarterForFrontend($starter)
            ];
        } catch (Exception $e) {
            Log::error('Failed to create conversation starter', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create conversation starter',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update a conversation starter.
     */
    public function updateConversationStarter(WidgetConversationStarter $starter, array $data): array
    {
        try {
            $updateData = array_filter([
                'message' => $data['message'] ?? null,
                'trigger_type' => $data['trigger_type'] ?? null,
                'delay_seconds' => $data['delay_seconds'] ?? null,
                'page_pattern' => $data['page_pattern'] ?? null,
                'enabled' => $data['enabled'] ?? null,
                'sort_order' => $data['sort_order'] ?? null,
            ], fn($value) => $value !== null);

            $starter->update($updateData);

            return [
                'success' => true,
                'message' => 'Conversation starter updated successfully',
                'data' => $this->transformConversationStarterForFrontend($starter)
            ];
        } catch (Exception $e) {
            Log::error('Failed to update conversation starter', [
                'starter_id' => $starter->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to update conversation starter',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a conversation starter.
     */
    public function deleteConversationStarter(WidgetConversationStarter $starter): array
    {
        try {
            $starter->delete();

            return [
                'success' => true,
                'message' => 'Conversation starter deleted successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to delete conversation starter', [
                'starter_id' => $starter->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to delete conversation starter',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get the next sort order for a content type.
     */
    private function getNextSortOrder(Widget $widget, string $type): int
    {
        if ($type === 'quick_responses') {
            return $widget->quickResponses()->max('sort_order') + 1;
        } elseif ($type === 'conversation_starters') {
            return $widget->conversationStarters()->max('sort_order') + 1;
        }

        return 1;
    }

    /**
     * Transform quick response for frontend consumption.
     */
    private function transformQuickResponseForFrontend(WidgetQuickResponse $response): array
    {
        return [
            'id' => $response->id,
            'text' => $response->text,
            'category' => $response->category,
            'enabled' => $response->enabled,
            'sort_order' => $response->sort_order,
            'created_at' => $response->created_at->toISOString(),
            'updated_at' => $response->updated_at->toISOString(),
        ];
    }

    /**
     * Transform conversation starter for frontend consumption.
     */
    private function transformConversationStarterForFrontend(WidgetConversationStarter $starter): array
    {
        return [
            'id' => $starter->id,
            'message' => $starter->message,
            'trigger_type' => $starter->trigger_type,
            'delay_seconds' => $starter->delay_seconds,
            'page_pattern' => $starter->page_pattern,
            'enabled' => $starter->enabled,
            'sort_order' => $starter->sort_order,
            'created_at' => $starter->created_at->toISOString(),
            'updated_at' => $starter->updated_at->toISOString(),
        ];
    }
}
