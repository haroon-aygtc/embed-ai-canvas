<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Widget;

class WidgetConfiguration extends Model
{
    protected $fillable = [
        'widget_id',
        'version',
        'is_active',
        'theme',
        'primary_color',
        'position',
        'size',
        'welcome_message',
        'placeholder',
        'title',
        'subtitle',
        'enabled',
        'show_branding',
        'selected_model_id',
        'knowledge_base_config',
        'additional_config',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'enabled' => 'boolean',
        'show_branding' => 'boolean',
        'knowledge_base_config' => 'array',
        'additional_config' => 'array',
        'version' => 'integer',
    ];

    /**
     * Get the widget that owns this configuration.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only active configurations.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get latest version for a widget.
     */
    public function scopeLatestVersion($query, $widgetId)
    {
        return $query->where('widget_id', $widgetId)
                    ->orderBy('version', 'desc')
                    ->limit(1);
    }

    /**
     * Get the configuration as an array compatible with frontend WidgetConfig interface.
     */
    public function toWidgetConfig(): array
    {
        return [
            'theme' => $this->theme,
            'primaryColor' => $this->primary_color,
            'position' => $this->position,
            'size' => $this->size,
            'welcomeMessage' => $this->welcome_message ?? 'Hello! How can I help you today?',
            'placeholder' => $this->placeholder,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'enabled' => $this->enabled,
            'showBranding' => $this->show_branding,
            'selectedModelId' => $this->selected_model_id,
            'knowledgeBase' => $this->knowledge_base_config ?? [
                'selectedKnowledgeBases' => [],
                'sources' => [],
                'settings' => [
                    'autoLearning' => true,
                    'contextAwareness' => true,
                    'realTimeUpdates' => false,
                    'confidenceThreshold' => true
                ]
            ],
        ];
    }

    /**
     * Get the welcome message with default fallback.
     */
    public function getWelcomeMessageAttribute($value): string
    {
        return $value ?? 'Hello! How can I help you today?';
    }

    /**
     * Create a new version of this configuration.
     */
    public function createNewVersion(): self
    {
        $newConfig = $this->replicate();
        $newConfig->version = $this->version + 1;
        $newConfig->is_active = false;
        $newConfig->save();

        return $newConfig;
    }

    /**
     * Activate this configuration version.
     */
    public function activate(): bool
    {
        // Deactivate all other versions for this widget
        static::where('widget_id', $this->widget_id)
              ->where('id', '!=', $this->id)
              ->update(['is_active' => false]);

        // Activate this version
        return $this->update(['is_active' => true]);
    }
}
