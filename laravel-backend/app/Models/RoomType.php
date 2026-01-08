<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    use HasFactory;

    protected $table = 'roomtype';
    public $timestamps = false;

    protected $fillable = [
        'type',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class, 'roomtype_id');
    }
}
