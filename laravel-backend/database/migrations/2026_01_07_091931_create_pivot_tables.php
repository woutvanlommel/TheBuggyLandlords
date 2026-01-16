<?php

// create_pivot_tables_migration.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Facility Room (Koppelt Facility aan Room)
        Schema::create('facility_room', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('facility_id');
            $table->unsignedBigInteger('room_id');
            
            $table->foreign('facility_id')->references('id')->on('facility')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on('room')->onDelete('cascade');
        });

        // 2. Complaint Document (Koppelt Complaint aan Document)
        Schema::create('complaint_document', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('complaint_id');
            $table->unsignedBigInteger('document_id');
            
            $table->foreign('complaint_id')->references('id')->on('complaint')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('document')->onDelete('cascade');
        });

        // 3. Condition Document (Koppelt Condition aan Document)
        Schema::create('condition_document', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('condition_id');
            $table->unsignedBigInteger('document_id');
            
            $table->foreign('condition_id')->references('id')->on('condition')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('document')->onDelete('cascade');
        });

        //4. Extra costs link to room
        Schema::create('extracost_room', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('extracost_id');
            $table->unsignedBigInteger('room_id');
            $table->bigInteger('price');

            $table->foreign('extracost_id')->references('id')->on('extracost')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on('room')->onDelete('cascade');
        });

    }

    public function down()
    {
        Schema::dropIfExists('extracost_room');
        Schema::dropIfExists('condition_document');
        Schema::dropIfExists('complaint_document');
        Schema::dropIfExists('facility_room');
    }
};
