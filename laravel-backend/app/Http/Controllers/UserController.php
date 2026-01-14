<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Services\DocumentService;

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

    public function updateAvatar(Request $request, DocumentService $documentService)
    {
        $request->validate([
            'avatar' => 'required|image|max:4096', // Max 2MB
        ]);

        $url = $documentService->uploadForUser(
        $request->user(),
        $request->file('avatar'),
        8, // Assuming document_type_id for avatar/profile picture is 8
        'avatars'
    );

        return response()->json(['url' => $url]);
    }
}

