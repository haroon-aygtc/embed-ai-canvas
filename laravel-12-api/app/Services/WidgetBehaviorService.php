<?php

namespace App\Services;

use App\Models\WidgetBehaviorSetting;
use App\Models\WidgetOperatingHour;
use App\Models\Widget;
use Illuminate\Support\Collection;

class WidgetBehaviorService
{
    /**
     * Create behavior settings for a widget.
     */
    public function createBehavior(Widget $widget, array $data): WidgetBehaviorSetting
    {
        $behaviorData = $this->prepareBehaviorData($data);
        $behaviorData['widget_id'] = $widget->id;

        $behavior = WidgetBehaviorSetting::create($behaviorData);

        // Create operating hours if provided
        if (isset($data['operatingHours']) && is_array($data['operatingHours'])) {
            $this->createOperatingHours($widget->id, $data['operatingHours'], $data['timezone'] ?? 'UTC');
        }

        return $behavior->load('widget');
    }

    /**
     * Update behavior settings for a widget.
     */
    public function updateBehavior(int $behaviorId, array $data): WidgetBehaviorSetting
    {
        $behavior = WidgetBehaviorSetting::findOrFail($behaviorId);
        $behaviorData = $this->prepareBehaviorData($data);

        $behavior->update($behaviorData);

        // Update operating hours if provided
        if (isset($data['operatingHours']) && is_array($data['operatingHours'])) {
            $this->updateOperatingHours($behavior->widget_id, $data['operatingHours'], $data['timezone'] ?? 'UTC');
        }

        return $behavior->fresh()->load('widget');
    }

    /**
     * Get behavior settings for a widget.
     */
    public function getBehavior(int $widgetId): ?WidgetBehaviorSetting
    {
        return WidgetBehaviorSetting::where('widget_id', $widgetId)->first();
    }

    /**
     * Get or create behavior settings for a widget.
     */
    public function getOrCreateBehavior(Widget $widget): WidgetBehaviorSetting
    {
        $behavior = $this->getBehavior($widget->id);

        if (!$behavior) {
            $behavior = $this->createDefaultBehavior($widget);
        }

        return $behavior;
    }

    /**
     * Get operating hours for a widget.
     */
    public function getOperatingHours(int $widgetId): Collection
    {
        return WidgetOperatingHour::where('widget_id', $widgetId)
                                  ->orderBy('day_of_week')
                                  ->get()
                                  ->map(function ($hour) {
                                      return $hour->toOperatingHourData();
                                  });
    }

    /**
     * Create or update operating hours for a widget.
     */
    public function updateOperatingHours(int $widgetId, array $operatingHours, string $timezone = 'UTC'): Collection
    {
        // Delete existing operating hours
        WidgetOperatingHour::where('widget_id', $widgetId)->delete();

        // Create new operating hours
        return $this->createOperatingHours($widgetId, $operatingHours, $timezone);
    }

    /**
     * Create operating hours for a widget.
     */
    public function createOperatingHours(int $widgetId, array $operatingHours, string $timezone = 'UTC'): Collection
    {
        $createdHours = collect();

        foreach ($operatingHours as $hour) {
            $operatingHour = WidgetOperatingHour::create([
                'widget_id' => $widgetId,
                'day_of_week' => $hour['dayOfWeek'],
                'enabled' => $hour['enabled'] ?? false,
                'start_time' => $hour['start'] ?? '09:00:00',
                'end_time' => $hour['end'] ?? '17:00:00',
                'timezone' => $timezone,
            ]);

            $createdHours->push($operatingHour);
        }

        return $createdHours->map(function ($hour) {
            return $hour->toOperatingHourData();
        });
    }

    /**
     * Check if widget is currently operating.
     */
    public function isWidgetOperating(int $widgetId, string $timezone = 'UTC'): bool
    {
        $behavior = $this->getBehavior($widgetId);

        if (!$behavior || !$behavior->operating_hours_enabled) {
            return true; // Always operating if operating hours are disabled
        }

        return WidgetOperatingHour::isWidgetOperating($widgetId, $timezone);
    }

    /**
     * Get next operating time for a widget.
     */
    public function getNextOperatingTime(int $widgetId, string $timezone = 'UTC'): ?string
    {
        $nextTime = WidgetOperatingHour::getNextOperatingTime($widgetId, $timezone);
        return $nextTime ? $nextTime->toISOString() : null;
    }

