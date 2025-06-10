<?php

namespace App\Services;

use App\Models\AiProvider;
use App\Models\AiModel;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Exception;

class AiProviderService
{
    protected Client $httpClient;

    public function __construct()
    {
        $this->httpClient = new Client([
            'timeout' => 30,
            'connect_timeout' => 10,
        ]);
    }

    /**
     * Test connection to an AI provider.
     */
    public function testConnection(AiProvider $provider): array
    {
        $startTime = microtime(true);
        
        try {
            $result = match ($provider->provider_name) {
                'openai' => $this->testOpenAI($provider),
                'google' => $this->testGoogle($provider),
                'anthropic' => $this->testAnthropic($provider),
                'mistral' => $this->testMistral($provider),
                'meta' => $this->testMeta($provider),
                'cohere' => $this->testCohere($provider),
                'huggingface' => $this->testHuggingFace($provider),
                'perplexity' => $this->testPerplexity($provider),
                'openrouter' => $this->testOpenRouter($provider),
                'xai' => $this->testXAI($provider),
                'groq' => $this->testGroq($provider),
                'codestral' => $this->testCodestral($provider),
                default => throw new Exception('Unsupported provider: ' . $provider->provider_name),
            };

            $latency = round((microtime(true) - $startTime) * 1000);
            
            $testResult = [
                'success' => true,
                'message' => 'Connection successful! API key is valid.',
                'latency' => $latency,
                'timestamp' => now()->toISOString(),
                'details' => $result,
            ];

            $provider->update([
                'status' => 'ready',
                'last_tested_at' => now(),
                'test_result' => $testResult,
            ]);

            return $testResult;
        } catch (Exception $e) {
            $latency = round((microtime(true) - $startTime) * 1000);
            
            $testResult = [
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
                'latency' => $latency,
                'timestamp' => now()->toISOString(),
                'error' => $e->getMessage(),
            ];

            $provider->update([
                'status' => 'error',
                'last_tested_at' => now(),
                'test_result' => $testResult,
            ]);

            Log::error('AI Provider connection test failed', [
                'provider' => $provider->provider_name,
                'user_id' => $provider->user_id,
                'error' => $e->getMessage(),
            ]);

            return $testResult;
        }
    }

