<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\User;
use App\Models\WidgetConfiguration;
use App\Models\WidgetBehaviorSetting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class WidgetService
{
    /**
     * Get all widgets for the authenticated user with relationships.
     */
    public function getAllWidgets(User $user): array
    {
        try {
            $widgets = $user->widgets()
                ->with([
                    'activeConfiguration',
                    'behaviorSettings',
                    'primaryAiModel.aiModel',
                    'primaryLanguage'
                ])
                ->latest()
                ->get();

            return [
                'success' => true,
                'data' => $widgets->map(function ($widget) {
                    return $this->transformWidgetForFrontend($widget);
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch widgets for user', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch widgets',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get a specific widget with all relationships.
     */
    public function getWidget(Widget $widget): array
    {
        try {
            $widget->load([
                'activeConfiguration',
                'behaviorSettings',
                'quickResponses' => function ($query) {
                    $query->where('enabled', true)->orderBy('sort_order');
                },
                'conversationStarters' => function ($query) {
                    $query->where('enabled', true)->orderBy('sort_order');
                },
                'operatingHours',
                'aiModels.aiModel',
                'knowledgeBases.knowledgeBase',
                'languages',
                'assets',
                'customCss' => function ($query) {
                    $query->where('is_active', true);
                }
            ]);

            return [
                'success' => true,
                'data' => $this->transformWidgetForFrontend($widget, true)
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch widget', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch widget',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new widget with default configuration.
     */
    public function createWidget(User $user, array $data): array
    {
        try {
            return DB::transaction(function () use ($user, $data) {
                // Create the widget
                $widget = Widget::create([
                    'user_id' => $user->id,
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'enabled' => $data['enabled'] ?? true,
                    'status' => $data['status'] ?? 'draft',
                    'domain' => $data['domain'] ?? null,
                    'configuration' => $data['configuration'] ?? [],
                    'last_updated_at' => now(),
                    'version' => 1,
                ]);

                // Initialize default relationships
                $this->initializeWidgetDefaults($widget, $data);

                // Load relationships for response
                $widget->load([
                    'activeConfiguration',
                    'behaviorSettings',
                    'primaryAiModel.aiModel'
                ]);

                return [
                    'success' => true,
                    'message' => 'Widget created successfully',
                    'data' => $this->transformWidgetForFrontend($widget)
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to create widget', [
                'user_id' => $user->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create widget',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update a widget and its configuration.
     */
    public function updateWidget(Widget $widget, array $data): array
    {
        try {
            return DB::transaction(function () use ($widget, $data) {
                // Update widget basic fields
                $updateData = array_filter([
                    'name' => $data['name'] ?? null,
                    'description' => $data['description'] ?? null,
                    'enabled' => $data['enabled'] ?? null,
                    'status' => $data['status'] ?? null,
                    'domain' => $data['domain'] ?? null,
                    'last_updated_at' => now(),
                ], fn($value) => $value !== null);

                if (!empty($updateData)) {
                    $widget->update($updateData);
                }

                // Update configuration if provided
                if (isset($data['configuration'])) {
                    $this->updateWidgetConfiguration($widget, $data['configuration']);
                }

                // Load relationships for response
                $widget->load([
                    'activeConfiguration',
                    'behaviorSettings',
                    'primaryAiModel.aiModel'
                ]);

                return [
                    'success' => true,
                    'message' => 'Widget updated successfully',
                    'data' => $this->transformWidgetForFrontend($widget)
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to update widget', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to update widget',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a widget and all its related data.
     */
    public function deleteWidget(Widget $widget): array
    {
        try {
            return DB::transaction(function () use ($widget) {
                // Delete all related data
                $widget->configurations()->delete();
                $widget->behaviorSettings()->delete();
                $widget->quickResponses()->delete();
                $widget->conversationStarters()->delete();
                $widget->operatingHours()->delete();
                $widget->aiModels()->delete();
                $widget->knowledgeBases()->delete();
                $widget->languages()->delete();
                $widget->analytics()->delete();
                $widget->conversations()->delete();
                $widget->assets()->delete();
                $widget->customCss()->delete();

                // Delete the widget
                $widget->delete();

                return [
                    'success' => true,
                    'message' => 'Widget deleted successfully'
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to delete widget', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to delete widget',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Toggle widget status (enabled/disabled).
     */
    public function toggleStatus(Widget $widget): array
    {
        try {
            $widget->update([
                'enabled' => !$widget->enabled,
                'last_updated_at' => now(),
            ]);

            return [
                'success' => true,
                'message' => 'Widget status updated successfully',
                'data' => [
                    'id' => $widget->id,
                    'enabled' => $widget->enabled,
                    'last_updated_at' => $widget->last_updated_at->toISOString(),
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to toggle widget status', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to toggle widget status',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Duplicate a widget with all its configuration.
     */
    public function duplicateWidget(Widget $originalWidget, array $data): array
    {
        try {
            return DB::transaction(function () use ($originalWidget, $data) {
                // Create new widget
                $newWidget = Widget::create([
                    'user_id' => $originalWidget->user_id,
                    'name' => $data['name'],
                    'description' => $data['description'] ?? $originalWidget->description,
                    'enabled' => $data['enabled'] ?? false,
                    'status' => 'draft',
                    'domain' => $originalWidget->domain,
                    'configuration' => $originalWidget->configuration,
                    'last_updated_at' => now(),
                    'version' => 1,
                ]);

                // Copy relationships based on options
                if ($data['copy_configuration'] ?? true) {
                    $this->copyWidgetConfiguration($originalWidget, $newWidget);
                }

                if ($data['copy_behavior_settings'] ?? true) {
                    $this->copyBehaviorSettings($originalWidget, $newWidget);
                }

                if ($data['copy_content'] ?? true) {
                    $this->copyWidgetContent($originalWidget, $newWidget);
                }

                // Load relationships for response
                $newWidget->load([
                    'activeConfiguration',
                    'behaviorSettings',
                    'primaryAiModel.aiModel'
                ]);

                return [
                    'success' => true,
                    'message' => 'Widget duplicated successfully',
                    'data' => $this->transformWidgetForFrontend($newWidget)
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to duplicate widget', [
                'original_widget_id' => $originalWidget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to duplicate widget',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Initialize default relationships for a new widget.
     */
    private function initializeWidgetDefaults(Widget $widget, array $data): void
    {
        // Create default configuration
        $configData = $data['configuration'] ?? [];
        WidgetConfiguration::create([
            'widget_id' => $widget->id,
            'version' => 1,
            'is_active' => true,
            'theme' => $configData['theme'] ?? 'light',
            'primary_color' => $configData['primaryColor'] ?? '#3b82f6',
            'position' => $configData['position'] ?? 'bottom-right',
            'size' => $configData['size'] ?? 'medium',
            'title' => $configData['title'] ?? 'AI Assistant',
            'subtitle' => $configData['subtitle'] ?? 'Powered by ChatWidget Pro',
            'welcome_message' => $configData['welcomeMessage'] ?? 'Hello! How can I help you today?',
            'placeholder' => $configData['placeholder'] ?? 'Type your message...',
            'enabled' => $configData['enabled'] ?? true,
            'show_branding' => $configData['showBranding'] ?? true,
            'selected_model_id' => $configData['selectedModelId'] ?? null,
            'knowledge_base_config' => $configData['knowledgeBase'] ?? null,
        ]);

        // Create default behavior settings
        WidgetBehaviorSetting::create([
            'widget_id' => $widget->id,
            'sound_notifications' => true,
            'typing_indicators' => true,
            'message_persistence' => true,
            'auto_minimize' => false,
            'operating_hours_enabled' => false,
            'timezone' => 'UTC',
            'collect_offline_messages' => true,
            'file_uploads_enabled' => false,
            'emoji_support' => true,
            'link_previews' => true,
            'voice_messages' => false,
            'immediate_trigger' => true,
            'time_delay_trigger' => false,
            'scroll_trigger' => false,
            'exit_intent_trigger' => false,
            'new_visitors_only' => false,
            'returning_visitors' => false,
            'geographic_targeting' => false,
            'page_rules' => 'all',
        ]);
    }

    /**
     * Update widget configuration.
     */
    private function updateWidgetConfiguration(Widget $widget, array $configData): void
    {
        $activeConfig = $widget->activeConfiguration;

        if ($activeConfig) {
            $activeConfig->update(array_filter([
                'theme' => $configData['theme'] ?? null,
                'primary_color' => $configData['primaryColor'] ?? null,
                'position' => $configData['position'] ?? null,
                'size' => $configData['size'] ?? null,
                'title' => $configData['title'] ?? null,
                'subtitle' => $configData['subtitle'] ?? null,
                'welcome_message' => $configData['welcomeMessage'] ?? null,
                'placeholder' => $configData['placeholder'] ?? null,
                'enabled' => $configData['enabled'] ?? null,
                'show_branding' => $configData['showBranding'] ?? null,
                'selected_model_id' => $configData['selectedModelId'] ?? null,
                'knowledge_base_config' => $configData['knowledgeBase'] ?? null,
            ], fn($value) => $value !== null));
        }

        // Also update the widget's configuration JSON for backward compatibility
        $widget->update([
            'configuration' => array_merge($widget->configuration ?? [], $configData)
        ]);
    }

    /**
     * Copy widget configuration to a new widget.
     */
    private function copyWidgetConfiguration(Widget $source, Widget $target): void
    {
        $sourceConfig = $source->activeConfiguration;
        if ($sourceConfig) {
            WidgetConfiguration::create([
                'widget_id' => $target->id,
                'version' => 1,
                'is_active' => true,
                'theme' => $sourceConfig->theme,
                'primary_color' => $sourceConfig->primary_color,
                'position' => $sourceConfig->position,
                'size' => $sourceConfig->size,
                'title' => $sourceConfig->title,
                'subtitle' => $sourceConfig->subtitle,
                'welcome_message' => $sourceConfig->welcome_message,
                'placeholder' => $sourceConfig->placeholder,
                'enabled' => $sourceConfig->enabled,
                'show_branding' => $sourceConfig->show_branding,
                'selected_model_id' => $sourceConfig->selected_model_id,
                'knowledge_base_config' => $sourceConfig->knowledge_base_config,
            ]);
        }
    }

    /**
     * Copy behavior settings to a new widget.
     */
    private function copyBehaviorSettings(Widget $source, Widget $target): void
    {
        $sourceBehavior = $source->behaviorSettings;
        if ($sourceBehavior) {
            WidgetBehaviorSetting::create($sourceBehavior->toArray() + [
                'widget_id' => $target->id,
                'id' => null,
                'created_at' => null,
                'updated_at' => null,
            ]);
        }
    }

    /**
     * Copy widget content (quick responses, conversation starters) to a new widget.
     */
    private function copyWidgetContent(Widget $source, Widget $target): void
    {
        // Copy quick responses
        foreach ($source->quickResponses as $response) {
            $target->quickResponses()->create([
                'text' => $response->text,
                'category' => $response->category,
                'enabled' => $response->enabled,
                'sort_order' => $response->sort_order,
            ]);
        }

        // Copy conversation starters
        foreach ($source->conversationStarters as $starter) {
            $target->conversationStarters()->create([
                'message' => $starter->message,
                'trigger_type' => $starter->trigger_type,
                'delay_seconds' => $starter->delay_seconds,
                'page_pattern' => $starter->page_pattern,
                'enabled' => $starter->enabled,
                'sort_order' => $starter->sort_order,
            ]);
        }
    }

    /**
     * Transform widget data for frontend consumption.
     */
    private function transformWidgetForFrontend(Widget $widget, bool $includeDetails = false): array
    {
        $data = [
            'id' => $widget->id,
            'user_id' => $widget->user_id,
            'name' => $widget->name,
            'description' => $widget->description,
            'enabled' => $widget->enabled,
            'status' => $widget->status,
            'domain' => $widget->domain,
            'configuration' => $widget->getConfigurationWithDefaults(),
            'last_updated_at' => $widget->last_updated_at?->toISOString(),
            'published_at' => $widget->published_at?->toISOString(),
            'version' => $widget->version,
            'created_at' => $widget->created_at->toISOString(),
            'updated_at' => $widget->updated_at->toISOString(),
        ];

        if ($includeDetails) {
            $data['quick_responses'] = $widget->quickResponses?->map(fn($qr) => [
                'id' => $qr->id,
                'text' => $qr->text,
                'category' => $qr->category,
                'enabled' => $qr->enabled,
                'sort_order' => $qr->sort_order,
            ]) ?? [];

            $data['conversation_starters'] = $widget->conversationStarters?->map(fn($cs) => [
                'id' => $cs->id,
                'message' => $cs->message,
                'trigger_type' => $cs->trigger_type,
                'delay_seconds' => $cs->delay_seconds,
                'page_pattern' => $cs->page_pattern,
                'enabled' => $cs->enabled,
                'sort_order' => $cs->sort_order,
            ]) ?? [];

            $data['behavior_settings'] = $widget->behaviorSettings ? [
                'sound_notifications' => $widget->behaviorSettings->sound_notifications,
                'typing_indicators' => $widget->behaviorSettings->typing_indicators,
                'message_persistence' => $widget->behaviorSettings->message_persistence,
                'auto_minimize' => $widget->behaviorSettings->auto_minimize,
                'operating_hours_enabled' => $widget->behaviorSettings->operating_hours_enabled,
                'timezone' => $widget->behaviorSettings->timezone,
                'offline_message' => $widget->behaviorSettings->offline_message,
                'collect_offline_messages' => $widget->behaviorSettings->collect_offline_messages,
                'file_uploads_enabled' => $widget->behaviorSettings->file_uploads_enabled,
                'emoji_support' => $widget->behaviorSettings->emoji_support,
                'link_previews' => $widget->behaviorSettings->link_previews,
                'voice_messages' => $widget->behaviorSettings->voice_messages,
            ] : null;
        }

        return $data;
    }
}
