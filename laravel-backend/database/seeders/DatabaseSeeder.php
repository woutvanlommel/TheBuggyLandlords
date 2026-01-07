<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Roep hier jouw ImportOldDataSeeder aan
        $this->call([
            ImportDataSeeder::class,
        ]);
        // User::factory(10)->create();
    }
}
