<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetCustomCss extends Model
{
    protected $fillable = [
        'widget_id',
        'css_rules',
        'is_active',
        'name',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the widget that owns this custom CSS.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only active CSS rules.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get active CSS rules for a widget.
     */
    public static function getActiveForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->where('is_active', true)
                    ->orderBy('created_at')
                    ->get();
    }

    /**
     * Get all CSS rules for a widget.
     */
    public static function getForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->orderBy('is_active', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->get();
    }

    /**
     * Create custom CSS for a widget.
     */
    public static function createForWidget(int $widgetId, string $cssRules, array $options = []): self
    {
        return static::create([
            'widget_id' => $widgetId,
            'css_rules' => $cssRules,
            'is_active' => $options['is_active'] ?? true,
            'name' => $options['name'] ?? null,
            'description' => $options['description'] ?? null,
        ]);
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(): bool
    {
        return $this->update(['is_active' => !$this->is_active]);
    }

    /**
     * Activate this CSS rule set.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate this CSS rule set.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Get compiled CSS for a widget (all active CSS rules combined).
     */
    public static function getCompiledCssForWidget(int $widgetId): string
    {
        $cssRules = static::getActiveForWidget($widgetId);

        return $cssRules->pluck('css_rules')->implode("\n\n");
    }

    /**
     * Validate CSS syntax (basic validation).
     */
    public function validateCss(): array
    {
        $errors = [];
        $css = $this->css_rules;

        // Basic validation checks
        $openBraces = substr_count($css, '{');
        $closeBraces = substr_count($css, '}');

        if ($openBraces !== $closeBraces) {
            $errors[] = 'Mismatched braces: ' . $openBraces . ' opening, ' . $closeBraces . ' closing';
        }

        // Check for common CSS syntax issues
        if (preg_match('/[{}]\s*[{}]/', $css)) {
            $errors[] = 'Empty CSS rules detected';
        }

        // Check for unclosed strings
        $singleQuotes = substr_count($css, "'");
        $doubleQuotes = substr_count($css, '"');

        if ($singleQuotes % 2 !== 0) {
            $errors[] = 'Unclosed single quotes detected';
        }

        if ($doubleQuotes % 2 !== 0) {
            $errors[] = 'Unclosed double quotes detected';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Minify CSS rules.
     */
    public function getMinifiedCss(): string
    {
        $css = $this->css_rules;

        // Remove comments
        $css = preg_replace('/\/\*.*?\*\//s', '', $css);

        // Remove unnecessary whitespace
        $css = preg_replace('/\s+/', ' ', $css);

        // Remove spaces around specific characters
        $css = preg_replace('/\s*([{}:;,>+~])\s*/', '$1', $css);

        return trim($css);
    }

    /**
     * Get CSS statistics.
     */
    public function getCssStats(): array
    {
        $css = $this->css_rules;

        return [
            'characters' => strlen($css),
            'lines' => substr_count($css, "\n") + 1,
            'rules' => substr_count($css, '{'),
            'selectors' => preg_match_all('/[^{}]+\{/', $css),
            'minified_size' => strlen($this->getMinifiedCss()),
        ];
    }

    /**
     * Get custom CSS data for frontend.
     */
    public function toCssData(): array
    {
        $validation = $this->validateCss();
        $stats = $this->getCssStats();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'cssRules' => $this->css_rules,
            'isActive' => $this->is_active,
            'validation' => $validation,
            'stats' => $stats,
            'minifiedCss' => $this->getMinifiedCss(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
