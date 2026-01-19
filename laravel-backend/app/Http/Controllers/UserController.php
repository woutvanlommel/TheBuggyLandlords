<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Services\DocumentService;
use App\Models\Document;

class UserController extends Controller
{

    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Haal profielfoto op uit document tabel
        $avatarDoc = DB::table('document')
            ->where('user_id', $user->id)
            ->where('document_type_id', 8)
            ->first();

        // Bepaal de URL indien aanwezig
        $url = $avatarDoc ? $avatarDoc->file_path : null;

        // Zet model om naar array en voeg avatar URL toe
        $userData = $user->toArray();
        $userData['avatar_url'] = $url;

        return response()->json($userData);
    }


    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Valideer e-mail en telefoonnummer update
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update([
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        return response()->json($user);
    }

   public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // Controleer of huidige wachtwoord correct is
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Het huidige wachtwoord is onjuist.'],
            ]);
        }

        // Update naar nieuw gehasht wachtwoord
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Wachtwoord succesvol gewijzigd!']);
    }


    public function updateAvatar(Request $request)
    {
        // Valideer afbeeldingsgrootte (max 4MB)
        $request->validate([
            'avatar' => 'required|image|max:4096',
        ]);

        // fetch authenticated user
        $user = $request->user();
        // retrieve uploaded file
        $file = $request->file('avatar');

        // Converteer bestand naar Base64 string voor opslag
        $contents = file_get_contents($file->getRealPath());
        $base64 = base64_encode($contents);
        $mime = $file->getMimeType();
        $base64Data = 'data:' . $mime . ';base64,' . $base64;

        // Maak aan of update bestaande profielfoto (type 8)
        $document = Document::updateOrCreate(
            [
                'user_id' => $user->id,
                'document_type_id' => 8
            ],
            [
                'file_path' => $base64Data,
                'name' => $file->getClientOriginalName(),
                'is_active' => true
            ]
        );

        // Retourneer URL direct voor live weergave
        return response()->json(['url' => $base64Data]);
    }
}

