<?php

namespace App\Services;

use App\Models\WidgetBehavior;
use App\Models\Widget;
use Illuminate\Support\Collection;

class WidgetBehaviorService
{
    public function createBehavior(Widget $widget, array $data): WidgetBehavior
    {
        $behavior = WidgetBehavior::create($data);
        $behavior->widget()->associate($widget);
        $behavior->save();
        return $behavior;
    }

    public function updateBehavior(WidgetBehavior $behavior, array $data): WidgetBehavior
    {
        $behavior->update($data);
        return $behavior;
    }

    public function getBehavior(Widget $widget): WidgetBehavior
    {
        return $widget->behavior()->first();
    }

    public function getBehaviorByWidgetId(int $widgetId): WidgetBehavior
    {
        return WidgetBehavior::where('widget_id', $widgetId)->first();
    }

    public function getBehaviorByWidgetIdAndDate(int $widgetId, string $date): WidgetBehavior
    {
        return WidgetBehavior::where('widget_id', $widgetId)->where('date', $date)->first();
    }

    public function getBehaviorByWidgetIdAndDateRange(int $widgetId, string $startDate, string $endDate): Collection
    {
        return WidgetBehavior::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->get();
    }

    public function getBehaviorByWidgetIdAndDateRangeAndMetric(int $widgetId, string $startDate, string $endDate, string $metric): Collection
    {
        return WidgetBehavior::where('widget_id', $widgetId)->whereBetween('date', [$startDate, $endDate])->where('metric', $metric)->get();
    }
}