<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Widget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'enabled',
        'configuration',
        'last_updated_at',
    ];

    protected $casts = [
        'configuration' => 'array',
        'enabled' => 'boolean',
        'last_updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the widget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include enabled widgets.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Get the widget's configuration with defaults.
     */
    public function getConfigurationWithDefaults(): array
    {
        $defaults = [
            'theme' => 'light',
            'primaryColor' => '#3b82f6',
            'position' => 'bottom-right',
            'size' => 'medium',
            'welcomeMessage' => 'Hello! How can I help you today?',
            'placeholder' => 'Type your message...',
            'title' => 'AI Assistant',
            'subtitle' => 'Powered by ChatWidget Pro',
            'enabled' => true,
            'showBranding' => true,
            'selectedModelId' => null,
            'knowledgeBase' => [
                'selectedKnowledgeBases' => [],
                'sources' => [],
                'settings' => [
                    'autoLearning' => true,
                    'contextAwareness' => true,
                    'realTimeUpdates' => false,
                    'confidenceThreshold' => true
                ]
            ]
        ];

        return array_merge($defaults, $this->configuration ?? []);
    }

    /**
     * Update the last_updated_at timestamp.
     */
    public function touchLastUpdated()
    {
        $this->update(['last_updated_at' => now()]);
    }
}
