<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Room;
use App\Models\Document;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $with = ['profilePicture'];

    // Attributen die massaal toegewezen kunnen worden
    protected $fillable = [
        'name',
        'fname',
        'email',
        'password',
        'phone',
        'credits',
        'role_id'
    ];

    // Attributen die verborgen blijven in JSON-responses
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relatie: Profielfoto van gebruiker (Document type 8)
    public function profilePicture()
    {
        return $this->hasOne(Document::class)->where('document_type_id', 8);
    }

    // protected $appends = ['profile_image_url'];

    // public function getProfileImageUrlAttribute()
    // {

    //     $doc = Document::where('user_id', $this->id)
    //                    ->where('file_path', 'LIKE', '%avatars%')
    //                    ->latest()
    //                    ->first();

    //     if ($doc) {

    //         return url($doc->file_path);
    //     }

    //     return null;
    // }

    // Type casting instellingen
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relatie: Huurcontracten van de gebruiker
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    // Relatie: Gebouwen eigendom van verhuurder
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }

    // Relatie: Rol van de gebruiker
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Relatie: Favoriete kamers (basis)
    public function favorites()
    {
        return $this->belongsToMany(Room::class, 'favorites', 'user_id', 'room_id');
    }

    // Relatie: Favoriete kamers met gebouwdetails
    public function favoriteRooms()
    {
        return $this->belongsToMany(Room::class, 'favorites', 'user_id', 'room_id')
                    ->with('building');
    }
}
