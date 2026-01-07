<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room';
    public $timestamps = false;

    protected $fillable = [
        'roomnumber',
        'price',
        'building_id',
    ];

    // Relaties
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function building()
    {
        return $this->belongsTo(Building::class);
    }
}