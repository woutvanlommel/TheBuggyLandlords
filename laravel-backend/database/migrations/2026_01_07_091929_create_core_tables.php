<?php

// create_core_tables_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 2. Building (Verwijst naar Street en Place)
        Schema::create('building', function (Blueprint $table) {
            $table->id();
            $table->foreignId('street_id')->constrained('street');
            $table->string('housenumber');
            $table->foreignId('place_id')->constrained('place');
        });
    }

    public function down()
    {
        Schema::dropIfExists('building');
        Schema::dropIfExists('account');
    }
};
