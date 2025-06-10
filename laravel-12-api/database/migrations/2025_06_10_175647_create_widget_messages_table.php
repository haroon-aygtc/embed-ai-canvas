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
        Schema::create('widget_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('widget_conversations')->onDelete('cascade');
            $table->text('content');
            $table->boolean('is_user')->default(true); // true = user message, false = AI response
            $table->integer('response_time')->nullable(); // Response time in milliseconds
            $table->string('ai_model_used')->nullable(); // Which AI model generated the response
            $table->integer('tokens_used')->nullable(); // Tokens consumed for AI response
            $table->json('metadata')->nullable(); // Additional message metadata
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
            $table->index(['conversation_id', 'is_user']);
            $table->index('ai_model_used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_messages');
    }
};
