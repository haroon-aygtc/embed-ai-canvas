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
        Schema::create('widget_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('conversations_started')->default(0);
            $table->integer('messages_sent')->default(0);
            $table->integer('messages_received')->default(0);
            $table->decimal('response_time_avg', 8, 2)->nullable(); // Average response time in milliseconds
            $table->decimal('user_satisfaction', 3, 2)->nullable(); // 1.00 to 5.00
            $table->decimal('bounce_rate', 5, 2)->nullable(); // Percentage
            $table->integer('unique_visitors')->default(0);
            $table->integer('returning_visitors')->default(0);
            $table->decimal('resolution_rate', 5, 2)->nullable(); // Percentage
            $table->timestamps();

            $table->index(['widget_id', 'date']);
            $table->unique(['widget_id', 'date']); // One record per widget per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_analytics');
    }
};
