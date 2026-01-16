<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Document extends Model
{
    use HasFactory;

    protected $table = 'document';

    protected $fillable = [
        'name',
        'file_path',
        'document_type_id',
        'user_id',
        'contract_id',
        'room_id',
    ];

    protected $appends = ['url'];

    protected function url(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                $path = $attributes['file_path'] ?? '';
                
                if (str_starts_with($path, 'http')) {
                    return $path;
                }

                // Zorg dat we niet dubbel /storage/ krijgen
                $cleanPath = ltrim(str_replace('/storage/', '', $path), '/');
                return asset('storage/' . $cleanPath);
            }
        );
    }

    // Relaties
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function complaints()
    {
        return $this->belongsToMany(Complaint::class, 'complaint_document', 'document_id', 'complaint_id');
    }
}
