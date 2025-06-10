<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiProvidersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WidgetController;
use App\Http\Controllers\WidgetConfigurationController;
use App\Http\Controllers\WidgetTemplateController;
use App\Http\Controllers\WidgetContentController;
use App\Http\Controllers\WidgetBehaviorController;
use App\Http\Controllers\WidgetAnalyticsController;
use App\Http\Controllers\WidgetChatController;

// Authentication Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Legacy user route for compatibility
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// AI Providers Routes
Route::middleware('auth:sanctum')->group(function () {
    // Provider management
    Route::get('/ai-providers', [AiProvidersController::class, 'index']);
    Route::post('/ai-providers', [AiProvidersController::class, 'store']);
    Route::put('/ai-providers/{aiProvider}', [AiProvidersController::class, 'update']);
    Route::delete('/ai-providers/{aiProvider}', [AiProvidersController::class, 'destroy']);

    // Provider testing and model management
    Route::post('/ai-providers/{aiProvider}/test', [AiProvidersController::class, 'testConnection']);
    Route::post('/ai-providers/{aiProvider}/fetch-models', [AiProvidersController::class, 'fetchModels']);
    Route::get('/ai-providers/{aiProvider}/models', [AiProvidersController::class, 'getModels']);

    // Model management
    Route::put('/ai-models/{aiModel}', [AiProvidersController::class, 'updateModel']);
    Route::post('/ai-models/{aiModel}/chat', [AiProvidersController::class, 'chatCompletion']);
    Route::get('/ai-models', [AiProvidersController::class, 'getAllModels']);
    Route::get('/ai-models/active', [AiProvidersController::class, 'getActiveModels']);

    // Widget management
    Route::apiResource('widgets', WidgetController::class);
    Route::patch('/widgets/{widget}/toggle', [WidgetController::class, 'toggleStatus']);
    Route::post('/widgets/{widget}/duplicate', [WidgetController::class, 'duplicate']);
    Route::patch('/widgets/{widget}/publish', [WidgetController::class, 'publish']);
    Route::get('/widgets/{widget}/statistics', [WidgetController::class, 'statistics']);
    Route::get('/widgets/{widget}/statistics/export', [WidgetController::class, 'exportStatistics']);

    // Widget Configuration Routes
    Route::get('/widgets/{widget}/configurations', [WidgetConfigurationController::class, 'index']);
    Route::get('/widgets/{widget}/configurations/active', [WidgetConfigurationController::class, 'active']);
    Route::post('/widgets/{widget}/configurations', [WidgetConfigurationController::class, 'store']);
    Route::put('/widgets/{widget}/configurations', [WidgetConfigurationController::class, 'update']);
    Route::post('/widgets/{widget}/configurations/{configuration}/activate', [WidgetConfigurationController::class, 'activate']);
    Route::post('/widgets/{widget}/configurations/rollback', [WidgetConfigurationController::class, 'rollback']);
    Route::get('/widgets/{widget}/configurations/compare', [WidgetConfigurationController::class, 'compare']);
    Route::get('/widgets/{widget}/configurations/history', [WidgetConfigurationController::class, 'history']);
    Route::delete('/widgets/{widget}/configurations/{configuration}', [WidgetConfigurationController::class, 'destroy']);

    // Widget Templates Routes
    Route::get('/widget-templates', [WidgetTemplateController::class, 'index']);
    Route::get('/widget-templates/categories', [WidgetTemplateController::class, 'categories']);
    Route::get('/widget-templates/{template}', [WidgetTemplateController::class, 'show']);

    // Widget Content Routes (Quick Responses & Conversation Starters)
    Route::get('/widgets/{widget}/content', [WidgetContentController::class, 'index']);
    Route::get('/widgets/{widget}/quick-responses', [WidgetContentController::class, 'quickResponses']);
    Route::post('/widgets/{widget}/quick-responses', [WidgetContentController::class, 'storeQuickResponse']);
    Route::put('/widgets/{widget}/quick-responses/{quickResponse}', [WidgetContentController::class, 'updateQuickResponse']);
    Route::delete('/widgets/{widget}/quick-responses/{quickResponse}', [WidgetContentController::class, 'destroyQuickResponse']);
    Route::post('/widgets/{widget}/quick-responses/reorder', [WidgetContentController::class, 'reorderQuickResponses']);

    Route::get('/widgets/{widget}/conversation-starters', [WidgetContentController::class, 'conversationStarters']);
    Route::post('/widgets/{widget}/conversation-starters', [WidgetContentController::class, 'storeConversationStarter']);
    Route::put('/widgets/{widget}/conversation-starters/{conversationStarter}', [WidgetContentController::class, 'updateConversationStarter']);
    Route::delete('/widgets/{widget}/conversation-starters/{conversationStarter}', [WidgetContentController::class, 'destroyConversationStarter']);
    Route::post('/widgets/{widget}/conversation-starters/reorder', [WidgetContentController::class, 'reorderConversationStarters']);

    // Widget Behavior Routes
    Route::get('/widgets/{widget}/behavior', [WidgetBehaviorController::class, 'show']);
    Route::post('/widgets/{widget}/behavior', [WidgetBehaviorController::class, 'store']);
    Route::put('/widgets/{widget}/behavior', [WidgetBehaviorController::class, 'update']);
    Route::delete('/widgets/{widget}/behavior', [WidgetBehaviorController::class, 'destroy']);
    Route::get('/widgets/{widget}/operating-hours', [WidgetBehaviorController::class, 'getOperatingHours']);
    Route::put('/widgets/{widget}/operating-hours', [WidgetBehaviorController::class, 'updateOperatingHours']);
    Route::get('/widgets/{widget}/operating-status', [WidgetBehaviorController::class, 'checkOperatingStatus']);

    // Widget Analytics Routes
    Route::get('/widgets/{widget}/analytics', [WidgetAnalyticsController::class, 'index']);
    Route::get('/widgets/{widget}/analytics/conversations', [WidgetAnalyticsController::class, 'conversations']);
    Route::get('/widgets/{widget}/analytics/messages', [WidgetAnalyticsController::class, 'messages']);
    Route::get('/widgets/{widget}/analytics/summary', [WidgetAnalyticsController::class, 'summary']);
    Route::get('/widgets/{widget}/analytics/export', [WidgetAnalyticsController::class, 'export']);
    Route::post('/widgets/{widget}/analytics/record-conversation', [WidgetAnalyticsController::class, 'recordConversation']);
    Route::post('/widgets/{widget}/analytics/record-message', [WidgetAnalyticsController::class, 'recordMessage']);
    Route::post('/widgets/{widget}/analytics/record-response-time', [WidgetAnalyticsController::class, 'recordResponseTime']);

    // Widget Chat Routes
    Route::get('/widgets/{widget}/conversations', [WidgetChatController::class, 'conversations']);
    Route::post('/widgets/{widget}/conversations', [WidgetChatController::class, 'createConversation']);
    Route::get('/widgets/{widget}/conversations/{conversation}/messages', [WidgetChatController::class, 'messages']);
    Route::post('/widgets/{widget}/conversations/{conversation}/messages', [WidgetChatController::class, 'sendMessage']);
});
