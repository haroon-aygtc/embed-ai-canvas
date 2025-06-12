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
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->index();
            $table->text('description')->nullable();
            
            // Basic Settings
            $table->string('title')->default('AI Assistant');
            $table->string('subtitle')->nullable();
            $table->text('welcome_message')->default('Hello! How can I help you today?');
            $table->string('placeholder')->default('Type your message...');
            $table->boolean('enabled')->default(true);
            $table->boolean('show_branding')->default(true);
            
            // Appearance Settings
            $table->enum('theme', ['light', 'dark', 'auto'])->default('light');
            $table->string('primary_color', 7)->default('#3b82f6');
            $table->enum('position', ['bottom-right', 'bottom-left', 'top-right', 'top-left'])->default('bottom-right');
            $table->enum('size', ['small', 'medium', 'large'])->default('medium');
            
            // AI Model Configuration
            $table->string('selected_model_id')->nullable();
            $table->string('ai_provider')->nullable();
            
            // Behavior Settings
            $table->boolean('sound_notifications')->default(true);
            $table->boolean('typing_indicators')->default(true);
            $table->boolean('message_persistence')->default(true);
            $table->boolean('auto_minimize')->default(false);
            
            // Operating Hours
            $table->boolean('operating_hours_enabled')->default(false);
            $table->string('timezone')->default('UTC');
            $table->string('offline_message')->default('We\'re currently offline. Leave a message!');
            $table->boolean('collect_offline_messages')->default(true);
            
            // Trigger Settings
            $table->boolean('auto_open_enabled')->default(false);
            $table->enum('auto_open_trigger', ['immediate', 'time', 'scroll', 'exit'])->nullable();
            $table->integer('auto_open_delay')->nullable(); // seconds for time trigger
            $table->integer('auto_open_scroll_percent')->nullable(); // percentage for scroll trigger
            
            // Proactive Messaging
            $table->boolean('proactive_messaging_enabled')->default(false);
            
            // Targeting Settings
            $table->boolean('new_visitors_only')->default(false);
            $table->boolean('returning_visitors_behavior')->default(true);
            $table->string('geographic_targeting')->default('all');
            $table->enum('page_targeting', ['all', 'specific', 'exclude'])->default('all');
            
            // Rich Media Settings
            $table->boolean('file_uploads_enabled')->default(true);
            $table->boolean('emoji_support_enabled')->default(true);
            $table->boolean('link_previews_enabled')->default(false);
            $table->boolean('voice_messages_enabled')->default(false);
            
            // Language Settings
            $table->boolean('auto_detect_language')->default(true);
            $table->string('primary_language', 5)->default('en');
            $table->boolean('real_time_translation')->default(false);
            $table->string('translation_service')->default('google');
            
            // Knowledge Base Settings
            $table->boolean('smart_responses_enabled')->default(true);
            $table->boolean('fallback_to_human')->default(false);
            $table->boolean('show_sources')->default(true);
            $table->boolean('confidence_threshold_enabled')->default(true);
            
            // Status and Metadata
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->json('metadata')->nullable(); // For additional flexible data
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'status']);
            $table->index(['enabled', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
