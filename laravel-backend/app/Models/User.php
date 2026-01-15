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

    protected $appends = ['profile_image_url']; // <--- This adds the field to JSON

    public function getProfileImageUrlAttribute()
    {
        // 2. QUERY THE DOCUMENT TABLE
        // We look for a document belonging to this user (id 41)
        // We check for 'avatars' in the path to be sure we get the right image
        $doc = Document::where('user_id', $this->id)
                       ->where('file_path', 'LIKE', '%avatars%')
                       ->latest() // Get the newest one if there are multiple
                       ->first();

        if ($doc) {
            // 3. RETURN THE FULL URL
            // The DB already has "/storage/avatars/..." so we just add the domain
            return url($doc->file_path);
        }

        return null; // Fallback to the initials if no file found
    }

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
