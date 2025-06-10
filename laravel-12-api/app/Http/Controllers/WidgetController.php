<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WidgetController extends Controller
{
    /**
     * Get all widgets for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $widgets = $request->user()->widgets()->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $widgets->map(function ($widget) {
                    return [
                        'id' => $widget->id,
                        'name' => $widget->name,
                        'description' => $widget->description,
                        'enabled' => $widget->enabled,
                        'configuration' => $widget->getConfigurationWithDefaults(),
                        'last_updated_at' => $widget->last_updated_at,
                        'created_at' => $widget->created_at,
                        'updated_at' => $widget->updated_at,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch widgets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific widget for the authenticated user.
     */
    public function show(Request $request, Widget $widget): JsonResponse
    {
        try {
            // Ensure the widget belongs to the authenticated user
            if ($widget->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $widget->id,
                    'name' => $widget->name,
                    'description' => $widget->description,
                    'enabled' => $widget->enabled,
                    'configuration' => $widget->getConfigurationWithDefaults(),
                    'last_updated_at' => $widget->last_updated_at,
                    'created_at' => $widget->created_at,
                    'updated_at' => $widget->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new widget for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'enabled' => 'boolean',
            'configuration' => 'required|array',
            'configuration.theme' => ['required', Rule::in(['light', 'dark', 'auto'])],
            'configuration.primaryColor' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'configuration.position' => ['required', Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])],
            'configuration.size' => ['required', Rule::in(['small', 'medium', 'large'])],
            'configuration.welcomeMessage' => 'required|string|max:500',
            'configuration.placeholder' => 'required|string|max:255',
            'configuration.title' => 'required|string|max:255',
            'configuration.subtitle' => 'nullable|string|max:255',
            'configuration.showBranding' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $widget = Widget::create([
                'user_id' => $request->user()->id,
                'name' => $request->name,
                'description' => $request->description,
                'enabled' => $request->enabled ?? true,
                'configuration' => $request->configuration,
                'last_updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Widget created successfully',
                'data' => [
                    'id' => $widget->id,
                    'name' => $widget->name,
                    'description' => $widget->description,
                    'enabled' => $widget->enabled,
                    'configuration' => $widget->getConfigurationWithDefaults(),
                    'last_updated_at' => $widget->last_updated_at,
                    'created_at' => $widget->created_at,
                    'updated_at' => $widget->updated_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a widget for the authenticated user.
     */
    public function update(Request $request, Widget $widget): JsonResponse
    {
        // Ensure the widget belongs to the authenticated user
        if ($widget->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'enabled' => 'boolean',
            'configuration' => 'sometimes|required|array',
            'configuration.theme' => ['sometimes', Rule::in(['light', 'dark', 'auto'])],
            'configuration.primaryColor' => 'sometimes|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'configuration.position' => ['sometimes', Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])],
            'configuration.size' => ['sometimes', Rule::in(['small', 'medium', 'large'])],
            'configuration.welcomeMessage' => 'sometimes|string|max:500',
            'configuration.placeholder' => 'sometimes|string|max:255',
            'configuration.title' => 'sometimes|string|max:255',
            'configuration.subtitle' => 'nullable|string|max:255',
            'configuration.showBranding' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only(['name', 'description', 'enabled']);

            if ($request->has('configuration')) {
                // Merge with existing configuration to preserve unmodified fields
                $existingConfig = $widget->configuration ?? [];
                $newConfig = array_merge($existingConfig, $request->configuration);
                $updateData['configuration'] = $newConfig;
            }

            $updateData['last_updated_at'] = now();

            $widget->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Widget updated successfully',
                'data' => [
                    'id' => $widget->id,
                    'name' => $widget->name,
                    'description' => $widget->description,
                    'enabled' => $widget->enabled,
                    'configuration' => $widget->getConfigurationWithDefaults(),
                    'last_updated_at' => $widget->last_updated_at,
                    'created_at' => $widget->created_at,
                    'updated_at' => $widget->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a widget for the authenticated user.
     */
    public function destroy(Request $request, Widget $widget): JsonResponse
    {
        try {
            // Ensure the widget belongs to the authenticated user
            if ($widget->user_id !== $request->user()->id) {
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
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle widget enabled status.
     */
    public function toggleStatus(Request $request, Widget $widget): JsonResponse
    {
        try {
            // Ensure the widget belongs to the authenticated user
            if ($widget->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Widget not found or access denied'
                ], 404);
            }

            $widget->update([
                'enabled' => !$widget->enabled,
                'last_updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Widget status updated successfully',
                'data' => [
                    'id' => $widget->id,
                    'enabled' => $widget->enabled,
                    'last_updated_at' => $widget->last_updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle widget status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
