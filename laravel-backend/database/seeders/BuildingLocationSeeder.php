<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Building;
use App\Services\GeocodingService;

class BuildingLocationSeeder extends Seeder
{
    public function run(): void
    {
        $geocoder = new GeocodingService();
        $buildings = Building::with(['street', 'place'])->get();
        
        $this->command->info("Starting geocoding for {$buildings->count()} buildings...");
        
        foreach ($buildings as $building) {
            $coords = $geocoder->geocode(
                $building->street->street,
                $building->housenumber,
                $building->place->place
            );
            
            if ($coords) {
                $building->latitude = $coords['latitude'];
                $building->longitude = $coords['longitude'];
                $building->save();
                $this->command->info("✓ {$building->street->street} {$building->housenumber}");
            } else {
                $this->command->warn("✗ Failed: {$building->street->street} {$building->housenumber}");
            }
            
            sleep(1); // Rate limit respect
        }
        
        $this->command->info("Geocoding complete!");
    }
}