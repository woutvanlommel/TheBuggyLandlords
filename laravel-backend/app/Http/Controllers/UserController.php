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
        return response()->json($request->user());
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

