<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->string('address')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->dropColumn('address');
        });
    }
};
