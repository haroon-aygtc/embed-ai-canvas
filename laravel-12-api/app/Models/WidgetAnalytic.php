<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class WidgetAnalytic extends Model
{
    protected $fillable = [
        'widget_id',
        'date',
        'conversations_started',
        'messages_sent',
        'messages_received',
        'response_time_avg',
        'user_satisfaction',
        'bounce_rate',
        'unique_visitors',
        'returning_visitors',
        'resolution_rate',
    ];

    protected $casts = [
        'date' => 'date',
        'conversations_started' => 'integer',
        'messages_sent' => 'integer',
        'messages_received' => 'integer',
        'response_time_avg' => 'decimal:2',
        'user_satisfaction' => 'decimal:2',
        'bounce_rate' => 'decimal:2',
        'unique_visitors' => 'integer',
        'returning_visitors' => 'integer',
        'resolution_rate' => 'decimal:2',
    ];

    /**
     * Get the widget that owns this analytics record.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
    }

    /**
     * Scope to filter by current month.
     */
    public function scopeCurrentMonth($query)
    {
        $now = Carbon::now();
        return $query->whereBetween('date', [
            $now->startOfMonth()->format('Y-m-d'),
            $now->endOfMonth()->format('Y-m-d')
        ]);
    }

    /**
     * Scope to filter by last 30 days.
     */
    public function scopeLast30Days($query)
    {
        return $query->where('date', '>=', Carbon::now()->subDays(30)->format('Y-m-d'));
    }

    /**
     * Get or create analytics record for a specific date.
     */
    public static function getOrCreateForDate(int $widgetId, Carbon $date): self
    {
        return static::firstOrCreate(
            [
                'widget_id' => $widgetId,
                'date' => $date->format('Y-m-d'),
            ],
            [
                'conversations_started' => 0,
                'messages_sent' => 0,
                'messages_received' => 0,
                'unique_visitors' => 0,
                'returning_visitors' => 0,
            ]
        );
    }

    /**
     * Increment conversation started count.
     */
    public function incrementConversationsStarted(): void
    {
        $this->increment('conversations_started');
    }

    /**
     * Increment messages sent count.
     */
    public function incrementMessagesSent(): void
    {
        $this->increment('messages_sent');
    }

    /**
     * Increment messages received count.
     */
    public function incrementMessagesReceived(): void
    {
        $this->increment('messages_received');
    }

    /**
     * Update response time average.
     */
    public function updateResponseTimeAverage(float $responseTime): void
    {
        $currentAvg = $this->response_time_avg ?? 0;
        $messageCount = $this->messages_received;

        if ($messageCount > 0) {
            $newAvg = (($currentAvg * ($messageCount - 1)) + $responseTime) / $messageCount;
            $this->update(['response_time_avg' => $newAvg]);
        } else {
            $this->update(['response_time_avg' => $responseTime]);
        }
    }

    /**
     * Get analytics summary for a widget.
     */
    public static function getSummaryForWidget(int $widgetId, int $days = 30): array
    {
        $analytics = static::where('widget_id', $widgetId)
                          ->where('date', '>=', Carbon::now()->subDays($days)->format('Y-m-d'))
                          ->get();

        return [
            'total_conversations' => $analytics->sum('conversations_started'),
            'total_messages_sent' => $analytics->sum('messages_sent'),
            'total_messages_received' => $analytics->sum('messages_received'),
            'avg_response_time' => $analytics->avg('response_time_avg'),
            'avg_user_satisfaction' => $analytics->avg('user_satisfaction'),
            'avg_bounce_rate' => $analytics->avg('bounce_rate'),
            'total_unique_visitors' => $analytics->sum('unique_visitors'),
            'total_returning_visitors' => $analytics->sum('returning_visitors'),
            'avg_resolution_rate' => $analytics->avg('resolution_rate'),
            'period_days' => $days,
        ];
    }

    /**
     * Get daily analytics for a widget.
     */
    public static function getDailyAnalytics(int $widgetId, int $days = 30): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->where('date', '>=', Carbon::now()->subDays($days)->format('Y-m-d'))
                    ->orderBy('date')
                    ->get();
    }

    /**
     * Get analytics data for frontend.
     */
    public function toAnalyticsData(): array
    {
        return [
            'date' => $this->date->format('Y-m-d'),
            'conversationsStarted' => $this->conversations_started,
            'messagesSent' => $this->messages_sent,
            'messagesReceived' => $this->messages_received,
            'responseTimeAvg' => $this->response_time_avg,
            'userSatisfaction' => $this->user_satisfaction,
            'bounceRate' => $this->bounce_rate,
            'uniqueVisitors' => $this->unique_visitors,
            'returningVisitors' => $this->returning_visitors,
            'resolutionRate' => $this->resolution_rate,
        ];
    }
}
