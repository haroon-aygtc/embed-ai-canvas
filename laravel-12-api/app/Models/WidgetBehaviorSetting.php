<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetBehaviorSetting extends Model
{
    protected $fillable = [
        'widget_id',
        'sound_notifications',
        'typing_indicators',
        'message_persistence',
        'auto_minimize',
        'operating_hours_enabled',
        'timezone',
        'offline_message',
        'collect_offline_messages',
        'file_uploads_enabled',
        'emoji_support',
        'link_previews',
        'voice_messages',
        'immediate_trigger',
        'time_delay_trigger',
        'scroll_trigger',
        'exit_intent_trigger',
        'time_delay_seconds',
        'scroll_percentage',
        'proactive_messages_enabled',
        'new_visitors_only',
        'returning_visitors',
        'geographic_targeting',
        'page_rules',
        'url_patterns',
    ];

    protected $casts = [
        'sound_notifications' => 'boolean',
        'typing_indicators' => 'boolean',
        'message_persistence' => 'boolean',
        'auto_minimize' => 'boolean',
        'operating_hours_enabled' => 'boolean',
        'collect_offline_messages' => 'boolean',
        'file_uploads_enabled' => 'boolean',
        'emoji_support' => 'boolean',
        'link_previews' => 'boolean',
        'voice_messages' => 'boolean',
        'immediate_trigger' => 'boolean',
        'time_delay_trigger' => 'boolean',
        'scroll_trigger' => 'boolean',
        'exit_intent_trigger' => 'boolean',
        'proactive_messages_enabled' => 'boolean',
        'new_visitors_only' => 'boolean',
        'returning_visitors' => 'boolean',
        'time_delay_seconds' => 'integer',
        'scroll_percentage' => 'integer',
        'url_patterns' => 'array',
    ];

    /**
     * Get the widget that owns these behavior settings.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Check if any auto-open triggers are enabled.
     */
    public function hasAutoOpenTriggers(): bool
    {
        return $this->immediate_trigger ||
               $this->time_delay_trigger ||
               $this->scroll_trigger ||
               $this->exit_intent_trigger;
    }

    /**
     * Get enabled auto-open triggers.
     */
    public function getEnabledTriggers(): array
    {
        $triggers = [];

        if ($this->immediate_trigger) {
            $triggers[] = ['type' => 'immediate'];
        }

        if ($this->time_delay_trigger) {
            $triggers[] = [
                'type' => 'time_delay',
                'seconds' => $this->time_delay_seconds
            ];
        }

        if ($this->scroll_trigger) {
            $triggers[] = [
                'type' => 'scroll',
                'percentage' => $this->scroll_percentage
            ];
        }

        if ($this->exit_intent_trigger) {
            $triggers[] = ['type' => 'exit_intent'];
        }

        return $triggers;
    }

    /**
     * Check if rich media features are enabled.
     */
    public function hasRichMediaFeatures(): bool
    {
        return $this->file_uploads_enabled ||
               $this->emoji_support ||
               $this->link_previews ||
               $this->voice_messages;
    }

    /**
     * Get the behavior settings as an array for frontend.
     */
    public function toBehaviorConfig(): array
    {
        return [
            'basicBehavior' => [
                'soundNotifications' => $this->sound_notifications,
                'typingIndicators' => $this->typing_indicators,
                'messagePersistence' => $this->message_persistence,
                'autoMinimize' => $this->auto_minimize,
            ],
            'operatingHours' => [
                'enabled' => $this->operating_hours_enabled,
                'timezone' => $this->timezone,
                'offlineMessage' => $this->offline_message ?? 'We\'re currently offline. Leave a message!',
                'collectOfflineMessages' => $this->collect_offline_messages,
            ],
            'richMedia' => [
                'fileUploads' => $this->file_uploads_enabled,
                'emojiSupport' => $this->emoji_support,
                'linkPreviews' => $this->link_previews,
                'voiceMessages' => $this->voice_messages,
            ],
            'triggers' => $this->getEnabledTriggers(),
            'targeting' => [
                'newVisitorsOnly' => $this->new_visitors_only,
                'returningVisitors' => $this->returning_visitors,
                'geographicTargeting' => $this->geographic_targeting,
                'pageRules' => $this->page_rules,
                'urlPatterns' => $this->url_patterns ?? [],
            ],
        ];
    }

    /**
     * Get the offline message with default fallback.
     */
    public function getOfflineMessageAttribute($value): string
    {
        return $value ?? 'We\'re currently offline. Leave a message!';
    }
}
