<?php

namespace App\Http\Controllers;

use App\Models\AiProvider;
use App\Models\AiModel;
use App\Services\AiProviderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Exception;

class AiProvidersController extends Controller
{
    protected AiProviderService $aiProviderService;

    public function __construct(AiProviderService $aiProviderService)
    {
        $this->middleware('auth:sanctum');
        $this->aiProviderService = $aiProviderService;
    }

    /**
     * Get all AI providers for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $providers = $request->user()
            ->aiProviders()
            ->with(['aiModels' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $providers->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'provider_name' => $provider->provider_name,
                    'display_name' => $provider->display_name,
                    'status' => $provider->status,
                    'base_url' => $provider->base_url ?: $provider->default_base_url,
                    'region' => $provider->region,
                    'model_count' => $provider->model_count,
                    'last_tested_at' => $provider->last_tested_at,
                    'test_result' => $provider->test_result,
                    'active_models' => $provider->aiModels->count(),
                    'created_at' => $provider->created_at,
                    'updated_at' => $provider->updated_at,
                ];
            }),
        ]);
    }

    /**
     * Create new AI provider.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'provider_name' => [
                'required',
                'string',
                Rule::in([
                    'openai', 'google', 'anthropic', 'mistral', 'meta',
                    'cohere', 'huggingface', 'perplexity', 'openrouter',
                    'xai', 'groq', 'codestral'
                ]),
                Rule::unique('ai_providers')->where(function ($query) use ($request) {
                    return $query->where('user_id', $request->user()->id);
                }),
            ],
            'api_key' => 'required|string|min:10',
            'base_url' => 'nullable|url',
            'region' => 'nullable|string|max:100',
            'configuration' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $provider = $request->user()->aiProviders()->create([
                'provider_name' => $request->provider_name,
                'api_key' => encrypt($request->api_key),
                'base_url' => $request->base_url,
                'region' => $request->region,
                'configuration' => $request->configuration,
                'status' => 'configured',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'AI provider added successfully',
                'data' => [
                    'id' => $provider->id,
                    'provider_name' => $provider->provider_name,
                    'display_name' => $provider->display_name,
                    'status' => $provider->status,
                    'base_url' => $provider->base_url ?: $provider->default_base_url,
                    'region' => $provider->region,
                    'created_at' => $provider->created_at,
                ],
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create AI provider: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update AI provider.
     */
    public function update(Request $request, AiProvider $aiProvider): JsonResponse
    {
        // Ensure user owns this provider
        if ($aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'api_key' => 'sometimes|string|min:10',
            'base_url' => 'nullable|url',
            'region' => 'nullable|string|max:100',
            'configuration' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $updateData = $request->only(['base_url', 'region', 'configuration']);

            if ($request->has('api_key')) {
                $updateData['api_key'] = encrypt($request->api_key);
                $updateData['status'] = 'configured'; // Reset status when API key changes
            }

            $aiProvider->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'AI provider updated successfully',
                'data' => [
                    'id' => $aiProvider->id,
                    'provider_name' => $aiProvider->provider_name,
                    'display_name' => $aiProvider->display_name,
                    'status' => $aiProvider->status,
                    'base_url' => $aiProvider->base_url ?: $aiProvider->default_base_url,
                    'region' => $aiProvider->region,
                    'updated_at' => $aiProvider->updated_at,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update AI provider: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete AI provider.
     */
    public function destroy(Request $request, AiProvider $aiProvider): JsonResponse
    {
        // Ensure user owns this provider
        if ($aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            $aiProvider->delete();

            return response()->json([
                'success' => true,
                'message' => 'AI provider deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete AI provider: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test AI provider connection.
     */
    public function testConnection(Request $request, AiProvider $aiProvider): JsonResponse
    {
        // Ensure user owns this provider
        if ($aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            // Decrypt API key for testing
            $aiProvider->api_key = decrypt($aiProvider->api_key);

            $result = $this->aiProviderService->testConnection($aiProvider);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch models from AI provider.
     */
    public function fetchModels(Request $request, AiProvider $aiProvider): JsonResponse
    {
        // Ensure user owns this provider
        if ($aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            // Decrypt API key for fetching models
            $aiProvider->api_key = decrypt($aiProvider->api_key);

            $models = $this->aiProviderService->fetchModels($aiProvider);

            return response()->json([
                'success' => true,
                'message' => 'Models fetched successfully',
                'data' => $models,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch models: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get models for specific provider.
     */
    public function getModels(Request $request, AiProvider $aiProvider): JsonResponse
    {
        // Ensure user owns this provider
        if ($aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $models = $aiProvider->aiModels()
            ->when($request->active, function ($query) {
                return $query->where('is_active', true);
            })
            ->when($request->saved, function ($query) {
                return $query->where('is_saved', true);
            })
            ->when($request->not_deprecated, function ($query) {
                return $query->where('is_deprecated', false);
            })
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $models->map(function ($model) {
                return [
                    'id' => $model->id,
                    'model_id' => $model->model_id,
                    'name' => $model->name,
                    'description' => $model->description,
                    'family' => $model->family,
                    'context_window' => $model->context_window,
                    'max_tokens' => $model->max_tokens,
                    'input_cost' => $model->input_cost,
                    'output_cost' => $model->output_cost,
                    'capabilities' => $model->capabilities,
                    'is_deprecated' => $model->is_deprecated,
                    'is_saved' => $model->is_saved,
                    'is_active' => $model->is_active,
                    'is_default' => $model->is_default,
                    'release_date' => $model->release_date,
                    'full_identifier' => $model->full_identifier,
                    'cost_per_1k_tokens' => $model->cost_per_1k_tokens,
                ];
            }),
        ]);
    }

    /**
     * Update model settings.
     */
    public function updateModel(Request $request, AiModel $aiModel): JsonResponse
    {
        // Ensure user owns this model through provider
        if ($aiModel->aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'is_saved' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'is_default' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // If setting as default, unset other defaults for this provider
            if ($request->is_default === true) {
                AiModel::where('provider_id', $aiModel->provider_id)
                    ->where('id', '!=', $aiModel->id)
                    ->update(['is_default' => false]);
            }

            $aiModel->update($request->only(['is_saved', 'is_active', 'is_default']));

            return response()->json([
                'success' => true,
                'message' => 'Model updated successfully',
                'data' => [
                    'id' => $aiModel->id,
                    'model_id' => $aiModel->model_id,
                    'name' => $aiModel->name,
                    'is_saved' => $aiModel->is_saved,
                    'is_active' => $aiModel->is_active,
                    'is_default' => $aiModel->is_default,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update model: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all models for authenticated user.
     */
    public function getAllModels(Request $request): JsonResponse
    {
        $models = AiModel::whereHas('aiProvider', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with('aiProvider')
        ->when($request->active, function ($query) {
            return $query->where('is_active', true);
        })
        ->when($request->saved, function ($query) {
            return $query->where('is_saved', true);
        })
        ->when($request->not_deprecated, function ($query) {
            return $query->where('is_deprecated', false);
        })
        ->orderBy('name')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $models->map(function ($model) {
                return [
                    'id' => $model->id,
                    'model_id' => $model->model_id,
                    'name' => $model->name,
                    'description' => $model->description,
                    'family' => $model->family,
                    'context_window' => $model->context_window,
                    'max_tokens' => $model->max_tokens,
                    'input_cost' => $model->input_cost,
                    'output_cost' => $model->output_cost,
                    'capabilities' => $model->capabilities,
                    'is_deprecated' => $model->is_deprecated,
                    'is_saved' => $model->is_saved,
                    'is_active' => $model->is_active,
                    'is_default' => $model->is_default,
                    'release_date' => $model->release_date,
                    'full_identifier' => $model->full_identifier,
                    'cost_per_1k_tokens' => $model->cost_per_1k_tokens,
                    'provider' => [
                        'id' => $model->aiProvider->id,
                        'name' => $model->aiProvider->provider_name,
                        'display_name' => $model->aiProvider->display_name,
                        'status' => $model->aiProvider->status,
                    ],
                ];
            }),
        ]);
    }

    /**
     * Get active models for authenticated user.
     */
    public function getActiveModels(Request $request): JsonResponse
    {
        $models = AiModel::whereHas('aiProvider', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id)
                  ->where('status', 'ready');
        })
        ->where('is_active', true)
        ->where('is_deprecated', false)
        ->with('aiProvider')
        ->orderBy('name')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $models->map(function ($model) {
                return [
                    'id' => $model->model_id,
                    'name' => $model->name,
                    'description' => $model->description,
                    'family' => $model->family,
                    'context_window' => $model->context_window,
                    'max_tokens' => $model->max_tokens,
                    'input_cost' => $model->input_cost,
                    'output_cost' => $model->output_cost,
                    'capabilities' => $model->capabilities,
                    'full_identifier' => $model->full_identifier,
                    'cost_per_1k_tokens' => $model->cost_per_1k_tokens,
                    'provider' => [
                        'id' => $model->aiProvider->id,
                        'name' => $model->aiProvider->provider_name,
                        'display_name' => $model->aiProvider->display_name,
                    ],
                ];
            }),
        ]);
    }

    /**
     * Send chat completion request.
     */
    public function chatCompletion(Request $request, AiModel $aiModel): JsonResponse
    {
        // Ensure user owns this model through provider
        if ($aiModel->aiProvider->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'messages' => 'required|array|min:1',
            'messages.*.role' => 'required|string|in:user,assistant,system',
            'messages.*.content' => 'required|string',
            'max_tokens' => 'sometimes|integer|min:1|max:4000',
            'temperature' => 'sometimes|numeric|min:0|max:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Decrypt API key for the request
            $aiModel->aiProvider->api_key = decrypt($aiModel->aiProvider->api_key);

            $startTime = microtime(true);
            $response = $this->aiProviderService->sendChatCompletion(
                $aiModel,
                $request->messages,
                $request->only(['max_tokens', 'temperature'])
            );
            $responseTime = round((microtime(true) - $startTime) * 1000);

            return response()->json([
                'success' => true,
                'data' => [
                    'response' => $response,
                    'response_time_ms' => $responseTime,
                    'model_used' => $aiModel->model_id,
                    'provider' => $aiModel->aiProvider->provider_name,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Chat completion failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
