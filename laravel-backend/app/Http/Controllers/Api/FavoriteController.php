<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;

class FavoriteController extends Controller
{
    // Haal favoriete gebouwen op voor de ingelogde gebruiker
    public function index(Request $request)
    {
        $user = $request->user();

        // Haal gebouwen op en laad direct de kamers mee voor het overzicht
        $favorites = $user->favoriteBuildings()->with('rooms')->get();

        return response()->json($favorites);
    }

    // Schakel favoriete status in of uit (Like / Unlike)
    public function toggle(Request $request)
    {
        // 1. Valideer of het kamer ID geldig is en bestaat in de database
        $validated = $request->validate([
            'room_id' => 'required|exists:room,id'
        ]);

        $user = $request->user();
        $roomId = $validated['room_id'];

        // 2. Toggle de relatie: attach als niet bestaat, detach als wel bestaat
        // Dit bespaart ons handmatige if/else logica
        $changes = $user->favoriteRooms()->toggle($roomId);

        // 3. Bepaal de nieuwe status op basis van de wijzigingen
        // Als 'attached' gevuld is, is de kamer net toegevoegd aan favorieten
        $isFavorited = !empty($changes['attached']);

        return response()->json([
            'status' => 'success',
            'is_favorited' => $isFavorited, // true = Rood hartje, false = Grijs hartje
            'message' => $isFavorited ? 'Kamer toegevoegd aan favorieten' : 'Kamer verwijderd uit favorieten'
        ]);
    }

    // Haal de complete lijst met favoriete kamers op inclusief details
    public function getFavorites(Request $request)
    {
        $user = $request->user();

        // Gebruik Eager Loading (dot notation) om alle benodigde relaties in één keer op te halen
        // Dit is essentieel voor performance en om alle adresgegevens (straat, stad) direct beschikbaar te hebben
        $favorites = $user->favoriteRooms()
            ->with(['building.street', 'building.place', 'roomtype'])
            ->get();

        return response()->json($favorites);
    }
}

