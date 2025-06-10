<?php

namespace App\Services;

use App\Models\WidgetAnalytics;
use App\Models\Widget;
use Illuminate\Support\Collection;


class WidgetAnalyticsService
{
    public function createAnalytics(Widget $widget, array $data): WidgetAnalytics
    {
        $analytics = WidgetAnalytics::create($data);
        $analytics->widget()->associate($widget);
        $analytics->save();
        return $analytics;
    }

    public function updateAnalytics(WidgetAnalytics $analytics, array $data): WidgetAnalytics
    {
        $analytics->update($data);
        return $analytics;
    }

    public function getAnalytics(Widget $widget): WidgetAnalytics
    {
        return $widget->analytics()->first();
    }

    public function getAnalyticsByWidgetId(int $widgetId): WidgetAnalytics
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->first();
    }

    public function getAnalyticsByWidgetIdAndDate(int $widgetId, string $date): WidgetAnalytics
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->where('date', $date)->first();
    }

    public function getAnalyticsByWidgetIdAndDateRange(int $widgetId, string $startDate, string $endDate): Collection
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->get();
    }

    public function getAnalyticsByWidgetIdAndDateRangeAndMetric(int $widgetId, string $startDate, string $endDate, string $metric): Collection
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->where('metric', $metric)->get();
    }

    public function getAnalyticsByWidgetIdAndDateRangeAndMetricAndValue(int $widgetId, string $startDate, string $endDate, string $metric, string $value): Collection
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->where('metric', $metric)->where('value', $value)->get();
    }

    public function getAnalyticsByWidgetIdAndDateRangeAndMetricAndValueAndDate(int $widgetId, string $startDate, string $endDate, string $metric, string $value, string $date): Collection
    {
        return WidgetAnalytics::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->where('metric', $metric)->where('value', $value)->where('date', $date)->get();
    }
}