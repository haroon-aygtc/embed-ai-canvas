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
        Schema::create('widget_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('category'); // Support, Sales, Developer, E-commerce, etc.
            $table->string('preview_image')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->json('configuration_json'); // Complete WidgetConfig structure
            $table->timestamps();

            $table->index('category');
            $table->index('is_popular');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_templates');
    }
};
