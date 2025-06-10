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
        Schema::create('widget_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('language_code', 5); // en, es, fr, de, etc.
            $table->string('language_name'); // English, Spanish, French, German, etc.
            $table->boolean('enabled')->default(true);
            $table->boolean('is_primary')->default(false);
            $table->boolean('auto_detect')->default(true);
            $table->boolean('real_time_translation')->default(false);
            $table->enum('translation_service', ['google', 'deepl', 'azure'])->default('google');
            $table->timestamps();

            $table->index(['widget_id', 'enabled']);
            $table->index(['widget_id', 'is_primary']);
            $table->unique(['widget_id', 'language_code']); // One record per widget per language
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_languages');
    }
};
