<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        // Get or Create a Building ID
        $buildingId = DB::table('building')->value('id') ?? DB::table('building')->insertGetId([
            'name' => 'Hoofdgebouw',
        ]);


        $roomTypeId = DB::table('roomtype')->value('id') ?? DB::table('roomtype')->insertGetId([
            'name' => 'Studio'
        ]);

        // Create the Rooms
        Room::create([
            'roomnumber' => '1.01',
            'price' => 450,
            'building_id' => $buildingId,
            'roomtype_id' => $roomTypeId,
            'is_highlighted' => 1,
        ]);

        Room::create([
            'roomnumber' => '2.05',
            'price' => 380,
            'building_id' => $buildingId,
            'roomtype_id' => $roomTypeId,
            'is_highlighted' => 0,
        ]);
    }
}
