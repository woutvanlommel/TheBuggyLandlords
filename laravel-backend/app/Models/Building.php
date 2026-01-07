<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $table = 'building';
    public $timestamps = false;

    public function street()
    {
        return $this->belongsTo(Street::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}