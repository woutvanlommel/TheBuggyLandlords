<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // 1. Get the current user's profile
    public function getProfile(Request $request)
    {
        return response()->json($request->user());
    }

    // 2. Update the profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validate the data
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        // Save changes
        $user->update([
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        return response()->json($user);
    }
}
