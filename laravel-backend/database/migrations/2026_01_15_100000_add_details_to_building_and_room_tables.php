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
        Schema::table('building', function (Blueprint $table) {
            $table->text('description')->nullable();
        });

        Schema::table('room', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->decimal('surface', 8, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('building', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('room', function (Blueprint $table) {
            $table->dropColumn(['name', 'description', 'surface']);
        });
    }
};
