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
        Schema::create('widget_operating_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('day_of_week'); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            $table->boolean('enabled')->default(true);
            $table->time('start_time')->default('09:00:00');
            $table->time('end_time')->default('17:00:00');
            $table->string('timezone')->default('UTC');
            $table->timestamps();

            $table->index(['widget_id', 'day_of_week']);
            $table->index(['widget_id', 'enabled']);
            $table->unique(['widget_id', 'day_of_week']); // One record per widget per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_operating_hours');
    }
};
