<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

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

    public function updateAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096', // Max 4MB
    ]);

    $file = $request->file('avatar');

    $hashName = md5_file($file->getRealPath());

    $extension = $file->getClientOriginalExtension();
    $fileName = $hashName . '.' . $extension;

    $path = $file->storeAs('avatars', $fileName, 'public');

    $user = $request->user();

    $user->update([
        'avatar_url' => '/storage/' . $path
    ]);

    return response()->json([
        'message' => 'Avatar updated!',
        'url' => $user->avatar_url
    ]);
}
}
