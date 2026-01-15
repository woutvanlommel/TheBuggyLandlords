<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Room;
use App\Models\Place;
use App\Models\Street;
use App\Models\RoomType;
use App\Services\GeocodingService;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VerhuurderController extends Controller
{
    /**
     * Haal alle gebouwen op van de ingelogde verhuurder
     */
    public function getMyBuildings(Request $request)
    {
        $user = $request->user();

        if ($user->role_id !== 2) {
            return response()->json(['message' => 'Alleen voor verhuurders'], 403);
        }

        $buildings = $user->buildings()
            ->with(['rooms.roomtype', 'rooms.contracts.user', 'street', 'place'])
            ->get();

        $buildings->each(function($building) {
            $building->rooms->each(function($room) {
               $room->active_contract = $room->contracts->where('is_active', 1)->first();
            });
        });

        return response()->json($buildings);
    }

    /**
     * Voeg een nieuw gebouw toe
     */
    public function storeBuilding(Request $request, GeocodingService $geocoder)
    {
        $user = $request->user();

        if ($user->role_id !== 2) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'street' => 'required|string',
            'number' => 'required|string',
            'postalCode' => 'required',
            'city' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $coordinates = $geocoder->geocode(
            $validated['street'],
            $validated['number'],
            $validated['city']
        );

        if (!$coordinates) {
            return response()->json([
                'message' => 'Adres niet gevonden of ongeldig. Controleer de straat, nummer en stad (enkel België).'
            ], 422);
        }

        $place = Place::firstOrCreate(
            ['zipcode' => $validated['postalCode'], 'place' => $validated['city']]
        );

        $street = Street::firstOrCreate(
            ['street' => $validated['street']]
        );

        $building = Building::create([
            'user_id' => $user->id,
            'street_id' => $street->id,
            'place_id' => $place->id,
            'housenumber' => $validated['number'],
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
            'description' => $validated['description'] ?? null
        ]);
        
        return response()->json(['message' => 'Gebouw toegevoegd', 'building' => $building]);
    }

    /**
     * Update een bestaand gebouw
     */
    public function updateBuilding(Request $request, $id, GeocodingService $geocoder)
    {
        $user = $request->user();
        $building = Building::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'street' => 'required|string',
            'housenumber' => 'required|string',
            'postalCode' => 'required',
            'city' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $coordinates = $geocoder->geocode($validated['street'], $validated['housenumber'], $validated['city']);

        $place = Place::firstOrCreate(['zipcode' => $validated['postalCode'], 'place' => $validated['city']]);
        $street = Street::firstOrCreate(['street' => $validated['street']]);

        $building->update([
            'street_id' => $street->id,
            'place_id' => $place->id,
            'housenumber' => $validated['housenumber'],
            'latitude' => $coordinates ? $coordinates['latitude'] : $building->latitude,
            'longitude' => $coordinates ? $coordinates['longitude'] : $building->longitude,
            'description' => $validated['description'] ?? $building->description
        ]);

        return response()->json(['message' => 'Gebouw bijgewerkt', 'building' => $building]);
    }

    /**
     * Verwijder een gebouw
     */
    public function deleteBuilding(Request $request, $id)
    {
        $user = $request->user();
        $building = Building::where('user_id', $user->id)->findOrFail($id);
        $building->delete();
        return response()->json(['message' => 'Gebouw verwijderd']);
    }

    /**
     * Haal alle kamertypes op
     */
    public function roomTypes()
    {
        return response()->json(RoomType::all());
    }

    /**
     * Haal een specifieke kamer op (voor bewerking)
     */
    public function showRoom(Request $request, $id)
    {
        $user = $request->user();
        $room = Room::with(['roomtype', 'images'])->findOrFail($id);

        if ($room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($room);
    }

    /**
     * Voeg een kamer toe
     */
    public function storeRoom(Request $request)
    {
        $user = $request->user();
        $building = Building::where('user_id', $user->id)->findOrFail($request->building_id);

        $validated = $request->validate([
            'roomnumber' => 'required|string',
            'price' => 'required|numeric',
            'building_id' => 'required|exists:building,id',
            'roomtype_id' => 'required|exists:roomtype,id',
            'name' => 'nullable|string',
            'surface' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $room = Room::create($validated);
        return response()->json(['message' => 'Kamer toegevoegd', 'room' => $room]);
    }

    /**
     * Update een kamer
     */
    public function updateRoom(Request $request, $id)
    {
        $user = $request->user();
        $room = Room::findOrFail($id);

        if ($room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'roomnumber' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'roomtype_id' => 'sometimes|exists:roomtype,id',
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'surface' => 'nullable|numeric',
        ]);

        $room->update($validated);
        return response()->json(['message' => 'Kamer bijgewerkt', 'room' => $room]);
    }

    /**
     * Upload een afbeelding voor een kamer
     */
    public function uploadRoomImage(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB limit
            'room_id' => 'required|exists:room,id',
            'document_type_id' => 'required|exists:documenttype,id',
        ]);

        $room = Room::findOrFail($request->room_id);
        if ($room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Als het een hoofdafbeelding is (type 7), verwijder dan de oude
        if ($request->document_type_id == 7) {
            $oldDoc = Document::where('room_id', $room->id)->where('document_type_id', 7)->first();
            if ($oldDoc) {
                // Verwijder fysiek bestand
                $path = str_replace('/storage/', '', $oldDoc->file_path);
                Storage::disk('public')->delete($path);
                $oldDoc->delete();
            }
        }

        $file = $request->file('image');
        $hashName = md5_file($file->getRealPath());
        $extension = $file->getClientOriginalExtension();
        $fileName = $hashName . '.' . $extension;
        $path = $file->storeAs('rooms/' . $room->id, $fileName, 'public');

        $document = Document::create([
            'room_id' => $room->id,
            'user_id' => $user->id,
            'document_type_id' => $request->document_type_id,
            'name' => $fileName,
            'file_path' => '/storage/' . $path,
        ]);

        return response()->json([
            'message' => 'Afbeelding geüpload',
            'document' => $document
        ]);
    }

    /**
     * Verwijder een document (afbeelding)
     */
    public function deleteDocument(Request $request, $id)
    {
        $user = $request->user();
        $document = Document::findOrFail($id);

        // Check ownership (via room -> building -> user)
        if ($document->room) {
            if ($document->room->building->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($document->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Verwijder fysiek bestand
        $path = str_replace('/storage/', '', $document->file_path);
        Storage::disk('public')->delete($path);
        
        $document->delete();

        return response()->json(['message' => 'Bestand verwijderd']);
    }

    /**
     * Verwijder een kamer
     */
    public function deleteRoom(Request $request, $id)
    {
        $user = $request->user();
        $room = Room::findOrFail($id);

        if ($room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $room->delete();
        return response()->json(['message' => 'Kamer verwijderd']);
    }
}
