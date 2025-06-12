<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWidgetRequest;
use App\Http\Requests\UpdateWidgetRequest;
use App\Models\Widget;
use App\Services\WidgetConfigurationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class WidgetController extends Controller
{
    public function __construct(
        private WidgetConfigurationService $widgetService
    ) {}

    /**
     * Display a listing of widgets for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Widget::forUser(Auth::id())
                ->with(['operatingHours', 'quickResponses', 'conversationStarters', 'knowledgeBases', 'urlPatterns']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('enabled')) {
                $query->where('enabled', $request->boolean('enabled'));
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginate results
            $perPage = min($request->get('per_page', 15), 100);
            $widgets = $query->paginate($perPage);

            // Transform the data
            $widgets->getCollection()->transform(function ($widget) {
                return $this->widgetService->getWidgetConfiguration($widget);
            });

            return response()->json([
                'success' => true,
                'data' => $widgets,
                'message' => 'Widgets retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving widgets: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve widgets',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Store a newly created widget.
     */
    public function store(StoreWidgetRequest $request): JsonResponse
    {
        try {
            $widget = $this->widgetService->createWidget(
                $request->validated(),
                Auth::id()
            );

            $configuration = $this->widgetService->getWidgetConfiguration($widget);

            return response()->json([
                'success' => true,
                'data' => $configuration,
                'message' => 'Widget created successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating widget: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create widget',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Display the specified widget.
     */
    public function show(Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $configuration = $this->widgetService->getWidgetConfiguration($widget);

            return response()->json([
                'success' => true,
                'data' => $configuration,
                'message' => 'Widget retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving widget: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve widget',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified widget.
     */
    public function update(UpdateWidgetRequest $request, Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $updatedWidget = $this->widgetService->updateWidget(
                $widget,
                $request->validated()
            );

            $configuration = $this->widgetService->getWidgetConfiguration($updatedWidget);

            return response()->json([
                'success' => true,
                'data' => $configuration,
                'message' => 'Widget updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating widget: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update widget',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Remove the specified widget.
     */
    public function destroy(Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $widget->delete();

            return response()->json([
                'success' => true,
                'message' => 'Widget deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting widget: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete widget',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Duplicate an existing widget.
     */
    public function duplicate(Request $request, Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $request->validate([
                'name' => 'required|string|max:255'
            ]);

            $duplicatedWidget = $this->widgetService->duplicateWidget(
                $widget,
                $request->name,
                Auth::id()
            );

            $configuration = $this->widgetService->getWidgetConfiguration($duplicatedWidget);

            return response()->json([
                'success' => true,
                'data' => $configuration,
                'message' => 'Widget duplicated successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error duplicating widget: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate widget',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Toggle widget status (active/inactive).
     */
    public function toggleStatus(Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $newStatus = $widget->status === 'active' ? 'inactive' : 'active';
            $widget->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $widget->id,
                    'status' => $widget->status
                ],
                'message' => "Widget {$newStatus} successfully"
            ]);
        } catch (\Exception $e) {
            Log::error('Error toggling widget status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle widget status',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get widget embed code.
     */
    public function getEmbedCode(Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $embedCode = $this->generateEmbedCode($widget);

            return response()->json([
                'success' => true,
                'data' => [
                    'widget_id' => $widget->id,
                    'embed_code' => $embedCode,
                    'instructions' => 'Copy and paste this code into your website\'s HTML, preferably before the closing </body> tag.'
                ],
                'message' => 'Embed code generated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating embed code: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate embed code',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get widget analytics summary.
     */
    public function getAnalytics(Widget $widget): JsonResponse
    {
        try {
            // Check if user owns the widget
            if ($widget->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            // This would typically fetch from an analytics service or database
            // For now, return mock data structure
            $analytics = [
                'widget_id' => $widget->id,
                'total_conversations' => 0,
                'total_messages' => 0,
                'average_response_time' => 0,
                'satisfaction_score' => 0,
                'active_users' => 0,
                'conversion_rate' => 0,
                'last_30_days' => [
                    'conversations' => 0,
                    'messages' => 0,
                    'unique_visitors' => 0
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $analytics,
                'message' => 'Widget analytics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving widget analytics: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve widget analytics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Generate embed code for the widget.
     */
    private function generateEmbedCode(Widget $widget): string
    {
        $baseUrl = config('app.url');
        $widgetId = $widget->id;
        
        return <<<HTML
<!-- ChatWidget Pro - Widget ID: {$widgetId} -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '{$baseUrl}/js/widget.js';
    script.async = true;
    script.onload = function() {
      ChatWidget.init({
        widgetId: '{$widgetId}',
        apiUrl: '{$baseUrl}/api'
      });
    };
    document.head.appendChild(script);
  })();
</script>
<!-- End ChatWidget Pro -->
HTML;
    }
}
