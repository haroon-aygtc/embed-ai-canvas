<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetLanguage extends Model
{
    protected $fillable = [
        'widget_id',
        'language_code',
        'language_name',
        'enabled',
        'is_primary',
        'auto_detect',
        'real_time_translation',
        'translation_service',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'is_primary' => 'boolean',
        'auto_detect' => 'boolean',
        'real_time_translation' => 'boolean',
    ];

    /**
     * Get the widget that owns this language configuration.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only enabled languages.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope to get only primary language.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Get the primary language for a widget.
     */
    public static function getPrimaryForWidget(int $widgetId): ?self
    {
        return static::where('widget_id', $widgetId)
                    ->where('is_primary', true)
                    ->first();
    }

    /**
     * Get enabled languages for a widget.
     */
    public static function getEnabledForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->enabled()
                    ->orderBy('is_primary', 'desc')
                    ->orderBy('language_name')
                    ->get();
    }

    /**
     * Set this language as primary for the widget.
     */
    public function setPrimary(): bool
    {
        // Remove primary status from other languages for this widget
        static::where('widget_id', $this->widget_id)
              ->where('id', '!=', $this->id)
              ->update(['is_primary' => false]);

        // Set this language as primary
        return $this->update(['is_primary' => true]);
    }

    /**
     * Add or update language for a widget.
     */
    public static function configureForWidget(int $widgetId, string $languageCode, array $config = []): self
    {
        $languageName = static::getLanguageName($languageCode);

        return static::updateOrCreate(
            [
                'widget_id' => $widgetId,
                'language_code' => $languageCode,
            ],
            array_merge([
                'language_name' => $languageName,
                'enabled' => true,
                'is_primary' => false,
                'auto_detect' => true,
                'real_time_translation' => false,
                'translation_service' => 'google',
            ], $config)
        );
    }

    /**
     * Get language name from language code.
     */
    public static function getLanguageName(string $languageCode): string
    {
        $languages = [
            'en' => 'English',
            'es' => 'Spanish',
            'fr' => 'French',
            'de' => 'German',
            'it' => 'Italian',
            'pt' => 'Portuguese',
            'ru' => 'Russian',
            'ja' => 'Japanese',
            'ko' => 'Korean',
            'zh' => 'Chinese',
            'ar' => 'Arabic',
            'hi' => 'Hindi',
            'nl' => 'Dutch',
            'sv' => 'Swedish',
            'da' => 'Danish',
            'no' => 'Norwegian',
            'fi' => 'Finnish',
            'pl' => 'Polish',
            'tr' => 'Turkish',
            'th' => 'Thai',
            'vi' => 'Vietnamese',
        ];

        return $languages[$languageCode] ?? ucfirst($languageCode);
    }

    /**
     * Get available translation services.
     */
    public static function getTranslationServices(): array
    {
        return [
            'google' => 'Google Translate',
            'deepl' => 'DeepL',
            'azure' => 'Azure Translator',
        ];
    }

    /**
     * Create default language configuration for a widget (English).
     */
    public static function createDefaultForWidget(int $widgetId): self
    {
        return static::configureForWidget($widgetId, 'en', [
            'is_primary' => true,
        ]);
    }

    /**
     * Get language data for frontend.
     */
    public function toLanguageData(): array
    {
        return [
            'code' => $this->language_code,
            'name' => $this->language_name,
            'enabled' => $this->enabled,
            'primary' => $this->is_primary,
            'autoDetect' => $this->auto_detect,
            'realTimeTranslation' => $this->real_time_translation,
            'translationService' => $this->translation_service,
        ];
    }
}
