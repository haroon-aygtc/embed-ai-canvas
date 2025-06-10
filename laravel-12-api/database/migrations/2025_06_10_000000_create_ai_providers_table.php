<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('provider_name', [
                'openai',
                'google',
                'anthropic',
                'mistral',
                'meta',
                'cohere',
                'huggingface',
                'perplexity',
                'openrouter',
                'xai',
                'groq',
                'codestral'
            ]);
            $table->text('api_key');
            $table->string('base_url', 500)->nullable();
            $table->string('region', 100)->nullable();
            $table->enum('status', ['unconfigured', 'configured', 'ready', 'error'])->default('unconfigured');
            $table->timestamp('last_tested_at')->nullable();
            $table->json('test_result')->nullable();
            $table->integer('model_count')->default(0);
            $table->json('configuration')->nullable(); // Additional provider-specific config
            $table->timestamps();
            
            $table->unique(['user_id', 'provider_name']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_providers');
    }
};
