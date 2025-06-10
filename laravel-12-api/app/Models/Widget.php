<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Widget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'enabled',
        'status',
        'domain',
        'configuration',
        'last_updated_at',
        'published_at',
        'version',
    ];

    protected $casts = [
        'configuration' => 'array',
        'enabled' => 'boolean',
        'last_updated_at' => 'datetime',
        'published_at' => 'datetime',
        'version' => 'integer',
    ];

    /**
     * Get the user that owns the widget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the widget configurations.
     */
    public function configurations(): HasMany
    {
        return $this->hasMany(WidgetConfiguration::class);
    }

    /**
     * Get the active widget configuration.
     */
    public function activeConfiguration(): HasOne
    {
        return $this->hasOne(WidgetConfiguration::class)->where('is_active', true);
    }

    /**
     * Get the widget behavior settings.
     */
    public function behaviorSettings(): HasOne
    {
        return $this->hasOne(WidgetBehaviorSetting::class);
    }

    /**
     * Get the widget quick responses.
     */
    public function quickResponses(): HasMany
    {
        return $this->hasMany(WidgetQuickResponse::class);
    }

    /**
     * Get the widget conversation starters.
     */
    public function conversationStarters(): HasMany
    {
        return $this->hasMany(WidgetConversationStarter::class);
    }

    /**
     * Get the widget operating hours.
     */
    public function operatingHours(): HasMany
    {
        return $this->hasMany(WidgetOperatingHour::class);
    }

    /**
     * Get the widget AI models.
     */
    public function aiModels(): HasMany
    {
        return $this->hasMany(WidgetAiModel::class);
    }

    /**
     * Get the primary AI model for this widget.
     */
    public function primaryAiModel(): HasOne
    {
        return $this->hasOne(WidgetAiModel::class)->where('is_primary', true);
    }

    /**
     * Get the widget knowledge bases.
     */
    public function knowledgeBases(): HasMany
    {
        return $this->hasMany(WidgetKnowledgeBase::class);
    }

    /**
     * Get the widget languages.
     */
    public function languages(): HasMany
    {
        return $this->hasMany(WidgetLanguage::class);
    }

    /**
     * Get the primary language for this widget.
     */
    public function primaryLanguage(): HasOne
    {
        return $this->hasOne(WidgetLanguage::class)->where('is_primary', true);
    }

    /**
     * Get the widget analytics.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(WidgetAnalytic::class);
    }

    /**
     * Get the widget conversations.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(WidgetConversation::class);
    }

    /**
     * Get the widget assets.
     */
    public function assets(): HasMany
    {
        return $this->hasMany(WidgetAsset::class);
    }

    /**
     * Get the widget custom CSS.
     */
    public function customCss(): HasMany
    {
        return $this->hasMany(WidgetCustomCss::class);
    }

    /**
     * Scope a query to only include enabled widgets.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope a query to only include active widgets.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include published widgets.
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    /**
     * Scope a query to filter by domain.
     */
    public function scopeForDomain($query, $domain)
    {
        return $query->where('domain', $domain);
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

        // Get configuration from active configuration first, then fallback to widget configuration
        $activeConfig = $this->activeConfiguration;
        if ($activeConfig) {
            $configFromDb = [
                'theme' => $activeConfig->theme,
                'primaryColor' => $activeConfig->primary_color,
                'position' => $activeConfig->position,
                'size' => $activeConfig->size,
                'welcomeMessage' => $activeConfig->welcome_message,
                'placeholder' => $activeConfig->placeholder,
                'title' => $activeConfig->title,
                'subtitle' => $activeConfig->subtitle,
                'enabled' => $activeConfig->enabled,
                'showBranding' => $activeConfig->show_branding,
                'selectedModelId' => $activeConfig->selected_model_id,
                'knowledgeBase' => $activeConfig->knowledge_base_config ?? $defaults['knowledgeBase'],
            ];
            return array_merge($defaults, array_filter($configFromDb, fn($value) => $value !== null));
        }

        return array_merge($defaults, $this->configuration ?? []);
    }

    /**
     * Get the complete widget configuration from related models.
     */
    public function getCompleteConfiguration(): array
    {
        $config = $this->activeConfiguration?->toWidgetConfig() ?? $this->getConfigurationWithDefaults();

        // Add behavior settings
        if ($this->behaviorSettings) {
            $config['behavior'] = $this->behaviorSettings->toBehaviorConfig();
        }

        // Add quick responses
        $config['quickResponses'] = $this->quickResponses()
                                         ->enabled()
                                         ->ordered()
                                         ->get()
                                         ->map->toQuickResponseData()
                                         ->toArray();

        // Add conversation starters
        $config['conversationStarters'] = $this->conversationStarters()
                                               ->enabled()
                                               ->ordered()
                                               ->get()
                                               ->map->toConversationStarterData()
                                               ->toArray();

        // Add operating hours
        $config['operatingHours'] = $this->operatingHours()
                                         ->get()
                                         ->map->toOperatingHourData()
                                         ->toArray();

        // Add AI models
        $config['aiModels'] = $this->aiModels()
                                  ->with('aiModel.aiProvider')
                                  ->get()
                                  ->map->toAiModelData()
                                  ->toArray();

        // Add knowledge bases
        $config['knowledgeBases'] = $this->knowledgeBases()
                                        ->enabled()
                                        ->byPriority()
                                        ->get()
                                        ->map->toKnowledgeBaseData()
                                        ->toArray();

        // Add languages
        $config['languages'] = $this->languages()
                                   ->enabled()
                                   ->get()
                                   ->map->toLanguageData()
                                   ->toArray();

        // Add assets
        $config['assets'] = $this->assets()
                                ->active()
                                ->get()
                                ->map->toAssetData()
                                ->toArray();

        // Add custom CSS
        $config['customCss'] = WidgetCustomCss::getCompiledCssForWidget($this->id);

        return $config;
    }

    /**
     * Update the last_updated_at timestamp.
     */
    public function touchLastUpdated()
    {
        $this->update(['last_updated_at' => now()]);
    }

    /**
     * Publish the widget.
     */
    public function publish(): bool
    {
        return $this->update([
            'status' => 'active',
            'published_at' => now(),
        ]);
    }

    /**
     * Unpublish the widget.
     */
    public function unpublish(): bool
    {
        return $this->update([
            'status' => 'inactive',
        ]);
    }

    /**
     * Check if the widget is currently operating.
     */
    public function isOperating(): bool
    {
        if (!$this->enabled || $this->status !== 'active') {
            return false;
        }

        $behaviorSettings = $this->behaviorSettings;
        if (!$behaviorSettings || !$behaviorSettings->operating_hours_enabled) {
            return true; // Always operating if operating hours are disabled
        }

        return WidgetOperatingHour::isWidgetOperating($this->id, $behaviorSettings->timezone);
    }

    /**
     * Initialize default settings for a new widget.
     */
    public function initializeDefaults(): void
    {
        // Create default behavior settings
        if (!$this->behaviorSettings) {
            WidgetBehaviorSetting::create([
                'widget_id' => $this->id,
                'sound_notifications' => true,
                'typing_indicators' => true,
                'message_persistence' => true,
                'auto_minimize' => false,
                'operating_hours_enabled' => false,
                'timezone' => 'UTC',
                'offline_message' => 'We\'re currently offline. Leave a message!',
                'collect_offline_messages' => true,
                'file_uploads_enabled' => true,
                'emoji_support' => true,
                'link_previews' => false,
                'voice_messages' => false,
                'immediate_trigger' => false,
                'time_delay_trigger' => false,
                'scroll_trigger' => false,
                'exit_intent_trigger' => false,
                'time_delay_seconds' => 30,
                'scroll_percentage' => 50,
                'proactive_messages_enabled' => false,
                'new_visitors_only' => false,
                'returning_visitors' => true,
                'geographic_targeting' => 'all',
                'page_rules' => 'all',
            ]);
        }

        // Create default operating hours
        if ($this->operatingHours()->count() === 0) {
            WidgetOperatingHour::createDefaultForWidget($this->id);
        }

        // Create default language
        if ($this->languages()->count() === 0) {
            WidgetLanguage::createDefaultForWidget($this->id);
        }

        // Create default configuration
        if (!$this->activeConfiguration) {
            WidgetConfiguration::create([
                'widget_id' => $this->id,
                'version' => 1,
                'is_active' => true,
                'theme' => 'light',
                'primary_color' => '#3b82f6',
                'position' => 'bottom-right',
                'size' => 'medium',
                'welcome_message' => 'Hello! How can I help you today?',
                'placeholder' => 'Type your message...',
                'title' => 'AI Assistant',
                'subtitle' => 'Powered by ChatWidget Pro',
                'enabled' => true,
                'show_branding' => true,
            ]);
        }
    }

    /**
     * Get widget data for frontend.
     */
    public function toWidgetData(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'enabled' => $this->enabled,
            'status' => $this->status,
            'domain' => $this->domain,
            'version' => $this->version,
            'isOperating' => $this->isOperating(),
            'publishedAt' => $this->published_at?->toISOString(),
            'lastUpdatedAt' => $this->last_updated_at?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'configuration' => $this->getCompleteConfiguration(),
        ];
    }
}
