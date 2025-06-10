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
        Schema::create('widget_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->index();
            $table->string('visitor_id')->nullable()->index();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->integer('message_count')->default(0);
            $table->tinyInteger('satisfaction_rating')->nullable(); // 1-5 rating
            $table->boolean('resolved')->default(false);
            $table->string('visitor_ip')->nullable();
            $table->string('visitor_country')->nullable();
            $table->string('referrer_url')->nullable();
            $table->string('page_url')->nullable();
            $table->timestamps();

            $table->index(['widget_id', 'started_at']);
            $table->index(['widget_id', 'resolved']);
            $table->index(['visitor_id', 'started_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_conversations');
    }
};
