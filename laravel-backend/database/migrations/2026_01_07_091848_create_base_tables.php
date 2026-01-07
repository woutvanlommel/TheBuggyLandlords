<?php

// create_base_tables_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Roles
        Schema::create('role', function (Blueprint $table) {
            $table->id();
            $table->string('role');
            // $table->timestamps(); // Optioneel: Laravel standaard
        });

        // 2. Streets
        Schema::create('street', function (Blueprint $table) {
            $table->id();
            $table->string('street');
        });

        // 3. Places
        Schema::create('place', function (Blueprint $table) {
            $table->id();
            $table->string('place');
            $table->bigInteger('zipcode'); 
        });

        // 4. Complaint Types
        Schema::create('complainttype', function (Blueprint $table) {
            $table->id();
            $table->string('type');
        });

        // 5. Document Types
        Schema::create('documenttype', function (Blueprint $table) {
            $table->id();
            $table->string('type');
        });

        // 6. Facilities
        Schema::create('facility', function (Blueprint $table) {
            $table->id();
            $table->string('facility');
        });

        // 7. Conditions
        Schema::create('condition', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('role');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
        });

        Schema::dropIfExists('condition');
        Schema::dropIfExists('facility');
        Schema::dropIfExists('documenttype');
        Schema::dropIfExists('complainttype');
        Schema::dropIfExists('place');
        Schema::dropIfExists('street');
        Schema::dropIfExists('role');
    }
};
