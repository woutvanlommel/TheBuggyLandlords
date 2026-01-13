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

        $this->call([
            RoomSeeder::class,
        ]);

        $this->call([
            BuildingLocationSeeder::class,
        ]);


        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $room = \App\Models\Room::first();

        if ($user && $room) {
            \App\Models\Favorite::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
            ]);
        }
    }
}
