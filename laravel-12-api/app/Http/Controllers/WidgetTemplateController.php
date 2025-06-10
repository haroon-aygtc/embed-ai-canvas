<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\WidgetTemplateService;

class WidgetTemplateController extends Controller
{
    public function __construct(
        private WidgetTemplateService $templateService
    ) {}

    /**
     * Get all widget templates.
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $popular = $request->query('popular');

        if ($popular === 'true') {
            $result = $this->templateService->getPopularTemplates();
        } elseif ($category) {
            $result = $this->templateService->getTemplatesByCategory($category);
        } else {
            $result = $this->templateService->getAllTemplates();
        }

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }

    /**
     * Get a specific template.
     */
    public function show(int $templateId): JsonResponse
    {
        $result = $this->templateService->getTemplate($templateId);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 404);
    }

    /**
     * Get template categories.
     */
    public function categories(): JsonResponse
    {
        $result = $this->templateService->getCategories();

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], 500);
    }
}
