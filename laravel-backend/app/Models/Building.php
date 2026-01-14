<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\GeocodingService;

class Building extends Model
{
    protected $table = 'building';
    public $timestamps = false;
    protected $fillable = ['street_id', 'housenumber', 'place_id', 'user_id', 'latitude', 'longitude'];

    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    protected static function booted()
    {
        // Bij het aanmaken van een nieuw building
        static::created(function ($building) {
            // Alleen geocoden als lat/lng nog niet ingevuld zijn
            if (is_null($building->latitude) || is_null($building->longitude)) {
                $geocoder = new GeocodingService();
                
                $coords = $geocoder->geocode(
                    $building->street->street,
                    $building->housenumber,
                    $building->place->place
                );
                
                if ($coords) {
                    $building->update($coords);
                }
            }
        });

        // Bij het updaten van een building (als adres wijzigt)
        static::updating(function ($building) {
            // Check of street_id, housenumber of place_id is gewijzigd
            if ($building->isDirty(['street_id', 'housenumber', 'place_id'])) {
                $geocoder = new GeocodingService();
                
                $coords = $geocoder->geocode(
                    $building->street->street,
                    $building->housenumber,
                    $building->place->place
                );
                
                if ($coords) {
                    $building->latitude = $coords['latitude'];
                    $building->longitude = $coords['longitude'];
                }
            }
        });
    }
}