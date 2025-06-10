<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use App\Models\WidgetConfiguration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\WidgetConfiguration\StoreConfigurationRequest;
use App\Http\Requests\WidgetConfiguration\UpdateConfigurationRequest;
use App\Http\Requests\WidgetConfiguration\RollbackConfigurationRequest;
use App\Services\WidgetConfigurationService;

class WidgetConfigurationController extends Controller
{
    public function __construct(
        private WidgetConfigurationService $configurationService
    ) {}

    /**
     * Get all configurations for a widget.
     */
    public function index(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->getConfigurations($widget);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Get the active configuration for a widget.
     */
    public function active(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->getActiveConfiguration($widget);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Create a new configuration version.
     */
    public function store(StoreConfigurationRequest $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->createConfiguration($widget, $request->validated());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Update the active configuration.
     */
    public function update(UpdateConfigurationRequest $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->updateActiveConfiguration($widget, $request->validated());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Activate a specific configuration version.
     */
    public function activate(Request $request, Widget $widget, WidgetConfiguration $configuration): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the configuration belongs to the widget
        if ($configuration->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration not found for this widget'
            ], 404);
        }

        $result = $this->configurationService->activateConfiguration($configuration);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Rollback to a previous configuration version.
     */
    public function rollback(RollbackConfigurationRequest $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->rollbackToVersion($widget, $request->validated()['version']);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Compare two configuration versions.
     */
    public function compare(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'version1' => 'required|integer|min:1',
            'version2' => 'required|integer|min:1|different:version1',
        ]);

        $result = $this->configurationService->compareVersions(
            $widget,
            $request->input('version1'),
            $request->input('version2')
        );

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Get configuration version history.
     */
    public function history(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $result = $this->configurationService->getVersionHistory($widget);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Delete a configuration version (except active one).
     */
    public function destroy(Request $request, Widget $widget, WidgetConfiguration $configuration): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // Ensure the configuration belongs to the widget
        if ($configuration->widget_id !== $widget->id) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration not found for this widget'
            ], 404);
        }

        // Prevent deletion of active configuration
        if ($configuration->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete the active configuration'
            ], 400);
        }

        $result = $this->configurationService->deleteConfiguration($configuration);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }
}
