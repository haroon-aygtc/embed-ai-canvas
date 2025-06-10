<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'model_id',
        'name',
        'description',
        'family',
        'context_window',
        'max_tokens',
        'input_cost',
        'output_cost',
        'capabilities',
        'is_deprecated',
        'is_saved',
        'is_active',
        'is_default',
        'release_date',
        'metadata',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'metadata' => 'array',
        'is_deprecated' => 'boolean',
        'is_saved' => 'boolean',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'release_date' => 'date',
        'input_cost' => 'decimal:6',
        'output_cost' => 'decimal:6',
    ];

    /**
     * Get the AI provider that owns the model.
     */
    public function aiProvider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    /**
     * Get the user that owns the model through the provider.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope a query to only include active models.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include saved models.
     */
    public function scopeSaved($query)
    {
        return $query->where('is_saved', true);
    }

    /**
     * Scope a query to exclude deprecated models.
     */
    public function scopeNotDeprecated($query)
    {
        return $query->where('is_deprecated', false);
    }

    /**
     * Get the model's full identifier.
     */
    public function getFullIdentifierAttribute(): string
    {
        return $this->aiProvider->provider_name . ':' . $this->model_id;
    }

    /**
     * Get the estimated cost per 1K tokens.
     */
    public function getCostPer1kTokensAttribute(): array
    {
        return [
            'input' => $this->input_cost ? $this->input_cost * 1000 : null,
            'output' => $this->output_cost ? $this->output_cost * 1000 : null,
        ];
    }
}
