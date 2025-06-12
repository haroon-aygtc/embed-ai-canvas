<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Widget extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'title',
        'subtitle',
        'welcome_message',
        'placeholder',
        'enabled',
        'show_branding',
        'theme',
        'primary_color',
        'position',
        'size',
        'selected_model_id',
        'ai_provider',
        'sound_notifications',
        'typing_indicators',
        'message_persistence',
        'auto_minimize',
        'operating_hours_enabled',
        'timezone',
        'offline_message',
        'collect_offline_messages',
        'auto_open_enabled',
        'auto_open_trigger',
        'auto_open_delay',
        'auto_open_scroll_percent',
        'proactive_messaging_enabled',
        'new_visitors_only',
        'returning_visitors_behavior',
        'geographic_targeting',
        'page_targeting',
        'file_uploads_enabled',
        'emoji_support_enabled',
        'link_previews_enabled',
        'voice_messages_enabled',
        'auto_detect_language',
        'primary_language',
        'real_time_translation',
        'translation_service',
        'smart_responses_enabled',
        'fallback_to_human',
        'show_sources',
        'confidence_threshold_enabled',
        'status',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'enabled' => 'boolean',
        'show_branding' => 'boolean',
        'sound_notifications' => 'boolean',
        'typing_indicators' => 'boolean',
        'message_persistence' => 'boolean',
        'auto_minimize' => 'boolean',
        'operating_hours_enabled' => 'boolean',
        'collect_offline_messages' => 'boolean',
        'auto_open_enabled' => 'boolean',
        'auto_open_delay' => 'integer',
        'auto_open_scroll_percent' => 'integer',
        'proactive_messaging_enabled' => 'boolean',
        'new_visitors_only' => 'boolean',
        'returning_visitors_behavior' => 'boolean',
        'file_uploads_enabled' => 'boolean',
        'emoji_support_enabled' => 'boolean',
        'link_previews_enabled' => 'boolean',
        'voice_messages_enabled' => 'boolean',
        'auto_detect_language' => 'boolean',
        'real_time_translation' => 'boolean',
        'smart_responses_enabled' => 'boolean',
        'fallback_to_human' => 'boolean',
        'show_sources' => 'boolean',
        'confidence_threshold_enabled' => 'boolean',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // Add any sensitive fields here if needed
    ];

    /**
     * Get the user that owns the widget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the operating hours for the widget.
     */
    public function operatingHours(): HasMany
    {
        return $this->hasMany(WidgetOperatingHour::class);
    }

    /**
     * Get the quick responses for the widget.
     */
    public function quickResponses(): HasMany
    {
        return $this->hasMany(WidgetQuickResponse::class)->orderBy('sort_order');
    }

    /**
     * Get the conversation starters for the widget.
     */
    public function conversationStarters(): HasMany
    {
        return $this->hasMany(WidgetConversationStarter::class);
    }

    /**
     * Get the knowledge bases associated with the widget.
     */
    public function knowledgeBases(): HasMany
    {
        return $this->hasMany(WidgetKnowledgeBase::class);
    }

    /**
     * Get the URL patterns for the widget.
     */
    public function urlPatterns(): HasMany
    {
        return $this->hasMany(WidgetUrlPattern::class);
    }

    /**
     * Scope a query to only include active widgets.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('enabled', true);
    }

    /**
     * Scope a query to only include widgets for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get the widget's configuration as an array suitable for frontend.
     */
    public function getConfigurationAttribute(): array
    {
        return [
            'theme' => $this->theme,
            'primaryColor' => $this->primary_color,
            'position' => $this->position,
            'size' => $this->size,
            'welcomeMessage' => $this->welcome_message,
            'placeholder' => $this->placeholder,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'enabled' => $this->enabled,
            'showBranding' => $this->show_branding,
            'selectedModelId' => $this->selected_model_id,
            'knowledgeBase' => [
                'selectedKnowledgeBases' => $this->knowledgeBases->pluck('knowledge_base_id')->toArray(),
                'settings' => [
                    'contextAwareness' => $this->smart_responses_enabled,
                    'realTimeUpdates' => $this->fallback_to_human,
                    'autoLearning' => $this->show_sources,
                    'confidenceThreshold' => $this->confidence_threshold_enabled,
                ],
            ],
        ];
    }

    /**
     * Check if the widget is currently within operating hours.
     */
    public function isWithinOperatingHours(): bool
    {
        if (!$this->operating_hours_enabled) {
            return true;
        }

        $now = now($this->timezone);
        $dayOfWeek = strtolower($now->format('l'));
        
        $operatingHour = $this->operatingHours()
            ->where('day_of_week', $dayOfWeek)
            ->where('enabled', true)
            ->first();

        if (!$operatingHour) {
            return false;
        }

        $currentTime = $now->format('H:i:s');
        return $currentTime >= $operatingHour->start_time && $currentTime <= $operatingHour->end_time;
    }
}
