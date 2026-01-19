<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;

class FavoriteController extends Controller
{

    public function index(Request $request)
    {
        // 1. Haal de ingelogde gebruiker op
        $user = $request->user();

        // 2. Haal zijn favoriete gebouwen op
        // We laden meteen de 'rooms' mee voor het dashboard overzicht
        $favorites = $user->favoriteBuildings()->with('rooms')->get();

        return response()->json($favorites);
    }


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

        public function getFavorites(Request $request)
            {
                $user = $request->user();

                // OUDE CODE:
                // $favorites = $user->favoriteRooms()->get();

                // NIEUWE CODE:
                // We gebruiken 'dot notation' om diep in de relaties te graven.
                // 1. building        -> Haal het gebouw op
                // 2. building.street -> Haal binnen dat gebouw de straat op
                // 3. building.place  -> Haal binnen dat gebouw de stad op
                // 4. roomtype        -> (Optioneel) Voor 'Studio', 'Kot', etc.
                $favorites = $user->favoriteRooms()
                    ->with(['building.street', 'building.place', 'roomtype'])
                    ->get();

                return response()->json($favorites);
            }
}

