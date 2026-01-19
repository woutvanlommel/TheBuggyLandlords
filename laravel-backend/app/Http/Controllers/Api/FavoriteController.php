<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;

class FavoriteController extends Controller
{
    // Haal favoriete gebouwen op inclusief kamers
    public function index(Request $request)
    {
        $user = $request->user();
        $favorites = $user->favoriteBuildings()->with('rooms')->get();

        return response()->json($favorites);
    }

    // Schakel favoriet-status van een kamer in of uit
    public function toggle(Request $request)
    {
        // Valideer kamer ID
        $validated = $request->validate([
            'room_id' => 'required|exists:room,id'
        ]);

        $user = $request->user();
        $roomId = $validated['room_id'];

        // Toggle relatie (toevoegen indien niet bestaat, anders verwijderen)
        $changes = $user->favoriteRooms()->toggle($roomId);

        // Bepaal nieuwe status (attached = toegevoegd)
        $isFavorited = !empty($changes['attached']);

        return response()->json([
            'status' => 'success',
            'is_favorited' => $isFavorited,
            'message' => $isFavorited ? 'Kamer toegevoegd aan favorieten' : 'Kamer verwijderd uit favorieten'
        ]);
    }

    // Haal favoriete kamers op met gebouwdetails
    public function getFavorites(Request $request)
    {
        $user = $request->user();

        // Laad alle benodigde relaties (eager loading)
        $favorites = $user->favoriteRooms()
            ->with(['building.street', 'building.place', 'roomtype'])
            ->get();

        return response()->json($favorites);
    }
}

