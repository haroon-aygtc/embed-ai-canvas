<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class WidgetAsset extends Model
{
    protected $fillable = [
        'widget_id',
        'type',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
        'alt_text',
        'is_active',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the widget that owns this asset.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only active assets.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by asset type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get available asset types.
     */
    public static function getAssetTypes(): array
    {
        return [
            'logo' => 'Logo',
            'icon' => 'Icon',
            'background' => 'Background Image',
            'avatar' => 'Avatar',
        ];
    }

    /**
     * Get the full URL for this asset.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    /**
     * Get human-readable file size.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if the asset is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Get active asset of a specific type for a widget.
     */
    public static function getActiveAsset(int $widgetId, string $type): ?self
    {
        return static::where('widget_id', $widgetId)
                    ->where('type', $type)
                    ->where('is_active', true)
                    ->first();
    }

    /**
     * Get all active assets for a widget.
     */
    public static function getActiveAssetsForWidget(int $widgetId): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('widget_id', $widgetId)
                    ->where('is_active', true)
                    ->get();
    }

    /**
     * Set this asset as active and deactivate others of the same type.
     */
    public function setActive(): bool
    {
        // Deactivate other assets of the same type for this widget
        static::where('widget_id', $this->widget_id)
              ->where('type', $this->type)
              ->where('id', '!=', $this->id)
              ->update(['is_active' => false]);

        // Activate this asset
        return $this->update(['is_active' => true]);
    }

    /**
     * Create a new asset for a widget.
     */
    public static function createAsset(int $widgetId, string $type, array $fileData): self
    {
        $asset = static::create([
            'widget_id' => $widgetId,
            'type' => $type,
            'file_path' => $fileData['file_path'],
            'original_name' => $fileData['original_name'],
            'mime_type' => $fileData['mime_type'],
            'file_size' => $fileData['file_size'],
            'alt_text' => $fileData['alt_text'] ?? null,
            'is_active' => false,
        ]);

        // Set as active if it's the first asset of this type
        $existingAssets = static::where('widget_id', $widgetId)
                               ->where('type', $type)
                               ->where('id', '!=', $asset->id)
                               ->count();

        if ($existingAssets === 0) {
            $asset->setActive();
        }

        return $asset;
    }

    /**
     * Delete the asset file from storage.
     */
    public function deleteFile(): bool
    {
        if (Storage::exists($this->file_path)) {
            return Storage::delete($this->file_path);
        }

        return true;
    }

    /**
     * Delete the asset and its file.
     */
    public function deleteAsset(): bool
    {
        $this->deleteFile();
        return $this->delete();
    }

    /**
     * Get asset data for frontend.
     */
    public function toAssetData(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'url' => $this->url,
            'originalName' => $this->original_name,
            'mimeType' => $this->mime_type,
            'fileSize' => $this->file_size,
            'formattedFileSize' => $this->formatted_file_size,
            'altText' => $this->alt_text,
            'isActive' => $this->is_active,
            'isImage' => $this->isImage(),
            'createdAt' => $this->created_at->toISOString(),
        ];
    }
}
