<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetQuickResponse extends Model
{
    protected $fillable = [
        'widget_id',
        'text',
        'category',
        'enabled',
        'sort_order',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the widget that owns this quick response.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only enabled quick responses.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Get all available categories for a widget.
     */
    public static function getCategoriesForWidget(int $widgetId): array
    {
        return static::where('widget_id', $widgetId)
                    ->distinct('category')
                    ->pluck('category')
                    ->toArray();
    }

    /**
     * Get the next sort order for a widget.
     */
    public static function getNextSortOrder(int $widgetId): int
    {
        return static::where('widget_id', $widgetId)->max('sort_order') + 1;
    }

    /**
     * Reorder quick responses for a widget.
     */
    public static function reorderForWidget(int $widgetId, array $responseIds): void
    {
        foreach ($responseIds as $index => $responseId) {
            static::where('id', $responseId)
                  ->where('widget_id', $widgetId)
                  ->update(['sort_order' => $index + 1]);
        }
    }

    /**
     * Get quick response data for frontend.
     */
    public function toQuickResponseData(): array
    {
        return [
            'id' => $this->id,
            'text' => $this->text,
            'category' => $this->category,
            'enabled' => $this->enabled,
            'sortOrder' => $this->sort_order,
        ];
    }
}
