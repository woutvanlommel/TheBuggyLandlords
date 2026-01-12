<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}