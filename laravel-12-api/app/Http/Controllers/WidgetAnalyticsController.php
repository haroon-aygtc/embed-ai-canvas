<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WidgetAnalyticsService;
use App\Models\Widget;

class WidgetAnalyticsController extends Controller
{
    public function __construct(
        private WidgetAnalyticsService $widgetAnalyticsService
    ) {}

    /**
     * Get dashboard analytics for a widget.
     */
    public function index(Request $request, Widget $widget)
    {
        $days = $request->input('days', 30);
        $analytics = $this->widgetAnalyticsService->getDashboardAnalytics($widget->id, $days);

        return response()->json($analytics);
    }

    /**
     * Get conversation analytics for a widget.
     */
    public function conversations(Request $request, Widget $widget)
    {
        $days = $request->input('days', 30);
        $conversationAnalytics = $this->widgetAnalyticsService->getConversationAnalytics($widget->id, $days);

        return response()->json($conversationAnalytics);
    }

    /**
     * Get message analytics for a widget.
     */
    public function messages(Request $request, Widget $widget)
    {
        $days = $request->input('days', 30);
        $messageAnalytics = $this->widgetAnalyticsService->getMessageAnalytics($widget->id, $days);

        return response()->json($messageAnalytics);
    }

    /**
     * Create analytics record for a widget.
     */
    public function store(Request $request, Widget $widget)
    {
        $analytics = $this->widgetAnalyticsService->createAnalytics($widget, $request->all());

        return response()->json([
            'analytics' => $analytics->toAnalyticsData(),
            'message' => 'Analytics record created successfully'
        ], 201);
    }

    /**
     * Update analytics record.
     */
    public function update(Request $request, Widget $widget, $analyticsId)
    {
        $analytics = $this->widgetAnalyticsService->updateAnalytics($analyticsId, $request->all());

        return response()->json([
            'analytics' => $analytics->toAnalyticsData(),
            'message' => 'Analytics record updated successfully'
        ]);
    }

    /**
     * Record conversation started.
     */
    public function recordConversation(Request $request, Widget $widget)
    {
        $this->widgetAnalyticsService->recordConversationStarted($widget->id);

        return response()->json(['message' => 'Conversation recorded successfully']);
    }

    /**
     * Record message sent.
     */
    public function recordMessage(Request $request, Widget $widget)
    {
        $isUser = $request->input('is_user', true);
        $this->widgetAnalyticsService->recordMessageSent($widget->id, $isUser);

        return response()->json(['message' => 'Message recorded successfully']);
    }

    /**
     * Record response time.
     */
    public function recordResponseTime(Request $request, Widget $widget)
    {
        $responseTime = $request->input('response_time');
        $this->widgetAnalyticsService->recordResponseTime($widget->id, $responseTime);

        return response()->json(['message' => 'Response time recorded successfully']);
    }

    /**
     * Export analytics data.
     */
    public function export(Request $request, Widget $widget)
    {
        $days = $request->input('days', 30);
        $format = $request->input('format', 'json');

        $exportData = $this->widgetAnalyticsService->exportAnalytics($widget->id, $days, $format);

        return response()->json($exportData);
    }

    /**
     * Get analytics summary.
     */
    public function summary(Request $request, Widget $widget)
    {
        $days = $request->input('days', 30);
        $analytics = $this->widgetAnalyticsService->getDashboardAnalytics($widget->id, $days);

        return response()->json([
            'summary' => $analytics['summary'],
            'period' => $analytics['period']
        ]);
    }
}
