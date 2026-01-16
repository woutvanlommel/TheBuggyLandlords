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

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'fname',
        'email',
        'password',
        'phone',
        'credits',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profilePicture()
    {
        // Zoek het document dat bij deze user hoort EN type 8 is
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relatie: Een User (Huurder) heeft meerdere contracten (historiek).
     */
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Relatie: Een User (Verhuurder) bezit meerdere gebouwen.
     */
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Room::class, 'favorites', 'user_id', 'room_id');
    }

    public function favoriteRooms()
    {
        return $this->belongsToMany(Room::class, 'favorites', 'user_id', 'room_id')
                    ->withTimestamps();
    }

}
