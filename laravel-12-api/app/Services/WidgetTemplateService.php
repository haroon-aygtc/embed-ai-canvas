<?php

namespace App\Services;

use App\Models\WidgetTemplate;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Exception;

class WidgetTemplateService
{
    /**
     * Get all available widget templates.
     */
    public function getAllTemplates(): array
    {
        try {
            $templates = WidgetTemplate::orderBy('is_popular', 'desc')
                ->orderBy('name')
                ->get();

            return [
                'success' => true,
                'data' => $templates->map(function ($template) {
                    return $this->transformTemplateForFrontend($template);
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch widget templates', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch templates',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get templates by category.
     */
    public function getTemplatesByCategory(string $category): array
    {
        try {
            $templates = WidgetTemplate::where('category', $category)
                ->orderBy('is_popular', 'desc')
                ->orderBy('name')
                ->get();

            return [
                'success' => true,
                'data' => $templates->map(function ($template) {
                    return $this->transformTemplateForFrontend($template);
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch templates by category', [
                'category' => $category,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch templates',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get popular templates.
     */
    public function getPopularTemplates(): array
    {
        try {
            $templates = WidgetTemplate::where('is_popular', true)
                ->orderBy('name')
                ->get();

            return [
                'success' => true,
                'data' => $templates->map(function ($template) {
                    return $this->transformTemplateForFrontend($template);
                })
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch popular templates', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch popular templates',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get a specific template by ID.
     */
    public function getTemplate(int $templateId): array
    {
        try {
            $template = WidgetTemplate::findOrFail($templateId);

            return [
                'success' => true,
                'data' => $this->transformTemplateForFrontend($template)
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch template', [
                'template_id' => $templateId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Template not found',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new template.
     */
    public function createTemplate(array $data): array
    {
        try {
            $template = WidgetTemplate::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'category' => $data['category'],
                'preview_image' => $data['preview_image'] ?? null,
                'is_popular' => $data['is_popular'] ?? false,
                'configuration_json' => json_encode($data['configuration'])
            ]);

            return [
                'success' => true,
                'message' => 'Template created successfully',
                'data' => $this->transformTemplateForFrontend($template)
            ];
        } catch (Exception $e) {
            Log::error('Failed to create template', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create template',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update an existing template.
     */
    public function updateTemplate(int $templateId, array $data): array
    {
        try {
            $template = WidgetTemplate::findOrFail($templateId);

            $updateData = array_filter([
                'name' => $data['name'] ?? null,
                'description' => $data['description'] ?? null,
                'category' => $data['category'] ?? null,
                'preview_image' => $data['preview_image'] ?? null,
                'is_popular' => $data['is_popular'] ?? null,
            ], fn($value) => $value !== null);

            if (isset($data['configuration'])) {
                $updateData['configuration_json'] = json_encode($data['configuration']);
            }

            $template->update($updateData);

            return [
                'success' => true,
                'message' => 'Template updated successfully',
                'data' => $this->transformTemplateForFrontend($template)
            ];
        } catch (Exception $e) {
            Log::error('Failed to update template', [
                'template_id' => $templateId,
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to update template',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a template.
     */
    public function deleteTemplate(int $templateId): array
    {
        try {
            $template = WidgetTemplate::findOrFail($templateId);
            $template->delete();

            return [
                'success' => true,
                'message' => 'Template deleted successfully'
            ];
        } catch (Exception $e) {
            Log::error('Failed to delete template', [
                'template_id' => $templateId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to delete template',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get available template categories.
     */
    public function getCategories(): array
    {
        try {
            $categories = WidgetTemplate::distinct()
                ->pluck('category')
                ->filter()
                ->sort()
                ->values();

            return [
                'success' => true,
                'data' => $categories
            ];
        } catch (Exception $e) {
            Log::error('Failed to fetch template categories', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Transform template for frontend consumption.
     */
    private function transformTemplateForFrontend(WidgetTemplate $template): array
    {
        return [
            'id' => $template->id,
            'name' => $template->name,
            'description' => $template->description,
            'category' => $template->category,
            'preview' => $template->preview_image,
            'popular' => $template->is_popular,
            'config' => json_decode($template->configuration_json, true),
            'created_at' => $template->created_at->toISOString(),
            'updated_at' => $template->updated_at->toISOString(),
        ];
    }
}
