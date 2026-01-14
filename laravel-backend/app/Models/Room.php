<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room';
    public $timestamps = false;


    protected $appends = ['is_favorited'];

    protected $fillable = [
        'roomnumber',
        'price',
        'building_id',
        'is_highlighted',
    ];

    protected $casts = [
        'is_highlighted' => 'boolean',

    ];


    public function getIsFavoritedAttribute()
    {

        if (Auth::guard('sanctum')->check()) {
            return $this->favoritedBy()
                        ->where('user_id', Auth::guard('sanctum')->id())
                        ->exists();
        }

        return false;
    }



    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'roomtype_id');
    }

    public function images()
    {
        return $this->hasMany(Document::class)->where('document_type_id', 7);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'room_id', 'user_id');
    }
}
