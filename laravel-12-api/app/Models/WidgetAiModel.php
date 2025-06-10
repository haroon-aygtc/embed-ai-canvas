<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetAiModel extends Model
{
    protected $fillable = [
        'widget_id',
        'ai_model_id',
        'is_primary',
        'temperature',
        'max_tokens',
        'system_prompt',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'temperature' => 'decimal:2',
        'max_tokens' => 'integer',
    ];

    /**
     * Get the widget that owns this AI model configuration.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Get the AI model.
     */
    public function aiModel(): BelongsTo
    {
        return $this->belongsTo(AiModel::class);
    }

    /**
     * Scope to get only primary AI models.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Set this AI model as primary for the widget.
     */
    public function setPrimary(): bool
    {
        // Remove primary status from other models for this widget
        static::where('widget_id', $this->widget_id)
              ->where('id', '!=', $this->id)
              ->update(['is_primary' => false]);

        // Set this model as primary
        return $this->update(['is_primary' => true]);
    }

    /**
     * Get the primary AI model for a widget.
     */
    public static function getPrimaryForWidget(int $widgetId): ?self
    {
        return static::where('widget_id', $widgetId)
                    ->where('is_primary', true)
                    ->with('aiModel.aiProvider')
                    ->first();
    }

    /**
     * Get all AI models for a widget.
     */
    public static function getForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->with('aiModel.aiProvider')
                    ->get();
    }

    /**
     * Create or update AI model configuration for a widget.
     */
    public static function configureForWidget(int $widgetId, int $aiModelId, array $config): self
    {
        return static::updateOrCreate(
            [
                'widget_id' => $widgetId,
                'ai_model_id' => $aiModelId,
            ],
            $config
        );
    }

    /**
     * Get the AI model configuration for API usage.
     */
    public function getApiConfiguration(): array
    {
        return [
            'model_id' => $this->aiModel->model_id,
            'provider' => $this->aiModel->aiProvider->provider_name,
            'temperature' => $this->temperature,
            'max_tokens' => $this->max_tokens,
            'system_prompt' => $this->system_prompt,
        ];
    }

    /**
     * Get AI model data for frontend.
     */
    public function toAiModelData(): array
    {
        return [
            'id' => $this->id,
            'aiModelId' => $this->ai_model_id,
            'modelName' => $this->aiModel->name,
            'providerName' => $this->aiModel->aiProvider->display_name,
            'isPrimary' => $this->is_primary,
            'temperature' => $this->temperature,
            'maxTokens' => $this->max_tokens,
            'systemPrompt' => $this->system_prompt,
        ];
    }
}
