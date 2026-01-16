<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraCost extends Model
{
    protected $table = 'extracost';
    public $timestamps = false; // We hebben geen timestamps in de migratie gezet

    protected $fillable = ['name', 'is_recurring'];

    protected $casts = [
        'is_recurring' => 'boolean',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'extracost_room', 'extracost_id', 'room_id')
                    ->withPivot('price');
    }
}