<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetConversationStarter extends Model
{
    protected $fillable = [
        'widget_id',
        'message',
        'trigger_type',
        'delay_seconds',
        'page_pattern',
        'enabled',
        'sort_order',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'delay_seconds' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Get the widget that owns this conversation starter.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only enabled conversation starters.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope to filter by trigger type.
     */
    public function scopeByTriggerType($query, $triggerType)
    {
        return $query->where('trigger_type', $triggerType);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Get conversation starters for a specific page pattern.
     */
    public function scopeForPage($query, $url)
    {
        return $query->where(function ($q) use ($url) {
            $q->whereNull('page_pattern')
              ->orWhere('page_pattern', '')
              ->orWhere(function ($subQ) use ($url) {
                  $subQ->whereNotNull('page_pattern')
                       ->where('page_pattern', '!=', '')
                       ->where($url, 'LIKE', \DB::raw('CONCAT("%", page_pattern, "%")'));
              });
        });
    }

    /**
     * Get all available trigger types.
     */
    public static function getTriggerTypes(): array
    {
        return [
            'first_visit' => 'First Visit',
            'return_visit' => 'Return Visit',
            'pricing_page' => 'Pricing Page',
            'contact_page' => 'Contact Page',
            'checkout' => 'Checkout',
            'custom' => 'Custom Pattern',
        ];
    }

    /**
     * Get the next sort order for a widget.
     */
    public static function getNextSortOrder(int $widgetId): int
    {
        return static::where('widget_id', $widgetId)->max('sort_order') + 1;
    }

    /**
     * Reorder conversation starters for a widget.
     */
    public static function reorderForWidget(int $widgetId, array $starterIds): void
    {
        foreach ($starterIds as $index => $starterId) {
            static::where('id', $starterId)
                  ->where('widget_id', $widgetId)
                  ->update(['sort_order' => $index + 1]);
        }
    }

    /**
     * Check if this starter should trigger for a given context.
     */
    public function shouldTrigger(array $context): bool
    {
        if (!$this->enabled) {
            return false;
        }

        // Check page pattern if specified
        if ($this->page_pattern && isset($context['url'])) {
            if (strpos($context['url'], $this->page_pattern) === false) {
                return false;
            }
        }

        // Check trigger type conditions
        switch ($this->trigger_type) {
            case 'first_visit':
                return !($context['is_returning_visitor'] ?? false);
            case 'return_visit':
                return $context['is_returning_visitor'] ?? false;
            case 'pricing_page':
                return strpos($context['url'] ?? '', 'pricing') !== false;
            case 'contact_page':
                return strpos($context['url'] ?? '', 'contact') !== false;
            case 'checkout':
                return strpos($context['url'] ?? '', 'checkout') !== false;
            default:
                return true;
        }
    }

    /**
     * Get conversation starter data for frontend.
     */
    public function toConversationStarterData(): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'trigger' => $this->trigger_type,
            'delay' => $this->delay_seconds,
            'pagePattern' => $this->page_pattern,
            'enabled' => $this->enabled,
            'sortOrder' => $this->sort_order,
        ];
    }
}
