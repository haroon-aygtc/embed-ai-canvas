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
        Schema::create('widget_ai_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->foreignId('ai_model_id')->constrained()->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->decimal('temperature', 3, 2)->default(0.70); // 0.00 to 2.00
            $table->integer('max_tokens')->default(1000);
            $table->text('system_prompt')->nullable();
            $table->timestamps();

            $table->index(['widget_id', 'is_primary']);
            $table->index('ai_model_id');
            $table->unique(['widget_id', 'ai_model_id']); // One configuration per widget per model
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_ai_models');
    }
};
