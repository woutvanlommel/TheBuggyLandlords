<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\GeocodingService;

class Building extends Model
{
    protected $table = 'building';
    public $timestamps = false;

    // Invulbare velden
    protected $fillable = [
        'street_id',
        'housenumber',
        'place_id',
        'user_id',
        'latitude',
        'longitude',
        'description'
    ];

    // Relatie: Straat van het gebouw
    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    // Relatie: Plaats/stad van het gebouw
    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    // Relatie: Eigenaar (Verhuurder)
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relatie: Kamers in dit gebouw
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    // Auto-geocoding bij create/update events
    protected static function booted()
    {
        // Nieuw gebouw: Geocode als lat/lng ontbreekt
        static::created(function ($building) {
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

        // Update gebouw: Her-geocode als adres wijzigt
        static::updating(function ($building) {
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
