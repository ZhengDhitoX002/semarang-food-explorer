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
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->string('status')->default('approved')->after('is_promoted');
            $table->string('closed_reason')->nullable()->after('status');
            $table->foreignId('submitted_by')->nullable()->after('closed_reason')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->dropForeign(['submitted_by']);
            $table->dropColumn(['status', 'closed_reason', 'submitted_by']);
        });
    }
};
