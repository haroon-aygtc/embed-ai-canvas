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
        Schema::create('widget_knowledge_bases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('knowledge_base_id'); // External knowledge base ID
            $table->boolean('enabled')->default(true);
            $table->integer('priority')->default(0); // Higher number = higher priority
            $table->timestamps();

            $table->index(['widget_id', 'enabled']);
            $table->index(['widget_id', 'priority']);
            $table->unique(['widget_id', 'knowledge_base_id']); // One record per widget per knowledge base
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_knowledge_bases');
    }
};