    /**
     * Create default behavior settings for a widget.
     */
    public function createDefaultBehavior(Widget $widget): WidgetBehaviorSetting
    {
        $defaultData = [
            'widget_id' => $widget->id,
            'sound_notifications' => true,
            'typing_indicators' => true,
            'message_persistence' => true,
            'auto_minimize' => false,
            'operating_hours_enabled' => false,
            'timezone' => 'UTC',
            'collect_offline_messages' => true,
            'file_uploads_enabled' => true,
            'emoji_support' => true,
            'link_previews' => true,
            'voice_messages' => false,
            'immediate_trigger' => false,
            'time_delay_trigger' => false,
            'scroll_trigger' => false,
            'exit_intent_trigger' => false,
            'time_delay_seconds' => 5,
            'scroll_percentage' => 50,
            'proactive_messages_enabled' => false,
            'new_visitors_only' => false,
            'returning_visitors' => false,
            'geographic_targeting' => false,
            'page_rules' => 'all',
            'url_patterns' => [],
        ];

        $behavior = WidgetBehaviorSetting::create($defaultData);

        // Create default operating hours
        WidgetOperatingHour::createDefaultForWidget($widget->id, 'UTC');

        return $behavior;
    }

    /**
     * Delete behavior settings for a widget.
     */
    public function deleteBehavior(int $widgetId): bool
    {
        // Delete operating hours first
        WidgetOperatingHour::where('widget_id', $widgetId)->delete();

        // Delete behavior settings
        return WidgetBehaviorSetting::where('widget_id', $widgetId)->delete() > 0;
    }

    /**
     * Prepare behavior data from request.
     */
    private function prepareBehaviorData(array $data): array
    {
        $behaviorData = [];

        // Basic behavior settings
        if (isset($data['basicBehavior'])) {
            $basic = $data['basicBehavior'];
            $behaviorData['sound_notifications'] = $basic['soundNotifications'] ?? true;
            $behaviorData['typing_indicators'] = $basic['typingIndicators'] ?? true;
            $behaviorData['message_persistence'] = $basic['messagePersistence'] ?? true;
            $behaviorData['auto_minimize'] = $basic['autoMinimize'] ?? false;
        }

        // Operating hours settings
        if (isset($data['operatingHours'])) {
            $operating = $data['operatingHours'];
            $behaviorData['operating_hours_enabled'] = $operating['enabled'] ?? false;
            $behaviorData['timezone'] = $operating['timezone'] ?? 'UTC';
            $behaviorData['offline_message'] = $operating['offlineMessage'] ?? null;
            $behaviorData['collect_offline_messages'] = $operating['collectOfflineMessages'] ?? true;
        }

        // Rich media settings
        if (isset($data['richMedia'])) {
            $richMedia = $data['richMedia'];
            $behaviorData['file_uploads_enabled'] = $richMedia['fileUploads'] ?? true;
            $behaviorData['emoji_support'] = $richMedia['emojiSupport'] ?? true;
            $behaviorData['link_previews'] = $richMedia['linkPreviews'] ?? true;
            $behaviorData['voice_messages'] = $richMedia['voiceMessages'] ?? false;
        }

        // Auto-open triggers
        if (isset($data['triggers'])) {
            $triggers = $data['triggers'];
            $behaviorData['immediate_trigger'] = $triggers['immediate'] ?? false;
            $behaviorData['time_delay_trigger'] = $triggers['timeDelay']['enabled'] ?? false;
            $behaviorData['time_delay_seconds'] = $triggers['timeDelay']['seconds'] ?? 5;
            $behaviorData['scroll_trigger'] = $triggers['scroll']['enabled'] ?? false;
            $behaviorData['scroll_percentage'] = $triggers['scroll']['percentage'] ?? 50;
            $behaviorData['exit_intent_trigger'] = $triggers['exitIntent'] ?? false;
        }

        // Targeting settings
        if (isset($data['targeting'])) {
            $targeting = $data['targeting'];
            $behaviorData['new_visitors_only'] = $targeting['newVisitorsOnly'] ?? false;
            $behaviorData['returning_visitors'] = $targeting['returningVisitors'] ?? false;
            $behaviorData['geographic_targeting'] = $targeting['geographicTargeting'] ?? false;
            $behaviorData['page_rules'] = $targeting['pageRules'] ?? 'all';
            $behaviorData['url_patterns'] = $targeting['urlPatterns'] ?? [];
        }

        // Handle direct field mapping for simple updates
        $directFields = [
            'sound_notifications', 'typing_indicators', 'message_persistence', 'auto_minimize',
            'operating_hours_enabled', 'timezone', 'offline_message', 'collect_offline_messages',
            'file_uploads_enabled', 'emoji_support', 'link_previews', 'voice_messages',
            'immediate_trigger', 'time_delay_trigger', 'scroll_trigger', 'exit_intent_trigger',
            'time_delay_seconds', 'scroll_percentage', 'proactive_messages_enabled',
            'new_visitors_only', 'returning_visitors', 'geographic_targeting',
            'page_rules', 'url_patterns'
        ];

        foreach ($directFields as $field) {
            if (isset($data[$field])) {
                $behaviorData[$field] = $data[$field];
            }
        }

        return $behaviorData;
    }
}
