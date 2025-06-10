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
        Schema::table('widgets', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft')->after('enabled');
            $table->string('domain')->nullable()->after('status');
            $table->timestamp('published_at')->nullable()->after('last_updated_at');
            $table->integer('version')->default(1)->after('published_at');

            $table->index(['user_id', 'status']);
            $table->index('domain');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('widgets', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['domain']);
            $table->dropColumn(['status', 'domain', 'published_at', 'version']);
        });
    }
};
