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
        Schema::create('widget_custom_csses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->text('css_rules');
            $table->boolean('is_active')->default(true);
            $table->string('name')->nullable(); // Optional name for the CSS rule set
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['widget_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_custom_csses');
    }
};
