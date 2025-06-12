<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetOperatingHour;
use App\Models\WidgetQuickResponse;
use App\Models\WidgetConversationStarter;
use App\Models\WidgetKnowledgeBase;
use App\Models\WidgetUrlPattern;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WidgetConfigurationService
{
    /**
     * Create a new widget with all related configurations.
     */
    public function createWidget(array $data, int $userId): Widget
    {
        return DB::transaction(function () use ($data, $userId) {
            // Create the main widget
            $widget = Widget::create(array_merge(
                $this->extractWidgetData($data),
                ['user_id' => $userId]
            ));

            // Create related configurations
            $this->syncOperatingHours($widget, $data['operating_hours'] ?? []);
            $this->syncQuickResponses($widget, $data['quick_responses'] ?? []);
            $this->syncConversationStarters($widget, $data['conversation_starters'] ?? []);
            $this->syncKnowledgeBases($widget, $data['knowledge_bases'] ?? []);
            $this->syncUrlPatterns($widget, $data['url_patterns'] ?? []);

            return $widget->load([
                'operatingHours',
                'quickResponses',
                'conversationStarters',
                'knowledgeBases',
                'urlPatterns'
            ]);
        });
    }

    /**
     * Update an existing widget with all related configurations.
     */
    public function updateWidget(Widget $widget, array $data): Widget
    {
        return DB::transaction(function () use ($widget, $data) {
            // Update the main widget
            $widget->update($this->extractWidgetData($data));

            // Update related configurations if provided
            if (isset($data['operating_hours'])) {
                $this->syncOperatingHours($widget, $data['operating_hours']);
            }

            if (isset($data['quick_responses'])) {
                $this->syncQuickResponses($widget, $data['quick_responses']);
            }

            if (isset($data['conversation_starters'])) {
                $this->syncConversationStarters($widget, $data['conversation_starters']);
            }

            if (isset($data['knowledge_bases'])) {
                $this->syncKnowledgeBases($widget, $data['knowledge_bases']);
            }

            if (isset($data['url_patterns'])) {
                $this->syncUrlPatterns($widget, $data['url_patterns']);
            }

            return $widget->fresh([
                'operatingHours',
                'quickResponses',
                'conversationStarters',
                'knowledgeBases',
                'urlPatterns'
            ]);
        });
    }

    /**
     * Get widget configuration formatted for frontend consumption.
     */
    public function getWidgetConfiguration(Widget $widget): array
    {
        $widget->load([
            'operatingHours',
            'quickResponses',
            'conversationStarters',
            'knowledgeBases',
            'urlPatterns'
        ]);

        return [
            'id' => $widget->id,
            'name' => $widget->name,
            'description' => $widget->description,
            'status' => $widget->status,
            
            // Basic Settings
            'title' => $widget->title,
            'subtitle' => $widget->subtitle,
            'welcomeMessage' => $widget->welcome_message,
            'placeholder' => $widget->placeholder,
            'enabled' => $widget->enabled,
            'showBranding' => $widget->show_branding,
            
            // Appearance Settings
            'theme' => $widget->theme,
            'primaryColor' => $widget->primary_color,
            'position' => $widget->position,
            'size' => $widget->size,
            
            // AI Model Configuration
            'selectedModelId' => $widget->selected_model_id,
            'aiProvider' => $widget->ai_provider,
            
            // Behavior Settings
            'soundNotifications' => $widget->sound_notifications,
            'typingIndicators' => $widget->typing_indicators,
            'messagePersistence' => $widget->message_persistence,
            'autoMinimize' => $widget->auto_minimize,
            
            // Operating Hours
            'operatingHoursEnabled' => $widget->operating_hours_enabled,
            'timezone' => $widget->timezone,
            'offlineMessage' => $widget->offline_message,
            'collectOfflineMessages' => $widget->collect_offline_messages,
            'operatingHours' => $widget->operatingHours->map(function ($hour) {
                return [
                    'dayOfWeek' => $hour->day_of_week,
                    'enabled' => $hour->enabled,
                    'startTime' => $hour->start_time,
                    'endTime' => $hour->end_time,
                ];
            }),
            
            // Trigger Settings
            'autoOpenEnabled' => $widget->auto_open_enabled,
            'autoOpenTrigger' => $widget->auto_open_trigger,
            'autoOpenDelay' => $widget->auto_open_delay,
            'autoOpenScrollPercent' => $widget->auto_open_scroll_percent,
            
            // Proactive Messaging
            'proactiveMessagingEnabled' => $widget->proactive_messaging_enabled,
            
            // Targeting Settings
            'newVisitorsOnly' => $widget->new_visitors_only,
            'returningVisitorsBehavior' => $widget->returning_visitors_behavior,
            'geographicTargeting' => $widget->geographic_targeting,
            'pageTargeting' => $widget->page_targeting,
            
            // Rich Media Settings
            'fileUploadsEnabled' => $widget->file_uploads_enabled,
            'emojiSupportEnabled' => $widget->emoji_support_enabled,
            'linkPreviewsEnabled' => $widget->link_previews_enabled,
            'voiceMessagesEnabled' => $widget->voice_messages_enabled,
            
            // Language Settings
            'autoDetectLanguage' => $widget->auto_detect_language,
            'primaryLanguage' => $widget->primary_language,
            'realTimeTranslation' => $widget->real_time_translation,
            'translationService' => $widget->translation_service,
            
            // Knowledge Base Settings
            'smartResponsesEnabled' => $widget->smart_responses_enabled,
            'fallbackToHuman' => $widget->fallback_to_human,
            'showSources' => $widget->show_sources,
            'confidenceThresholdEnabled' => $widget->confidence_threshold_enabled,
            
            // Related Data
            'quickResponses' => $widget->quickResponses->map(function ($response) {
                return [
                    'id' => $response->id,
                    'text' => $response->text,
                    'category' => $response->category,
                    'enabled' => $response->enabled,
                    'sortOrder' => $response->sort_order,
                ];
            }),
            
            'conversationStarters' => $widget->conversationStarters->map(function ($starter) {
                return [
                    'id' => $starter->id,
                    'message' => $starter->message,
                    'trigger' => $starter->trigger,
                    'delaySeconds' => $starter->delay_seconds,
                    'enabled' => $starter->enabled,
                ];
            }),
            
            'knowledgeBases' => $widget->knowledgeBases->pluck('knowledge_base_id'),
            
            'urlPatterns' => $widget->urlPatterns->map(function ($pattern) {
                return [
                    'id' => $pattern->id,
                    'pattern' => $pattern->pattern,
                    'type' => $pattern->type,
                    'enabled' => $pattern->enabled,
                ];
            }),
            
            'metadata' => $widget->metadata,
            'createdAt' => $widget->created_at,
            'updatedAt' => $widget->updated_at,
        ];
    }

    /**
     * Duplicate a widget with all its configurations.
     */
    public function duplicateWidget(Widget $originalWidget, string $newName, int $userId): Widget
    {
        return DB::transaction(function () use ($originalWidget, $newName, $userId) {
            $originalWidget->load([
                'operatingHours',
                'quickResponses',
                'conversationStarters',
                'knowledgeBases',
                'urlPatterns'
            ]);

            // Create new widget with same configuration
            $newWidget = Widget::create(array_merge(
                $originalWidget->toArray(),
                [
                    'user_id' => $userId,
                    'name' => $newName,
                    'status' => 'draft', // New widgets start as draft
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ));

            // Duplicate related configurations
            $this->duplicateOperatingHours($originalWidget, $newWidget);
            $this->duplicateQuickResponses($originalWidget, $newWidget);
            $this->duplicateConversationStarters($originalWidget, $newWidget);
            $this->duplicateKnowledgeBases($originalWidget, $newWidget);
            $this->duplicateUrlPatterns($originalWidget, $newWidget);

            return $newWidget->load([
                'operatingHours',
                'quickResponses',
                'conversationStarters',
                'knowledgeBases',
                'urlPatterns'
            ]);
        });
    }

    /**
     * Extract widget-specific data from the input array.
     */
    private function extractWidgetData(array $data): array
    {
        return array_intersect_key($data, array_flip([
            'name', 'description', 'title', 'subtitle', 'welcome_message', 'placeholder',
            'enabled', 'show_branding', 'theme', 'primary_color', 'position', 'size',
            'selected_model_id', 'ai_provider', 'sound_notifications', 'typing_indicators',
            'message_persistence', 'auto_minimize', 'operating_hours_enabled', 'timezone',
            'offline_message', 'collect_offline_messages', 'auto_open_enabled',
            'auto_open_trigger', 'auto_open_delay', 'auto_open_scroll_percent',
            'proactive_messaging_enabled', 'new_visitors_only', 'returning_visitors_behavior',
            'geographic_targeting', 'page_targeting', 'file_uploads_enabled',
            'emoji_support_enabled', 'link_previews_enabled', 'voice_messages_enabled',
            'auto_detect_language', 'primary_language', 'real_time_translation',
            'translation_service', 'smart_responses_enabled', 'fallback_to_human',
            'show_sources', 'confidence_threshold_enabled', 'status', 'metadata'
        ]));
    }

    /**
     * Sync operating hours for a widget.
     */
    private function syncOperatingHours(Widget $widget, array $operatingHours): void
    {
        $widget->operatingHours()->delete();

        foreach ($operatingHours as $hour) {
            $widget->operatingHours()->create($hour);
        }
    }

    /**
     * Sync quick responses for a widget.
     */
    private function syncQuickResponses(Widget $widget, array $quickResponses): void
    {
        $widget->quickResponses()->delete();

        foreach ($quickResponses as $index => $response) {
            $widget->quickResponses()->create(array_merge($response, [
                'sort_order' => $response['sort_order'] ?? $index
            ]));
        }
    }

    /**
     * Sync conversation starters for a widget.
     */
    private function syncConversationStarters(Widget $widget, array $conversationStarters): void
    {
        $widget->conversationStarters()->delete();

        foreach ($conversationStarters as $starter) {
            $widget->conversationStarters()->create($starter);
        }
    }

    /**
     * Sync knowledge bases for a widget.
     */
    private function syncKnowledgeBases(Widget $widget, array $knowledgeBases): void
    {
        $widget->knowledgeBases()->delete();

        foreach ($knowledgeBases as $kbId) {
            $widget->knowledgeBases()->create([
                'knowledge_base_id' => $kbId,
                'enabled' => true
            ]);
        }
    }

    /**
     * Sync URL patterns for a widget.
     */
    private function syncUrlPatterns(Widget $widget, array $urlPatterns): void
    {
        $widget->urlPatterns()->delete();

        foreach ($urlPatterns as $pattern) {
            $widget->urlPatterns()->create($pattern);
        }
    }

    /**
     * Duplicate operating hours from one widget to another.
     */
    private function duplicateOperatingHours(Widget $source, Widget $target): void
    {
        foreach ($source->operatingHours as $hour) {
            $target->operatingHours()->create($hour->only([
                'day_of_week', 'enabled', 'start_time', 'end_time'
            ]));
        }
    }

    /**
     * Duplicate quick responses from one widget to another.
     */
    private function duplicateQuickResponses(Widget $source, Widget $target): void
    {
        foreach ($source->quickResponses as $response) {
            $target->quickResponses()->create($response->only([
                'text', 'category', 'enabled', 'sort_order'
            ]));
        }
    }

    /**
     * Duplicate conversation starters from one widget to another.
     */
    private function duplicateConversationStarters(Widget $source, Widget $target): void
    {
        foreach ($source->conversationStarters as $starter) {
            $target->conversationStarters()->create($starter->only([
                'message', 'trigger', 'delay_seconds', 'enabled'
            ]));
        }
    }

    /**
     * Duplicate knowledge bases from one widget to another.
     */
    private function duplicateKnowledgeBases(Widget $source, Widget $target): void
    {
        foreach ($source->knowledgeBases as $kb) {
            $target->knowledgeBases()->create($kb->only([
                'knowledge_base_id', 'enabled'
            ]));
        }
    }

    /**
     * Duplicate URL patterns from one widget to another.
     */
    private function duplicateUrlPatterns(Widget $source, Widget $target): void
    {
        foreach ($source->urlPatterns as $pattern) {
            $target->urlPatterns()->create($pattern->only([
                'pattern', 'type', 'enabled'
            ]));
        }
    }
}
