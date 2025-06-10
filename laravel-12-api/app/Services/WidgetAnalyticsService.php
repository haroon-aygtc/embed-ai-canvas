<?php

namespace App\Services;

use App\Models\WidgetAnalytic;
use App\Models\WidgetConversation;
use App\Models\WidgetMessage;
use App\Models\Widget;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class WidgetAnalyticsService
{
    /**
     * Get dashboard analytics for a widget.
     */
    public function getDashboardAnalytics(int $widgetId, int $days = 30): array
    {
        $summary = WidgetAnalytic::getSummaryForWidget($widgetId, $days);
        $dailyData = WidgetAnalytic::getDailyAnalytics($widgetId, $days);
        $conversationMetrics = $this->getConversationMetrics($widgetId, $days);
        $performanceMetrics = $this->getPerformanceMetrics($widgetId, $days);

        return [
            'summary' => $summary,
            'dailyAnalytics' => $dailyData->map(fn($item) => $item->toAnalyticsData()),
            'conversationMetrics' => $conversationMetrics,
            'performanceMetrics' => $performanceMetrics,
            'period' => [
                'days' => $days,
                'startDate' => Carbon::now()->subDays($days)->format('Y-m-d'),
                'endDate' => Carbon::now()->format('Y-m-d'),
            ],
        ];
    }

    /**
     * Get conversation analytics for a widget.
     */
    public function getConversationAnalytics(int $widgetId, int $days = 30): array
    {
        $startDate = Carbon::now()->subDays($days);

        $conversations = WidgetConversation::where('widget_id', $widgetId)
                                          ->where('started_at', '>=', $startDate)
                                          ->get();

        $totalConversations = $conversations->count();
        $resolvedConversations = $conversations->where('resolved', true)->count();
        $avgSatisfaction = $conversations->whereNotNull('satisfaction_rating')->avg('satisfaction_rating');
        $avgDuration = $conversations->whereNotNull('ended_at')->map(function ($conv) {
            return $conv->started_at->diffInMinutes($conv->ended_at);
        })->avg();

        return [
            'totalConversations' => $totalConversations,
            'resolvedConversations' => $resolvedConversations,
            'resolutionRate' => $totalConversations > 0 ? ($resolvedConversations / $totalConversations) * 100 : 0,
            'averageSatisfaction' => round($avgSatisfaction ?? 0, 2),
            'averageDuration' => round($avgDuration ?? 0, 2),
            'conversationsByDay' => $this->getConversationsByDay($widgetId, $days),
            'satisfactionDistribution' => $this->getSatisfactionDistribution($widgetId, $days),
        ];
    }

    /**
     * Get message analytics for a widget.
     */
    public function getMessageAnalytics(int $widgetId, int $days = 30): array
    {
        $startDate = Carbon::now()->subDays($days);

        $messages = WidgetMessage::whereHas('conversation', function ($query) use ($widgetId) {
                                     $query->where('widget_id', $widgetId);
                                 })
                                 ->where('created_at', '>=', $startDate)
                                 ->get();

        $userMessages = $messages->where('is_user', true);
        $botMessages = $messages->where('is_user', false);

        $avgResponseTime = $botMessages->whereNotNull('response_time')->avg('response_time');
        $totalTokensUsed = $botMessages->sum('tokens_used');

        return [
            'totalMessages' => $messages->count(),
            'userMessages' => $userMessages->count(),
            'botMessages' => $botMessages->count(),
            'averageResponseTime' => round($avgResponseTime ?? 0, 2),
            'totalTokensUsed' => $totalTokensUsed,
            'messagesByDay' => $this->getMessagesByDay($widgetId, $days),
            'responseTimeDistribution' => $this->getResponseTimeDistribution($widgetId, $days),
            'aiModelUsage' => $this->getAiModelUsage($widgetId, $days),
        ];
    }

    /**
     * Create or update analytics record.
     */
    public function createAnalytics(Widget $widget, array $data): WidgetAnalytic
    {
        $date = isset($data['date']) ? Carbon::parse($data['date']) : Carbon::now();

        return WidgetAnalytic::getOrCreateForDate($widget->id, $date);
    }

    /**
     * Update analytics record.
     */
    public function updateAnalytics(int $analyticsId, array $data): WidgetAnalytic
    {
        $analytics = WidgetAnalytic::findOrFail($analyticsId);
        $analytics->update($data);

        return $analytics->fresh();
    }

    /**
     * Record conversation started.
     */
    public function recordConversationStarted(int $widgetId, Carbon $date = null): void
    {
        $date = $date ?? Carbon::now();
        $analytics = WidgetAnalytic::getOrCreateForDate($widgetId, $date);
        $analytics->incrementConversationsStarted();
    }

    /**
     * Record message sent.
     */
    public function recordMessageSent(int $widgetId, bool $isUser = true, Carbon $date = null): void
    {
        $date = $date ?? Carbon::now();
        $analytics = WidgetAnalytic::getOrCreateForDate($widgetId, $date);

        if ($isUser) {
            $analytics->incrementMessagesReceived();
        } else {
            $analytics->incrementMessagesSent();
        }
    }

    /**
     * Record response time.
     */
    public function recordResponseTime(int $widgetId, float $responseTime, Carbon $date = null): void
    {
        $date = $date ?? Carbon::now();
        $analytics = WidgetAnalytic::getOrCreateForDate($widgetId, $date);
        $analytics->updateResponseTimeAverage($responseTime);
    }

    /**
     * Get conversation metrics.
     */
    private function getConversationMetrics(int $widgetId, int $days): array
    {
        $startDate = Carbon::now()->subDays($days);

        $conversations = WidgetConversation::where('widget_id', $widgetId)
                                          ->where('started_at', '>=', $startDate)
                                          ->get();

        return [
            'total' => $conversations->count(),
            'resolved' => $conversations->where('resolved', true)->count(),
            'avgSatisfaction' => round($conversations->whereNotNull('satisfaction_rating')->avg('satisfaction_rating') ?? 0, 2),
            'avgMessageCount' => round($conversations->avg('message_count') ?? 0, 2),
        ];
    }

    /**
     * Get performance metrics.
     */
    private function getPerformanceMetrics(int $widgetId, int $days): array
    {
        $analytics = WidgetAnalytic::where('widget_id', $widgetId)
                                  ->where('date', '>=', Carbon::now()->subDays($days))
                                  ->get();

        return [
            'avgResponseTime' => round($analytics->avg('response_time_avg') ?? 0, 2),
            'avgBounceRate' => round($analytics->avg('bounce_rate') ?? 0, 2),
            'avgResolutionRate' => round($analytics->avg('resolution_rate') ?? 0, 2),
            'totalUniqueVisitors' => $analytics->sum('unique_visitors'),
        ];
    }

    /**
     * Get conversations by day.
     */
    private function getConversationsByDay(int $widgetId, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days);

        return WidgetConversation::where('widget_id', $widgetId)
                                ->where('started_at', '>=', $startDate)
                                ->selectRaw('DATE(started_at) as date, COUNT(*) as count')
                                ->groupBy('date')
                                ->orderBy('date')
                                ->get();
    }

    /**
     * Get satisfaction distribution.
     */
    private function getSatisfactionDistribution(int $widgetId, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days);

        return WidgetConversation::where('widget_id', $widgetId)
                                ->where('started_at', '>=', $startDate)
                                ->whereNotNull('satisfaction_rating')
                                ->selectRaw('satisfaction_rating, COUNT(*) as count')
                                ->groupBy('satisfaction_rating')
                                ->orderBy('satisfaction_rating')
                                ->get();
    }

    /**
     * Get messages by day.
     */
    private function getMessagesByDay(int $widgetId, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days);

        return WidgetMessage::whereHas('conversation', function ($query) use ($widgetId) {
                                $query->where('widget_id', $widgetId);
                            })
                            ->where('created_at', '>=', $startDate)
                            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, is_user')
                            ->groupBy('date', 'is_user')
                            ->orderBy('date')
                            ->get();
    }

    /**
     * Get response time distribution.
     */
    private function getResponseTimeDistribution(int $widgetId, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days);

        return WidgetMessage::whereHas('conversation', function ($query) use ($widgetId) {
                                $query->where('widget_id', $widgetId);
                            })
                            ->where('created_at', '>=', $startDate)
                            ->where('is_user', false)
                            ->whereNotNull('response_time')
                            ->selectRaw('
                                CASE
                                    WHEN response_time < 1 THEN "< 1s"
                                    WHEN response_time < 3 THEN "1-3s"
                                    WHEN response_time < 5 THEN "3-5s"
                                    WHEN response_time < 10 THEN "5-10s"
                                    ELSE "> 10s"
                                END as range,
                                COUNT(*) as count
                            ')
                            ->groupBy('range')
                            ->get();
    }

    /**
     * Get AI model usage statistics.
     */
    private function getAiModelUsage(int $widgetId, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days);

        return WidgetMessage::whereHas('conversation', function ($query) use ($widgetId) {
                                $query->where('widget_id', $widgetId);
                            })
                            ->where('created_at', '>=', $startDate)
                            ->where('is_user', false)
                            ->whereNotNull('ai_model_used')
                            ->selectRaw('ai_model_used, COUNT(*) as count, SUM(tokens_used) as total_tokens')
                            ->groupBy('ai_model_used')
                            ->orderBy('count', 'desc')
                            ->get();
    }

    /**
     * Export analytics data.
     */
    public function exportAnalytics(int $widgetId, int $days = 30, string $format = 'json'): array
    {
        $analytics = $this->getDashboardAnalytics($widgetId, $days);
        $conversations = $this->getConversationAnalytics($widgetId, $days);
        $messages = $this->getMessageAnalytics($widgetId, $days);

        return [
            'widget_id' => $widgetId,
            'export_date' => Carbon::now()->toISOString(),
            'period' => $analytics['period'],
            'analytics' => $analytics,
            'conversations' => $conversations,
            'messages' => $messages,
        ];
    }
}