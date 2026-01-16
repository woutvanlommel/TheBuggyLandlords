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

        // 1. Fetch the document from the database
        // (Make sure 'document' matches your actual table name!)
        $avatarDoc = DB::table('document')
            ->where('user_id', $user->id)
            ->where('document_type_id', 8)
            ->first();

        // 2. Get the URL string
        $url = $avatarDoc ? $avatarDoc->file_path : null;

        // 3. CONVERT TO ARRAY (This is the critical fix)
        // We convert the Model to a simple Array so Laravel stops filtering data.
        $userData = $user->toArray();

        // 4. Add the URL to the Array manually
        $userData['avatar_url'] = $url;

        // 5. Send the Array, NOT the User Object
        return response()->json($userData);
    }


    public function updateProfile(Request $request)
    {
        $user = $request->user();


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


        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Het huidige wachtwoord is onjuist.'],
            ]);
        }


        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Wachtwoord succesvol gewijzigd!']);
    }



public function updateAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|max:4096', // Max 4MB
    ]);

    $user = $request->user();
    $file = $request->file('avatar');

    // 1. Zet het bestand om naar een Base64 String ✨
    $contents = file_get_contents($file->getRealPath());
    $base64 = base64_encode($contents);
    $mime = $file->getMimeType();

    // Dit is de "Magic String" die de afbeelding bevat
    $base64Data = 'data:' . $mime . ';base64,' . $base64;

    // 2. Sla op in de 'document' tabel
    // We gebruiken updateOrCreate zodat de gebruiker max 1 profielfoto (type 8) heeft.
    // Oude foto's worden overschreven.
    $document = Document::updateOrCreate(
        [
            'user_id' => $user->id,
            'document_type_id' => 8 // ID voor Profielfoto (zoals in je screenshot)
        ],
        [
            // LET OP: Deze kolom moet LONGTEXT zijn in je database!
            // Waarschijnlijk heet hij 'path', 'url' of 'content' in jouw tabel.
            'path' => $base64Data,
            'name' => $file->getClientOriginalName(),
            'is_active' => true // Als je dit veld hebt
        ]
    );

    // Stuur de Base64 string direct terug naar de frontend zodat hij meteen zichtbaar is
    return response()->json(['url' => $base64Data]);
}
}