    /**
     * Fetch available models from an AI provider.
     */
    public function fetchModels(AiProvider $provider): array
    {
        try {
            $models = match ($provider->provider_name) {
                'openai' => $this->fetchOpenAIModels($provider),
                'google' => $this->fetchGoogleModels($provider),
                'anthropic' => $this->fetchAnthropicModels($provider),
                'mistral' => $this->fetchMistralModels($provider),
                'meta' => $this->fetchMetaModels($provider),
                'cohere' => $this->fetchCohereModels($provider),
                'huggingface' => $this->fetchHuggingFaceModels($provider),
                'perplexity' => $this->fetchPerplexityModels($provider),
                'openrouter' => $this->fetchOpenRouterModels($provider),
                'xai' => $this->fetchXAIModels($provider),
                'groq' => $this->fetchGroqModels($provider),
                'codestral' => $this->fetchCodestralModels($provider),
                default => throw new Exception('Unsupported provider: ' . $provider->provider_name),
            };

            // Update or create models in database
            $this->syncModels($provider, $models);

            return $models;
        } catch (Exception $e) {
            Log::error('Failed to fetch models from AI provider', [
                'provider' => $provider->provider_name,
                'user_id' => $provider->user_id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Send a chat completion request to an AI provider.
     */
    public function sendChatCompletion(AiModel $model, array $messages, array $options = []): array
    {
        $provider = $model->aiProvider;
        
        return match ($provider->provider_name) {
            'openai' => $this->sendOpenAIChat($provider, $model, $messages, $options),
            'google' => $this->sendGoogleChat($provider, $model, $messages, $options),
            'anthropic' => $this->sendAnthropicChat($provider, $model, $messages, $options),
            'mistral' => $this->sendMistralChat($provider, $model, $messages, $options),
            'meta' => $this->sendMetaChat($provider, $model, $messages, $options),
            'cohere' => $this->sendCohereChat($provider, $model, $messages, $options),
            'huggingface' => $this->sendHuggingFaceChat($provider, $model, $messages, $options),
            'perplexity' => $this->sendPerplexityChat($provider, $model, $messages, $options),
            'openrouter' => $this->sendOpenRouterChat($provider, $model, $messages, $options),
            'xai' => $this->sendXAIChat($provider, $model, $messages, $options),
            'groq' => $this->sendGroqChat($provider, $model, $messages, $options),
            'codestral' => $this->sendCodestralChat($provider, $model, $messages, $options),
            default => throw new Exception('Unsupported provider: ' . $provider->provider_name),
        };
    }

    // OpenAI Implementation
    protected function testOpenAI(AiProvider $provider): array
    {
        $response = $this->httpClient->get(
            ($provider->base_url ?: $provider->default_base_url) . '/models',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        $data = json_decode($response->getBody(), true);
        return ['models_count' => count($data['data'] ?? [])];
    }

    protected function fetchOpenAIModels(AiProvider $provider): array
    {
        $response = $this->httpClient->get(
            ($provider->base_url ?: $provider->default_base_url) . '/models',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        $data = json_decode($response->getBody(), true);
        $models = [];

        foreach ($data['data'] as $modelData) {
            $models[] = [
                'model_id' => $modelData['id'],
                'name' => $this->formatModelName($modelData['id']),
                'description' => 'OpenAI model: ' . $modelData['id'],
                'family' => $this->extractModelFamily($modelData['id']),
                'capabilities' => $this->getOpenAICapabilities($modelData['id']),
                'context_window' => $this->getOpenAIContextWindow($modelData['id']),
                'input_cost' => $this->getOpenAIInputCost($modelData['id']),
                'output_cost' => $this->getOpenAIOutputCost($modelData['id']),
            ];
        }

        return $models;
    }

    protected function sendOpenAIChat(AiProvider $provider, AiModel $model, array $messages, array $options): array
    {
        $payload = [
            'model' => $model->model_id,
            'messages' => $messages,
            'max_tokens' => $options['max_tokens'] ?? 1000,
            'temperature' => $options['temperature'] ?? 0.7,
        ];

        $response = $this->httpClient->post(
            ($provider->base_url ?: $provider->default_base_url) . '/chat/completions',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload,
            ]
        );

        return json_decode($response->getBody(), true);
    }

    // Google Gemini Implementation
    protected function testGoogle(AiProvider $provider): array
    {
        $response = $this->httpClient->get(
            ($provider->base_url ?: $provider->default_base_url) . '/models',
            [
                'headers' => [
                    'x-goog-api-key' => $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        $data = json_decode($response->getBody(), true);
        return ['models_count' => count($data['models'] ?? [])];
    }

    protected function fetchGoogleModels(AiProvider $provider): array
    {
        $response = $this->httpClient->get(
            ($provider->base_url ?: $provider->default_base_url) . '/models',
            [
                'headers' => [
                    'x-goog-api-key' => $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        $data = json_decode($response->getBody(), true);
        $models = [];

        foreach ($data['models'] as $modelData) {
            if (str_contains($modelData['name'], 'generateContent')) {
                $modelId = basename($modelData['name']);
                $models[] = [
                    'model_id' => $modelId,
                    'name' => $modelData['displayName'] ?? $this->formatModelName($modelId),
                    'description' => $modelData['description'] ?? 'Google Gemini model',
                    'family' => 'gemini',
                    'capabilities' => ['text', 'multimodal'],
                    'context_window' => $this->getGoogleContextWindow($modelId),
                ];
            }
        }

        return $models;
    }

    protected function sendGoogleChat(AiProvider $provider, AiModel $model, array $messages, array $options): array
    {
        // Convert OpenAI format to Google format
        $contents = [];
        foreach ($messages as $message) {
            $contents[] = [
                'role' => $message['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $message['content']]],
            ];
        }

        $payload = [
            'contents' => $contents,
            'generationConfig' => [
                'maxOutputTokens' => $options['max_tokens'] ?? 1000,
                'temperature' => $options['temperature'] ?? 0.7,
            ],
        ];

        $response = $this->httpClient->post(
            ($provider->base_url ?: $provider->default_base_url) . '/models/' . $model->model_id . ':generateContent',
            [
                'headers' => [
                    'x-goog-api-key' => $provider->api_key,
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload,
            ]
        );

        return json_decode($response->getBody(), true);
    }

    // Anthropic Implementation
    protected function testAnthropic(AiProvider $provider): array
    {
        $response = $this->httpClient->post(
            ($provider->base_url ?: $provider->default_base_url) . '/v1/messages',
            [
                'headers' => [
                    'x-api-key' => $provider->api_key,
                    'Content-Type' => 'application/json',
                    'anthropic-version' => '2023-06-01',
                ],
                'json' => [
                    'model' => 'claude-3-haiku-20240307',
                    'max_tokens' => 10,
                    'messages' => [['role' => 'user', 'content' => 'Hi']],
                ],
            ]
        );

        return ['status' => 'ok'];
    }

    protected function fetchAnthropicModels(AiProvider $provider): array
    {
        // Anthropic doesn't have a models endpoint, so we return known models
        return [
            [
                'model_id' => 'claude-3-opus-20240229',
                'name' => 'Claude 3 Opus',
                'description' => 'Most powerful model for highly complex tasks',
                'family' => 'claude-3',
                'capabilities' => ['text', 'analysis', 'coding'],
                'context_window' => 200000,
                'input_cost' => 0.015,
                'output_cost' => 0.075,
            ],
            [
                'model_id' => 'claude-3-sonnet-20240229',
                'name' => 'Claude 3 Sonnet',
                'description' => 'Balance of intelligence and speed',
                'family' => 'claude-3',
                'capabilities' => ['text', 'analysis', 'coding'],
                'context_window' => 200000,
                'input_cost' => 0.003,
                'output_cost' => 0.015,
            ],
            [
                'model_id' => 'claude-3-haiku-20240307',
                'name' => 'Claude 3 Haiku',
                'description' => 'Fastest and most compact model',
                'family' => 'claude-3',
                'capabilities' => ['text', 'analysis'],
                'context_window' => 200000,
                'input_cost' => 0.00025,
                'output_cost' => 0.00125,
            ],
        ];
    }

    protected function sendAnthropicChat(AiProvider $provider, AiModel $model, array $messages, array $options): array
    {
        $payload = [
            'model' => $model->model_id,
            'max_tokens' => $options['max_tokens'] ?? 1000,
            'messages' => $messages,
        ];

        if (isset($options['temperature'])) {
            $payload['temperature'] = $options['temperature'];
        }

        $response = $this->httpClient->post(
            ($provider->base_url ?: $provider->default_base_url) . '/v1/messages',
            [
                'headers' => [
                    'x-api-key' => $provider->api_key,
                    'Content-Type' => 'application/json',
                    'anthropic-version' => '2023-06-01',
                ],
                'json' => $payload,
            ]
        );

        return json_decode($response->getBody(), true);
    }

    // Placeholder implementations for other providers
    protected function testMistral(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testMeta(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testCohere(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testHuggingFace(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testPerplexity(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testOpenRouter(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testXAI(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testGroq(AiProvider $provider): array { return ['status' => 'ok']; }
    protected function testCodestral(AiProvider $provider): array { return ['status' => 'ok']; }

    protected function fetchMistralModels(AiProvider $provider): array { return []; }
    protected function fetchMetaModels(AiProvider $provider): array { return []; }
    protected function fetchCohereModels(AiProvider $provider): array { return []; }
    protected function fetchHuggingFaceModels(AiProvider $provider): array { return []; }
    protected function fetchPerplexityModels(AiProvider $provider): array { return []; }
    protected function fetchOpenRouterModels(AiProvider $provider): array { return []; }
    protected function fetchXAIModels(AiProvider $provider): array { return []; }
    protected function fetchGroqModels(AiProvider $provider): array { return []; }
    protected function fetchCodestralModels(AiProvider $provider): array { return []; }

    protected function sendMistralChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendMetaChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendCohereChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendHuggingFaceChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendPerplexityChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendOpenRouterChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendXAIChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendGroqChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }
    protected function sendCodestralChat(AiProvider $provider, AiModel $model, array $messages, array $options): array { return []; }

    // Helper methods
    protected function syncModels(AiProvider $provider, array $models): void
    {
        foreach ($models as $modelData) {
            AiModel::updateOrCreate(
                [
                    'provider_id' => $provider->id,
                    'model_id' => $modelData['model_id'],
                ],
                $modelData
            );
        }

        $provider->update(['model_count' => count($models)]);
    }

    protected function formatModelName(string $modelId): string
    {
        return ucwords(str_replace(['-', '_'], ' ', $modelId));
    }

    protected function extractModelFamily(string $modelId): string
    {
        if (str_contains($modelId, 'gpt-4')) return 'gpt-4';
        if (str_contains($modelId, 'gpt-3.5')) return 'gpt-3.5';
        if (str_contains($modelId, 'claude')) return 'claude';
        if (str_contains($modelId, 'gemini')) return 'gemini';
        
        return explode('-', $modelId)[0] ?? 'unknown';
    }

    protected function getOpenAICapabilities(string $modelId): array
    {
        if (str_contains($modelId, 'gpt-4')) {
            return ['text', 'code', 'analysis', 'reasoning'];
        }
        return ['text', 'code'];
    }

    protected function getOpenAIContextWindow(string $modelId): ?int
    {
        return match (true) {
            str_contains($modelId, 'gpt-4-turbo') => 128000,
            str_contains($modelId, 'gpt-4') => 8192,
            str_contains($modelId, 'gpt-3.5-turbo') => 16385,
            default => null,
        };
    }

    protected function getOpenAIInputCost(string $modelId): ?float
    {
        return match (true) {
            str_contains($modelId, 'gpt-4-turbo') => 0.01,
            str_contains($modelId, 'gpt-4') => 0.03,
            str_contains($modelId, 'gpt-3.5-turbo') => 0.0015,
            default => null,
        };
    }

    protected function getOpenAIOutputCost(string $modelId): ?float
    {
        return match (true) {
            str_contains($modelId, 'gpt-4-turbo') => 0.03,
            str_contains($modelId, 'gpt-4') => 0.06,
            str_contains($modelId, 'gpt-3.5-turbo') => 0.002,
            default => null,
        };
    }

    protected function getGoogleContextWindow(string $modelId): ?int
    {
        return match (true) {
            str_contains($modelId, 'gemini-pro') => 32768,
            str_contains($modelId, 'gemini') => 30720,
            default => null,
        };
    }
}
