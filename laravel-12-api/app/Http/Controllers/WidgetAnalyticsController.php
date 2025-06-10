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

    public function store(Request $request)
    {
        $widget = Widget::find($request->widget_id);
        $analytics = $this->widgetAnalyticsService->createAnalytics($widget, $request->all());
        return response()->json($analytics, 201);
    }

    public function update(Request $request, $id)
    {
        $analytics = $this->widgetAnalyticsService->updateAnalytics($id, $request->all());
        return response()->json($analytics, 200);
    }
}
