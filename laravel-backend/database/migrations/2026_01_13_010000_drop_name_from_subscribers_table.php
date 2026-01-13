<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('subscribers', 'name')) {
            DB::statement('ALTER TABLE subscribers DROP COLUMN name');
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('subscribers', 'name')) {
            Schema::table('subscribers', function (Blueprint $table) {
                $table->string('name')->nullable()->after('user_id');
            });
        }
    }
};
