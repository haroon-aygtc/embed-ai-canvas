<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'preview_image',
        'is_popular',
        'configuration_json',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'configuration_json' => 'array',
    ];

    /**
     * Scope to get only popular templates.
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    /**
     * Scope to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get all available categories.
     */
    public static function getCategories(): array
    {
        return static::distinct('category')->pluck('category')->toArray();
    }

    /**
     * Get the template configuration as WidgetConfig format.
     */
    public function getWidgetConfig(): array
    {
        return $this->configuration_json ?? [];
    }

    /**
     * Set the template configuration from WidgetConfig format.
     */
    public function setWidgetConfig(array $config): void
    {
        $this->configuration_json = $config;
    }

    /**
     * Create a new widget from this template.
     */
    public function createWidget(int $userId, string $name = null): Widget
    {
        $widget = Widget::create([
            'user_id' => $userId,
            'name' => $name ?? $this->name,
            'description' => "Created from template: {$this->name}",
            'configuration' => $this->configuration_json,
            'enabled' => true,
            'status' => 'draft',
        ]);

        return $widget;
    }

    /**
     * Get template preview data for frontend.
     */
    public function toTemplatePreview(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'preview' => $this->preview_image,
            'config' => $this->configuration_json,
            'popular' => $this->is_popular,
        ];
    }
}
