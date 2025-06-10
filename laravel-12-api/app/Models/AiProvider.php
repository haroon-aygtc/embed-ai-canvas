<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'provider_name',
        'api_key',
        'base_url',
        'region',
        'status',
        'last_tested_at',
        'test_result',
        'model_count',
        'configuration',
    ];

    protected $casts = [
        'test_result' => 'array',
        'configuration' => 'array',
        'last_tested_at' => 'datetime',
    ];

    protected $hidden = [
        'api_key',
    ];

    /**
     * Get the user that owns the AI provider.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the AI models for the provider.
     */
    public function aiModels(): HasMany
    {
        return $this->hasMany(AiModel::class, 'provider_id');
    }

    /**
     * Get the active AI models for the provider.
     */
    public function activeModels(): HasMany
    {
        return $this->hasMany(AiModel::class, 'provider_id')->where('is_active', true);
    }

    /**
     * Get the default AI model for the provider.
     */
    public function defaultModel()
    {
        return $this->hasOne(AiModel::class, 'provider_id')->where('is_default', true);
    }

    /**
     * Scope a query to only include ready providers.
     */
    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }

    /**
     * Scope a query to only include configured providers.
     */
    public function scopeConfigured($query)
    {
        return $query->whereIn('status', ['configured', 'ready']);
    }

    /**
     * Get the provider's display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return match ($this->provider_name) {
            'openai' => 'OpenAI',
            'google' => 'Google Gemini',
            'anthropic' => 'Anthropic',
            'mistral' => 'Mistral AI',
            'meta' => 'Meta AI',
            'cohere' => 'Cohere',
            'huggingface' => 'Hugging Face',
            'perplexity' => 'Perplexity AI',
            'openrouter' => 'OpenRouter',
            'xai' => 'Grok (xAI)',
            'groq' => 'Groq',
            'codestral' => 'Codestral (Mistral)',
            default => ucfirst($this->provider_name),
        };
    }

    /**
     * Get the provider's default base URL.
     */
    public function getDefaultBaseUrlAttribute(): ?string
    {
        return match ($this->provider_name) {
            'openai' => 'https://api.openai.com/v1',
            'google' => 'https://generativelanguage.googleapis.com/v1',
            'anthropic' => 'https://api.anthropic.com',
            'mistral' => 'https://api.mistral.ai/v1',
            'meta' => 'https://api.llama-api.com',
            'cohere' => 'https://api.cohere.ai/v1',
            'huggingface' => 'https://api-inference.huggingface.co',
            'perplexity' => 'https://api.perplexity.ai',
            'openrouter' => 'https://openrouter.ai/api/v1',
            'xai' => 'https://api.x.ai/v1',
            'groq' => 'https://api.groq.com/openai/v1',
            'codestral' => 'https://codestral.mistral.ai/v1',
            default => null,
        };
    }
}
