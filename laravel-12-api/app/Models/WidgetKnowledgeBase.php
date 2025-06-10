<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetKnowledgeBase extends Model
{
    protected $fillable = [
        'widget_id',
        'knowledge_base_id',
        'enabled',
        'priority',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'priority' => 'integer',
    ];

    /**
     * Get the widget that owns this knowledge base configuration.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only enabled knowledge bases.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope to order by priority.
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority', 'desc')->orderBy('id');
    }

    /**
     * Get enabled knowledge bases for a widget ordered by priority.
     */
    public static function getEnabledForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->enabled()
                    ->byPriority()
                    ->get();
    }

    /**
     * Get all knowledge bases for a widget.
     */
    public static function getForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->byPriority()
                    ->get();
    }

    /**
     * Add or update knowledge base for a widget.
     */
    public static function configureForWidget(int $widgetId, string $knowledgeBaseId, array $config = []): self
    {
        return static::updateOrCreate(
            [
                'widget_id' => $widgetId,
                'knowledge_base_id' => $knowledgeBaseId,
            ],
            array_merge([
                'enabled' => true,
                'priority' => 0,
            ], $config)
        );
    }

    /**
     * Remove knowledge base from widget.
     */
    public static function removeFromWidget(int $widgetId, string $knowledgeBaseId): bool
    {
        return static::where('widget_id', $widgetId)
                    ->where('knowledge_base_id', $knowledgeBaseId)
                    ->delete() > 0;
    }

    /**
     * Reorder knowledge bases for a widget.
     */
    public static function reorderForWidget(int $widgetId, array $knowledgeBaseIds): void
    {
        foreach ($knowledgeBaseIds as $index => $knowledgeBaseId) {
            static::where('widget_id', $widgetId)
                  ->where('knowledge_base_id', $knowledgeBaseId)
                  ->update(['priority' => count($knowledgeBaseIds) - $index]);
        }
    }

    /**
     * Get knowledge base data for frontend.
     */
    public function toKnowledgeBaseData(): array
    {
        return [
            'id' => $this->knowledge_base_id,
            'enabled' => $this->enabled,
            'priority' => $this->priority,
        ];
    }
}
