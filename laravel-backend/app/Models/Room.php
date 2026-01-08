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
        'is_highlighted',
    ];

    protected $casts = [
        'is_highlighted' => 'boolean',
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

    public function roomtype()
    {
        return $this->belongsTo(RoomType::class, 'roomtype_id');
    }

    /**
     * Relatie: Een Room heeft documenten (bijv. afbeeldingen).
     * Filteren op afbeeldingen (type 7) kan in de query of hier via een scope.
     */
    public function images()
    {
        return $this->hasMany(Document::class)->where('document_type_id', 7);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}