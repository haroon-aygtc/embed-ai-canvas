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
        Schema::create('ai_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('model_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('family', 100)->nullable();
            $table->integer('context_window')->nullable();
            $table->integer('max_tokens')->nullable();
            $table->decimal('input_cost', 10, 6)->nullable();
            $table->decimal('output_cost', 10, 6)->nullable();
            $table->json('capabilities')->nullable();
            $table->boolean('is_deprecated')->default(false);
            $table->boolean('is_saved')->default(false);
            $table->boolean('is_active')->default(false);
            $table->boolean('is_default')->default(false);
            $table->date('release_date')->nullable();
            $table->json('metadata')->nullable(); // Additional model-specific data
            $table->timestamps();
            
            $table->unique(['provider_id', 'model_id']);
            $table->index(['provider_id', 'is_active']);
            $table->index(['provider_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_models');
    }
};
