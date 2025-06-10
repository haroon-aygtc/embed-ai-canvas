<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetConfiguration;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class WidgetConfigurationService
{
    /**
     * Get all configurations for a widget.
     */
    public function getConfigurations(Widget $widget): array
    {
        try {
            $configurations = $widget->configurations()
                ->orderBy('version', 'desc')
                ->get();

            return [
                'success' => true,
                'data' => $configurations->map(function ($config) {
                    return $this->transformConfigurationForFrontend($config);
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch configurations for widget', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch configurations',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get the active configuration for a widget.
     */
    public function getActiveConfiguration(Widget $widget): array
    {
        try {
            $activeConfig = $widget->activeConfiguration;

            if (!$activeConfig) {
                return [
                    'success' => false,
                    'message' => 'No active configuration found for this widget'
                ];
            }

            return [
                'success' => true,
                'data' => $this->transformConfigurationForFrontend($activeConfig)
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch active configuration for widget', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch active configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new configuration version.
     */
    public function createConfiguration(Widget $widget, array $data): array
    {
        try {
            return DB::transaction(function () use ($widget, $data) {
                // Get the next version number
                $nextVersion = $widget->configurations()->max('version') + 1;

                // Deactivate current active configuration if making this one active
                if ($data['is_active'] ?? false) {
                    $widget->configurations()->update(['is_active' => false]);
                }

                // Create new configuration
                $configuration = WidgetConfiguration::create([
                    'widget_id' => $widget->id,
                    'version' => $nextVersion,
                    'is_active' => $data['is_active'] ?? false,
                    'theme' => $data['theme'] ?? 'light',
                    'primary_color' => $data['primary_color'] ,
                    'position' => $data['position'] ,
                    'size' => $data['size'] ,
                    'title' => $data['title'],
                    'subtitle' => $data['subtitle'],
                    'welcome_message' => $data['welcome_message'] ?? null,
                    'placeholder' => $data['placeholder'] ,
                    'enabled' => $data['enabled'] ?? true,
                    'show_branding' => $data['show_branding'] ?? true,
                    'selected_model_id' => $data['selected_model_id'] ?? null,
                    'knowledge_base_config' => $data['knowledge_base_config'] ?? null,
                    'additional_config' => $data['additional_config'] ?? null,
                ]);

                // Update widget's last_updated_at
                $widget->update(['last_updated_at' => now()]);

                return [
                    'success' => true,
                    'message' => 'Configuration created successfully',
                    'data' => $this->transformConfigurationForFrontend($configuration)
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to create configuration for widget', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update the active configuration.
     */
    public function updateActiveConfiguration(Widget $widget, array $data): array
    {
        try {
            return DB::transaction(function () use ($widget, $data) {
                $activeConfig = $widget->activeConfiguration;

                if (!$activeConfig) {
                    return [
                        'success' => false,
                        'message' => 'No active configuration found for this widget'
                    ];
                }

                // Update the configuration
                $activeConfig->update(array_filter([
                    'theme' => $data['theme'] ?? null,
                    'primary_color' => $data['primary_color'] ?? null,
                    'position' => $data['position'] ?? null,
                    'size' => $data['size'] ?? null,
                    'title' => $data['title'] ?? null,
                    'subtitle' => $data['subtitle'] ?? null,
                    'welcome_message' => $data['welcome_message'] ?? null,
                    'placeholder' => $data['placeholder'] ?? null,
                    'enabled' => $data['enabled'] ?? null,
                    'show_branding' => $data['show_branding'] ?? null,
                    'selected_model_id' => $data['selected_model_id'] ?? null,
                    'knowledge_base_config' => $data['knowledge_base_config'] ?? null,
                    'additional_config' => $data['additional_config'] ?? null,
                ], fn($value) => $value !== null));

                // Update widget's last_updated_at
                $widget->update(['last_updated_at' => now()]);

                return [
                    'success' => true,
                    'message' => 'Configuration updated successfully',
                    'data' => $this->transformConfigurationForFrontend($activeConfig->fresh())
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to update active configuration for widget', [
                'widget_id' => $widget->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to update configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Activate a specific configuration version.
     */
    public function activateConfiguration(WidgetConfiguration $configuration): array
    {
        try {
            return DB::transaction(function () use ($configuration) {
                // Deactivate all other configurations for this widget
                $configuration->widget->configurations()->update(['is_active' => false]);

                // Activate the specified configuration
                $configuration->update(['is_active' => true]);

                // Update widget's last_updated_at
                $configuration->widget->update(['last_updated_at' => now()]);

                return [
                    'success' => true,
                    'message' => 'Configuration activated successfully',
                    'data' => $this->transformConfigurationForFrontend($configuration->fresh())
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to activate configuration', [
                'configuration_id' => $configuration->id,
                'widget_id' => $configuration->widget_id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to activate configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Rollback to a previous configuration version.
     */
    public function rollbackToVersion(Widget $widget, int $version): array
    {
        try {
            return DB::transaction(function () use ($widget, $version) {
                $targetConfig = $widget->configurations()->where('version', $version)->first();

                if (!$targetConfig) {
                    return [
                        'success' => false,
                        'message' => "Configuration version {$version} not found"
                    ];
                }

                // Create a new configuration based on the target version
                $nextVersion = $widget->configurations()->max('version') + 1;

                // Deactivate current active configuration
                $widget->configurations()->update(['is_active' => false]);

                // Create new configuration with data from target version
                $newConfig = WidgetConfiguration::create([
                    'widget_id' => $widget->id,
                    'version' => $nextVersion,
                    'is_active' => true,
                    'theme' => $targetConfig->theme,
                    'primary_color' => $targetConfig->primary_color,
                    'position' => $targetConfig->position,
                    'size' => $targetConfig->size,
                    'title' => $targetConfig->title,
                    'subtitle' => $targetConfig->subtitle,
                    'welcome_message' => $targetConfig->welcome_message,
                    'placeholder' => $targetConfig->placeholder,
                    'enabled' => $targetConfig->enabled,
                    'show_branding' => $targetConfig->show_branding,
                    'selected_model_id' => $targetConfig->selected_model_id,
                    'knowledge_base_config' => $targetConfig->knowledge_base_config,
                    'additional_config' => $targetConfig->additional_config,
                ]);

                // Update widget's last_updated_at
                $widget->update(['last_updated_at' => now()]);

                return [
                    'success' => true,
                    'message' => "Successfully rolled back to version {$version}",
                    'data' => $this->transformConfigurationForFrontend($newConfig)
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to rollback configuration for widget', [
                'widget_id' => $widget->id,
                'version' => $version,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to rollback configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Compare two configuration versions.
     */
    public function compareVersions(Widget $widget, int $version1, int $version2): array
    {
        try {
            $config1 = $widget->configurations()->where('version', $version1)->first();
            $config2 = $widget->configurations()->where('version', $version2)->first();

            if (!$config1 || !$config2) {
                return [
                    'success' => false,
                    'message' => 'One or both configuration versions not found'
                ];
            }

            $differences = $this->calculateConfigurationDifferences($config1, $config2);

            return [
                'success' => true,
                'data' => [
                    'version1' => $version1,
                    'version2' => $version2,
                    'config1' => $this->transformConfigurationForFrontend($config1),
                    'config2' => $this->transformConfigurationForFrontend($config2),
                    'differences' => $differences
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to compare configuration versions', [
                'widget_id' => $widget->id,
                'version1' => $version1,
                'version2' => $version2,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to compare configuration versions',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get configuration version history.
     */
    public function getVersionHistory(Widget $widget): array
    {
        try {
            $configurations = $widget->configurations()
                ->orderBy('version', 'desc')
                ->get();

            return [
                'success' => true,
                'data' => $configurations->map(function ($config) {
                    return [
                        'id' => $config->id,
                        'version' => $config->version,
                        'is_active' => $config->is_active,
                        'created_at' => $config->created_at->toISOString(),
                        'updated_at' => $config->updated_at->toISOString(),
                        'summary' => $this->getConfigurationSummary($config)
                    ];
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch version history for widget', [
                'widget_id' => $widget->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch version history',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a configuration version.
     */
    public function deleteConfiguration(WidgetConfiguration $configuration): array
    {
        try {
            if ($configuration->is_active) {
                return [
                    'success' => false,
                    'message' => 'Cannot delete the active configuration'
                ];
            }

            $configuration->delete();

            return [
                'success' => true,
                'message' => 'Configuration deleted successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to delete configuration', [
                'configuration_id' => $configuration->id,
                'widget_id' => $configuration->widget_id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to delete configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Transform configuration data for frontend consumption.
     */
    private function transformConfigurationForFrontend(WidgetConfiguration $config): array
    {
        return [
            'id' => $config->id,
            'widget_id' => $config->widget_id,
            'version' => $config->version,
            'is_active' => $config->is_active,
            'theme' => $config->theme,
            'primary_color' => $config->primary_color,
            'position' => $config->position,
            'size' => $config->size,
            'title' => $config->title,
            'subtitle' => $config->subtitle,
            'welcome_message' => $config->welcome_message,
            'placeholder' => $config->placeholder,
            'enabled' => $config->enabled,
            'show_branding' => $config->show_branding,
            'selected_model_id' => $config->selected_model_id,
            'knowledge_base_config' => $config->knowledge_base_config,
            'additional_config' => $config->additional_config,
            'created_at' => $config->created_at->toISOString(),
            'updated_at' => $config->updated_at->toISOString(),
        ];
    }

    /**
     * Calculate differences between two configurations.
     */
    private function calculateConfigurationDifferences(WidgetConfiguration $config1, WidgetConfiguration $config2): array
    {
        $fields = [
            'theme', 'primary_color', 'position', 'size', 'title', 'subtitle',
            'welcome_message', 'placeholder', 'enabled', 'show_branding',
            'selected_model_id', 'knowledge_base_config', 'additional_config'
        ];

        $differences = [];

        foreach ($fields as $field) {
            $value1 = $config1->$field;
            $value2 = $config2->$field;

            if ($value1 !== $value2) {
                $differences[$field] = [
                    'version1_value' => $value1,
                    'version2_value' => $value2,
                    'changed' => true
                ];
            }
        }

        return $differences;
    }

    /**
     * Get a summary of configuration settings.
     */
    private function getConfigurationSummary(WidgetConfiguration $config): array
    {
        return [
            'theme' => $config->theme,
            'position' => $config->position,
            'size' => $config->size,
            'title' => $config->title,
            'enabled' => $config->enabled,
            'has_welcome_message' => !empty($config->welcome_message),
            'has_knowledge_base' => !empty($config->knowledge_base_config),
            'selected_model' => $config->selected_model_id
        ];
    }
}
