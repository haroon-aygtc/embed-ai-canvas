<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetMessage extends Model
{
    protected $fillable = [
        'conversation_id',
        'content',
        'is_user',
        'response_time',
        'ai_model_used',
        'tokens_used',
        'metadata',
    ];

    protected $casts = [
        'is_user' => 'boolean',
        'response_time' => 'integer',
        'tokens_used' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Get the conversation that owns this message.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(WidgetConversation::class, 'conversation_id');
    }

    /**
     * Scope to get only user messages.
     */
    public function scopeUserMessages($query)
    {
        return $query->where('is_user', true);
    }

    /**
     * Scope to get only AI messages.
     */
    public function scopeAiMessages($query)
    {
        return $query->where('is_user', false);
    }

    /**
     * Scope to order by creation time.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at');
    }

    /**
     * Create a user message.
     */
    public static function createUserMessage(int $conversationId, string $content, array $metadata = []): self
    {
        $message = static::create([
            'conversation_id' => $conversationId,
            'content' => $content,
            'is_user' => true,
            'metadata' => $metadata,
        ]);

        // Update conversation message count
        $message->conversation->incrementMessageCount();

        return $message;
    }

    /**
     * Create an AI response message.
     */
    public static function createAiMessage(
        int $conversationId,
        string $content,
        int $responseTime = null,
        string $aiModel = null,
        int $tokensUsed = null,
        array $metadata = []
    ): self {
        $message = static::create([
            'conversation_id' => $conversationId,
            'content' => $content,
            'is_user' => false,
            'response_time' => $responseTime,
            'ai_model_used' => $aiModel,
            'tokens_used' => $tokensUsed,
            'metadata' => $metadata,
        ]);

        // Update conversation message count
        $message->conversation->incrementMessageCount();

        return $message;
    }

    /**
     * Get messages for a conversation.
     */
    public static function getForConversation(int $conversationId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('conversation_id', $conversationId)
                    ->ordered()
                    ->get();
    }

    /**
     * Get average response time for a widget.
     */
    public static function getAverageResponseTime(int $widgetId, int $days = 30): ?float
    {
        return static::whereHas('conversation', function ($query) use ($widgetId, $days) {
                        $query->where('widget_id', $widgetId)
                              ->where('started_at', '>=', now()->subDays($days));
                    })
                    ->where('is_user', false)
                    ->whereNotNull('response_time')
                    ->avg('response_time');
    }

    /**
     * Get total tokens used for a widget.
     */
    public static function getTotalTokensUsed(int $widgetId, int $days = 30): int
    {
        return static::whereHas('conversation', function ($query) use ($widgetId, $days) {
                        $query->where('widget_id', $widgetId)
                              ->where('started_at', '>=', now()->subDays($days));
                    })
                    ->where('is_user', false)
                    ->sum('tokens_used') ?? 0;
    }

    /**
     * Get message statistics for a widget.
     */
    public static function getStatsForWidget(int $widgetId, int $days = 30): array
    {
        $messages = static::whereHas('conversation', function ($query) use ($widgetId, $days) {
                            $query->where('widget_id', $widgetId)
                                  ->where('started_at', '>=', now()->subDays($days));
                        })
                        ->get();

        $userMessages = $messages->where('is_user', true);
        $aiMessages = $messages->where('is_user', false);

        return [
            'total_messages' => $messages->count(),
            'user_messages' => $userMessages->count(),
            'ai_messages' => $aiMessages->count(),
            'avg_response_time' => $aiMessages->whereNotNull('response_time')->avg('response_time'),
            'total_tokens_used' => $aiMessages->sum('tokens_used'),
            'period_days' => $days,
        ];
    }

    /**
     * Get message data for frontend.
     */
    public function toMessageData(): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'isUser' => $this->is_user,
            'responseTime' => $this->response_time,
            'aiModel' => $this->ai_model_used,
            'tokensUsed' => $this->tokens_used,
            'metadata' => $this->metadata ?? [],
            'createdAt' => $this->created_at->toISOString(),
        ];
    }
}
