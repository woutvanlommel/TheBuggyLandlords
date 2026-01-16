<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

        public function up()
{
    Schema::table('document', function (Blueprint $table) {
        // Replace 'path' with whatever your column is actually called!
        $table->longText('file_path')->change();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('longtext', function (Blueprint $table) {
            //
        });
    }


};
