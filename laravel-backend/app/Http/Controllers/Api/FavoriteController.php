<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;

class FavoriteController extends Controller
{
    public function toggle(Request $request)
    {
        // 1. Validate we actually got a room_id
        $validated = $request->validate([
            'room_id' => 'required|exists:room,id'
        ]);

        $user = $request->user();
        $roomId = $validated['room_id'];

        // 2. The Magic Toggle
        // This attaches the room if missing, or detaches it if present.
        // It returns an array showing what happened (attached or detached).
        $changes = $user->favoriteRooms()->toggle($roomId);

        // 3. Check what happened so we can tell the frontend
        // If 'attached' is not empty, it means we just added it (Liked)
        $isFavorited = !empty($changes['attached']);

        return response()->json([
            'status' => 'success',
            'is_favorited' => $isFavorited, // true = Red Heart, false = Grey Heart
            'message' => $isFavorited ? 'Room added to favorites' : 'Room removed from favorites'
        ]);
    }
}

