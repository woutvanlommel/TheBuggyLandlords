<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Facility extends Model
{
    protected $table = 'facility';
    public $timestamps = false;
    protected $fillable = ['facility'];

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'facility_room', 'facility_id', 'room_id');
    }
}