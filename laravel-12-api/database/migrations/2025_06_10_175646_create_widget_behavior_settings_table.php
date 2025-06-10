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
        Schema::create('widget_behavior_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');

            // Basic Behavior Settings
            $table->boolean('sound_notifications')->default(true);
            $table->boolean('typing_indicators')->default(true);
            $table->boolean('message_persistence')->default(true);
            $table->boolean('auto_minimize')->default(false);

            // Operating Hours
            $table->boolean('operating_hours_enabled')->default(false);
            $table->string('timezone')->default('UTC');
            $table->text('offline_message')->nullable();
            $table->boolean('collect_offline_messages')->default(true);

            // Rich Media Settings
            $table->boolean('file_uploads_enabled')->default(true);
            $table->boolean('emoji_support')->default(true);
            $table->boolean('link_previews')->default(false);
            $table->boolean('voice_messages')->default(false);

            // Auto-open Triggers
            $table->boolean('immediate_trigger')->default(false);
            $table->boolean('time_delay_trigger')->default(false);
            $table->boolean('scroll_trigger')->default(false);
            $table->boolean('exit_intent_trigger')->default(false);
            $table->integer('time_delay_seconds')->default(30);
            $table->integer('scroll_percentage')->default(50);

            // Proactive Messaging
            $table->boolean('proactive_messages_enabled')->default(false);

            // Visitor Targeting
            $table->boolean('new_visitors_only')->default(false);
            $table->boolean('returning_visitors')->default(true);
            $table->string('geographic_targeting')->default('all'); // all, us, eu, custom

            // Page Targeting
            $table->enum('page_rules', ['all', 'specific', 'exclude'])->default('all');
            $table->json('url_patterns')->nullable(); // Array of URL patterns

            $table->timestamps();

            $table->index('widget_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_behavior_settings');
    }
};
