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
        Schema::create('widget_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->integer('version')->default(1);
            $table->boolean('is_active')->default(false);

            // Appearance Configuration
            $table->enum('theme', ['light', 'dark', 'auto'])->default('light');
            $table->string('primary_color', 7)->default('#3b82f6');
            $table->enum('position', ['bottom-right', 'bottom-left', 'top-right', 'top-left'])->default('bottom-right');
            $table->enum('size', ['small', 'medium', 'large'])->default('medium');

            // Content Configuration - Remove default values for TEXT columns
            $table->text('welcome_message')->nullable();
            $table->string('placeholder')->default('Type your message...');
            $table->string('title')->default('AI Assistant');
            $table->string('subtitle')->default('Powered by ChatWidget Pro');

            // Basic Settings
            $table->boolean('enabled')->default(true);
            $table->boolean('show_branding')->default(true);

            // AI Model Configuration
            $table->string('selected_model_id')->nullable();

            // Knowledge Base Configuration (JSON for complex structure)
            $table->json('knowledge_base_config')->nullable();

            // Additional Configuration (for future extensibility)
            $table->json('additional_config')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['widget_id', 'is_active']);
            $table->index(['widget_id', 'version']);
            $table->unique(['widget_id', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_configurations');
    }
};
