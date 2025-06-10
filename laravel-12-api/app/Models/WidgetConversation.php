<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class WidgetConversation extends Model
{
    protected $fillable = [
        'widget_id',
        'session_id',
        'visitor_id',
        'started_at',
        'ended_at',
        'message_count',
        'satisfaction_rating',
        'resolved',
        'visitor_ip',
        'visitor_country',
        'referrer_url',
        'page_url',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'message_count' => 'integer',
        'satisfaction_rating' => 'integer',
        'resolved' => 'boolean',
    ];

    /**
     * Get the widget that owns this conversation.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Get the messages for this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(WidgetMessage::class, 'conversation_id');
    }

    /**
     * Scope to get only resolved conversations.
     */
    public function scopeResolved($query)
    {
        return $query->where('resolved', true);
    }

    /**
     * Scope to get only unresolved conversations.
     */
    public function scopeUnresolved($query)
    {
        return $query->where('resolved', false);
    }

    /**
     * Scope to get active conversations (not ended).
     */
    public function scopeActive($query)
    {
        return $query->whereNull('ended_at');
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('started_at', [$startDate, $endDate]);
    }

    /**
     * Start a new conversation.
     */
    public static function startConversation(int $widgetId, array $data): self
    {
        return static::create([
            'widget_id' => $widgetId,
            'session_id' => $data['session_id'],
            'visitor_id' => $data['visitor_id'] ?? null,
            'started_at' => now(),
            'visitor_ip' => $data['visitor_ip'] ?? null,
            'visitor_country' => $data['visitor_country'] ?? null,
            'referrer_url' => $data['referrer_url'] ?? null,
            'page_url' => $data['page_url'] ?? null,
            'message_count' => 0,
            'resolved' => false,
        ]);
    }

    /**
     * End this conversation.
     */
    public function endConversation(): void
    {
        $this->update([
            'ended_at' => now(),
        ]);
    }

    /**
     * Mark this conversation as resolved.
     */
    public function markResolved(): void
    {
        $this->update([
            'resolved' => true,
            'ended_at' => $this->ended_at ?? now(),
        ]);
    }

    /**
     * Set satisfaction rating for this conversation.
     */
    public function setSatisfactionRating(int $rating): void
    {
        $this->update([
            'satisfaction_rating' => max(1, min(5, $rating)),
        ]);
    }

    /**
     * Increment message count.
     */
    public function incrementMessageCount(): void
    {
        $this->increment('message_count');
    }

    /**
     * Get conversation duration in minutes.
     */
    public function getDurationInMinutes(): ?float
    {
        if (!$this->ended_at) {
            return null;
        }

        return $this->started_at->diffInMinutes($this->ended_at);
    }

    /**
     * Check if conversation is active (not ended and recent).
     */
    public function isActive(): bool
    {
        if ($this->ended_at) {
            return false;
        }

        // Consider conversation inactive after 30 minutes of no activity
        return $this->updated_at->diffInMinutes(now()) < 30;
    }

    /**
     * Get conversation statistics for a widget.
     */
    public static function getStatsForWidget(int $widgetId, int $days = 30): array
    {
        $conversations = static::where('widget_id', $widgetId)
                              ->where('started_at', '>=', Carbon::now()->subDays($days))
                              ->get();

        $totalConversations = $conversations->count();
        $resolvedConversations = $conversations->where('resolved', true)->count();
        $avgSatisfaction = $conversations->whereNotNull('satisfaction_rating')->avg('satisfaction_rating');
        $avgDuration = $conversations->whereNotNull('ended_at')->map(function ($conv) {
            return $conv->getDurationInMinutes();
        })->avg();

        return [
            'total_conversations' => $totalConversations,
            'resolved_conversations' => $resolvedConversations,
            'resolution_rate' => $totalConversations > 0 ? ($resolvedConversations / $totalConversations) * 100 : 0,
            'avg_satisfaction_rating' => $avgSatisfaction,
            'avg_duration_minutes' => $avgDuration,
            'period_days' => $days,
        ];
    }

    /**
     * Get conversation data for frontend.
     */
    public function toConversationData(): array
    {
        return [
            'id' => $this->id,
            'sessionId' => $this->session_id,
            'visitorId' => $this->visitor_id,
            'startedAt' => $this->started_at->toISOString(),
            'endedAt' => $this->ended_at?->toISOString(),
            'messageCount' => $this->message_count,
            'satisfactionRating' => $this->satisfaction_rating,
            'resolved' => $this->resolved,
            'visitorCountry' => $this->visitor_country,
            'pageUrl' => $this->page_url,
            'duration' => $this->getDurationInMinutes(),
            'isActive' => $this->isActive(),
        ];
    }
}
