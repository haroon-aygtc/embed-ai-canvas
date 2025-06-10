<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WidgetBehaviorService;
use App\Models\Widget;

class WidgetBehaviorController extends Controller
{
    public function __construct(
        private WidgetBehaviorService $widgetBehaviorService
    ) {}

    public function store(Request $request)
    {
        $widget = Widget::find($request->widget_id);
        $behavior = $this->widgetBehaviorService->createBehavior($widget, $request->all());
        return response()->json($behavior, 201);
    }

    public function update(Request $request, $id)
    {
        $behavior = $this->widgetBehaviorService->updateBehavior($id, $request->all());
        return response()->json($behavior, 200);
    }

    public function show(Request $request, $id)
    {
        $behavior = $this->widgetBehaviorService->getBehavior($id);
        return response()->json($behavior);
        }

    public function getOperatingHours(Request $request, $id)
    {
        $operatingHours = $this->widgetBehaviorService->getOperatingHours($id);
        return response()->json($operatingHours);
    }

}
