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
        Schema::create('widget_conversation_starters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->enum('trigger_type', ['first_visit', 'return_visit', 'pricing_page', 'contact_page', 'checkout', 'custom']);
            $table->integer('delay_seconds')->default(3);
            $table->string('page_pattern')->nullable(); // URL pattern for custom triggers
            $table->boolean('enabled')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['widget_id', 'enabled']);
            $table->index(['widget_id', 'trigger_type']);
            $table->index(['widget_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_conversation_starters');
    }
};
