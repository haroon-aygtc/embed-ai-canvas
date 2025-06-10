<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WidgetBehaviorService;
use App\Models\Widget;
use App\Http\Requests\Widget\WidgetBehaviorRequest;

class WidgetBehaviorController extends Controller
{
    public function __construct(
        private WidgetBehaviorService $widgetBehaviorService
    ) {}

    /**
     * Get behavior settings for a widget.
     */
    public function show(Request $request, Widget $widget)
    {
        $behavior = $this->widgetBehaviorService->getBehavior($widget->id);

        if (!$behavior) {
            $behavior = $this->widgetBehaviorService->createDefaultBehavior($widget);
        }

        return response()->json([
            'behavior' => $behavior->toBehaviorConfig(),
            'operatingHours' => $this->widgetBehaviorService->getOperatingHours($widget->id),
            'isCurrentlyOperating' => $this->widgetBehaviorService->isWidgetOperating($widget->id, $behavior->timezone ?? 'UTC'),
            'nextOperatingTime' => $this->widgetBehaviorService->getNextOperatingTime($widget->id, $behavior->timezone ?? 'UTC'),
        ]);
    }

    /**
     * Create behavior settings for a widget.
     */
    public function store(Request $request, Widget $widget)
    {
        $behavior = $this->widgetBehaviorService->createBehavior($widget, $request->all());

        return response()->json([
            'behavior' => $behavior->toBehaviorConfig(),
            'operatingHours' => $this->widgetBehaviorService->getOperatingHours($widget->id),
            'message' => 'Behavior settings created successfully'
        ], 201);
    }

    /**
     * Update behavior settings for a widget.
     */
    public function update(Request $request, Widget $widget)
    {
        $behavior = $this->widgetBehaviorService->getBehavior($widget->id);

        if (!$behavior) {
            $behavior = $this->widgetBehaviorService->createBehavior($widget, $request->all());
            $statusCode = 201;
            $message = 'Behavior settings created successfully';
        } else {
            $behavior = $this->widgetBehaviorService->updateBehavior($behavior->id, $request->all());
            $statusCode = 200;
            $message = 'Behavior settings updated successfully';
        }

        return response()->json([
            'behavior' => $behavior->toBehaviorConfig(),
            'operatingHours' => $this->widgetBehaviorService->getOperatingHours($widget->id),
            'message' => $message
        ], $statusCode);
    }

    /**
     * Get operating hours for a widget.
     */
    public function getOperatingHours(Request $request, Widget $widget)
    {
        $operatingHours = $this->widgetBehaviorService->getOperatingHours($widget->id);
        $behavior = $this->widgetBehaviorService->getBehavior($widget->id);

        return response()->json([
            'operatingHours' => $operatingHours,
            'timezone' => $behavior?->timezone ?? 'UTC',
            'enabled' => $behavior?->operating_hours_enabled ?? false,
            'isCurrentlyOperating' => $this->widgetBehaviorService->isWidgetOperating($widget->id, $behavior?->timezone ?? 'UTC'),
            'nextOperatingTime' => $this->widgetBehaviorService->getNextOperatingTime($widget->id, $behavior?->timezone ?? 'UTC'),
        ]);
    }

    /**
     * Update operating hours for a widget.
     */
    public function updateOperatingHours(Request $request, Widget $widget)
    {
        $operatingHours = $this->widgetBehaviorService->updateOperatingHours(
            $widget->id,
            $request->input('operatingHours', []),
            $request->input('timezone', 'UTC')
        );

        return response()->json([
            'operatingHours' => $operatingHours,
            'message' => 'Operating hours updated successfully'
        ]);
    }

    /**
     * Check if widget is currently operating.
     */
    public function checkOperatingStatus(Request $request, Widget $widget)
    {
        $behavior = $this->widgetBehaviorService->getBehavior($widget->id);
        $timezone = $request->input('timezone', $behavior?->timezone ?? 'UTC');

        return response()->json([
            'isOperating' => $this->widgetBehaviorService->isWidgetOperating($widget->id, $timezone),
            'nextOperatingTime' => $this->widgetBehaviorService->getNextOperatingTime($widget->id, $timezone),
            'timezone' => $timezone,
        ]);
    }

    /**
     * Delete behavior settings for a widget.
     */
    public function destroy(Widget $widget)
    {
        $deleted = $this->widgetBehaviorService->deleteBehavior($widget->id);

        if ($deleted) {
            return response()->json(['message' => 'Behavior settings deleted successfully']);
        }

        return response()->json(['message' => 'No behavior settings found to delete'], 404);
    }
}
