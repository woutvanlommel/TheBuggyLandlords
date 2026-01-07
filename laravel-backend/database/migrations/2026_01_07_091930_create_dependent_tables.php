<?php

// create_dependent_tables_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Room (Verwijst naar Building)
        // user_id is verwijderd, relatie loopt nu via contract
        Schema::create('room', function (Blueprint $table) {
            $table->id();
            $table->string('roomnumber');
            $table->bigInteger('price');
            $table->foreignId('building_id')->constrained('building');
            $table->boolean('is_highlighted')->default(false); // Highlighted kamer
        });

        // 2. Contract (Koppelt User en Room)
        Schema::create('contract', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('room_id')->constrained('room');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Document (Verwijst naar DocumentType, User, Room en optioneel Contract)
        Schema::create('document', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Weergavenaam
            $table->string('file_path'); // Opslaglocatie
            $table->foreignId('document_type_id')->constrained('documenttype');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('contract_id')->nullable()->constrained('contract'); // Link naar huurcontract
            $table->foreignId('room_id')->nullable()->constrained('room'); // Link naar kamer (voor afbeeldingen)
            $table->timestamps();
        });

        // 4. Complaint (Verwijst naar ComplaintType)
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
        Schema::dropIfExists('contract');
        Schema::dropIfExists('room');
    }
};
