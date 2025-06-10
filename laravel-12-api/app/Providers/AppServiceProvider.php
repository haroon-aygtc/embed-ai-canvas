<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AiProviderService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AiProviderService::class, function ($app) {
            return new AiProviderService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
