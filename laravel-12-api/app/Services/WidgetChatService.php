<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetConversation;
use App\Models\WidgetMessage;
use Illuminate\Support\Facades\Log;
use Exception;

class WidgetChatService
{
    /**
     * Get conversations for a widget.
     */
    public function getConversations(Widget $widget, array $filters = []): array
    {
        try {
            $query = $widget->conversations()
                ->with(['messages' => function ($query) {
                    $query->latest()->limit(1);
                }])
                ->latest();

            // Apply filters
            if (isset($filters['status'])) {
                if ($filters['status'] === 'active') {
                    $query->whereNull('ended_at');
                } elseif ($filters['status'] === 'ended') {
                    $query->whereNotNull('ended_at');
                }
            }

            if (isset($filters['date_from'])) {
                $query->where('started_at', '>=', $filters['date_from']);
            }

            if (isset($filters['date_to'])) {
                $query->where('started_at', '<=', $filters['date_to']);
            }

            $conversations = $query->paginate($filters['per_page'] ?? 20);

            return [
                'success' => true,
                'data' => [
                    'conversations' => $conversations->items(),
                    'pagination' => [
                        'current_page' => $conversations->currentPage(),
                        'last_page' => $conversations->lastPage(),
                        'per_page' => $conversations->perPage(),
                        'total' => $conversations->total(),
                    ]
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch conversations', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch conversations',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new conversation.
     */
    public function createConversation(Widget $widget, array $data): array
    {
        try {
            $conversation = WidgetConversation::create([
                'widget_id' => $widget->id,
                'session_id' => $data['session_id'],
                'visitor_id' => $data['visitor_id'] ?? null,
                'started_at' => now(),
                'message_count' => 0,
            ]);

            return [
                'success' => true,
                'message' => 'Conversation created successfully',
                'data' => $this->transformConversationForFrontend($conversation)
            ];
        } catch (Exception $e) {
            Log::error('Failed to create conversation', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create conversation',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get messages for a conversation.
     */
    public function getMessages(WidgetConversation $conversation, array $filters = []): array
    {
        try {
            $query = $conversation->messages()->latest();

            $messages = $query->paginate($filters['per_page'] ?? 50);

            return [
                'success' => true,
                'data' => [
                    'messages' => $messages->items()->map(function ($message) {
                        return $this->transformMessageForFrontend($message);
                    }),
                    'pagination' => [
                        'current_page' => $messages->currentPage(),
                        'last_page' => $messages->lastPage(),
                        'per_page' => $messages->perPage(),
                        'total' => $messages->total(),
                    ]
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch messages', [
                'conversation_id' => $conversation->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch messages',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(WidgetConversation $conversation, array $data): array
    {
        try {
            $message = WidgetMessage::create([
                'conversation_id' => $conversation->id,
                'content' => $data['content'],
                'is_user' => $data['is_user'] ?? true,
                'response_time' => $data['response_time'] ?? null,
                'ai_model_used' => $data['ai_model_used'] ?? null,
                'tokens_used' => $data['tokens_used'] ?? null,
            ]);

            // Update conversation message count
            $conversation->increment('message_count');

            return [
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $this->transformMessageForFrontend($message)
            ];
        } catch (Exception $e) {
            Log::error('Failed to send message', [
                'conversation_id' => $conversation->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * End a conversation.
     */
    public function endConversation(WidgetConversation $conversation, array $data = []): array
    {
        try {
            $conversation->update([
                'ended_at' => now(),
                'satisfaction_rating' => $data['satisfaction_rating'] ?? null,
                'resolved' => $data['resolved'] ?? false,
            ]);

            return [
                'success' => true,
                'message' => 'Conversation ended successfully',
                'data' => $this->transformConversationForFrontend($conversation)
            ];
        } catch (Exception $e) {
            Log::error('Failed to end conversation', [
                'conversation_id' => $conversation->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to end conversation',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Transform conversation for frontend consumption.
     */
    private function transformConversationForFrontend(WidgetConversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'session_id' => $conversation->session_id,
            'visitor_id' => $conversation->visitor_id,
            'started_at' => $conversation->started_at->toISOString(),
            'ended_at' => $conversation->ended_at?->toISOString(),
            'message_count' => $conversation->message_count,
            'satisfaction_rating' => $conversation->satisfaction_rating,
            'resolved' => $conversation->resolved,
            'created_at' => $conversation->created_at->toISOString(),
            'updated_at' => $conversation->updated_at->toISOString(),
        ];
    }

    /**
     * Transform message for frontend consumption.
     */
    private function transformMessageForFrontend(WidgetMessage $message): array
    {
        return [
            'id' => $message->id,
            'content' => $message->content,
            'is_user' => $message->is_user,
            'response_time' => $message->response_time,
            'ai_model_used' => $message->ai_model_used,
            'tokens_used' => $message->tokens_used,
            'created_at' => $message->created_at->toISOString(),
        ];
    }
}
