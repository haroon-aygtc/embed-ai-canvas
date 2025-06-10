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
        Schema::create('widget_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['logo', 'icon', 'background', 'avatar']);
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type');
            $table->integer('file_size'); // in bytes
            $table->string('alt_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['widget_id', 'type']);
            $table->index(['widget_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_assets');
    }
};
