<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiProvidersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WidgetController;

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


     // Widget management
     Route::apiResource('widgets', WidgetController::class);
     Route::patch('/widgets/{widget}/toggle', [WidgetController::class, 'toggleStatus']);
});
