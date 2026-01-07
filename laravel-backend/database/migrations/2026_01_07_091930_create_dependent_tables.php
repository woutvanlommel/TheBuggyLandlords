<?php

// create_dependent_tables_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Room (Verwijst naar Building en Account)
        Schema::create('room', function (Blueprint $table) {
            $table->id();
            $table->string('roomnumber');
            $table->bigInteger('price');
            $table->foreignId('building_id')->constrained('building');
            $table->foreignId('user_id')->constrained('users');
        });

        // 2. Document (Verwijst naar DocumentType en Account)
        Schema::create('document', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('document_type_id')->constrained('documenttype');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('timestamp'); // Specifiek veld uit jouw SQL
        });

        // 3. Complaint (Verwijst naar ComplaintType)
        Schema::create('complaint', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->foreignId('complaint_type_id')->constrained('complainttype');
            $table->foreignId('user_id')->constrained('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('complaint');
        Schema::dropIfExists('document');
        Schema::dropIfExists('room');
    }
};
