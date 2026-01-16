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
use App\Models\ExtraCost;
use App\Models\Facility;
use App\Models\User;
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
            ->with([
                'rooms.roomType', 
                'rooms.contracts' => function($query) {
                    $query->where('is_active', 1)->with('user');
                }, 
                'street', 
                'place'
            ])
            ->get();

        $buildings->each(function($building) {
            $building->rooms->each(function($room) {
               $room->active_contract = $room->contracts->where('is_active', 1)->first();
            });
        });

        return response()->json($buildings);
    }

    /**
     * Zoek suggesties voor een adres
     */
    public function suggestAddress(Request $request, GeocodingService $geocoder)
    {
        $query = $request->query('q');
        if (!$query || strlen($query) < 3) {
            return response()->json([]);
        }

        $suggestions = $geocoder->suggest($query);
        return response()->json($suggestions);
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

        $geoResult = $geocoder->geocode(
            $validated['street'],
            $validated['number'],
            $validated['city']
        );

        if (!$geoResult) {
            return response()->json([
                'message' => 'Adres niet gevonden of ongeldig. Controleer de straat, nummer en stad (enkel België).'
            ], 422);
        }

        // Gebruik de gecorrigeerde waarden van de geocoder
        $correctedCity = $geoResult['city'] ?? $validated['city'];
        $correctedZip = $geoResult['postalCode'] ?? $validated['postalCode'];
        $correctedStreet = $geoResult['street'] ?? $validated['street'];
        $correctedNumber = $geoResult['housenumber'] ?? $validated['number'];

        $place = Place::firstOrCreate(
            ['zipcode' => $correctedZip, 'place' => $correctedCity]
        );

        $street = Street::firstOrCreate(
            ['street' => $correctedStreet]
        );

        $building = Building::create([
            'user_id' => $user->id,
            'street_id' => $street->id,
            'place_id' => $place->id,
            'housenumber' => $correctedNumber,
            'latitude' => $geoResult['latitude'],
            'longitude' => $geoResult['longitude'],
            'description' => $validated['description'] ?? null
        ]);
        
        return response()->json(['message' => 'Gebouw toegevoegd', 'building' => $building]);
    }

    /**
     * Haal een specifiek gebouw op
     */
    public function showBuilding(Request $request, $id)
    {
        $user = $request->user();
        $building = Building::where('user_id', $user->id)
            ->with(['rooms.roomType', 'rooms.contracts' => function($query) {
                $query->where('is_active', 1)->with('user');
            }, 'street', 'place'])
            ->findOrFail($id);

        $building->rooms->each(function($room) {
            $room->active_contract = $room->contracts->first();
        });

        return response()->json($building);
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

        $geoResult = $geocoder->geocode($validated['street'], $validated['housenumber'], $validated['city']);

        if (!$geoResult) {
            return response()->json([
                'message' => 'Adres niet gevonden of ongeldig. Controleer de straat, nummer en stad (enkel België).'
            ], 422);
        }

        // Gebruik de gecorrigeerde waarden van de geocoder
        $correctedCity = $geoResult['city'] ?? $validated['city'];
        $correctedZip = $geoResult['postalCode'] ?? $validated['postalCode'];
        $correctedStreet = $geoResult['street'] ?? $validated['street'];
        $correctedNumber = $geoResult['housenumber'] ?? $validated['housenumber'];

        $place = Place::firstOrCreate(['zipcode' => $correctedZip, 'place' => $correctedCity]);
        $street = Street::firstOrCreate(['street' => $correctedStreet]);

        $building->update([
            'street_id' => $street->id,
            'place_id' => $place->id,
            'housenumber' => $correctedNumber,
            'latitude' => $geoResult['latitude'],
            'longitude' => $geoResult['longitude'],
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

        try {
            $room = Room::with(['roomType', 'documents', 'building', 'extraCosts', 'facilities', 'contracts.user'])
                        ->findOrFail($id);

            // Veiligheidscheck op building
            if (!$room->building || $room->building->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized or Building not found'], 403);
            }

            // Expliciet actieve contract toevoegen aan de response
            $room->active_contract = $room->contracts->where('is_active', 1)->first();

            return response()->json($room);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Kamer niet gevonden: ' . $e->getMessage()], 404);
        }
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
        return response()->json(['message' => 'Kamer toegevoegd', 'room' => $room->load('roomType')]);
    }

    /**
     * Update een kamer
     */
    public function updateRoom(Request $request, $id)
    {
        $user = $request->user();
        $room = Room::findOrFail($id);

        if (!$room->building || $room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized or building missing'], 403);
        }

        $validated = $request->validate([
            'roomnumber' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'roomtype_id' => 'sometimes|exists:roomtype,id',
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'surface' => 'nullable|numeric',
            'extra_costs' => 'nullable|array',
            'extra_costs.*.id' => 'nullable|exists:extracost,id',
            'extra_costs.*.price' => 'nullable|numeric',
            'facilities' => 'nullable|array',
            'facilities.*' => 'nullable|exists:facility,id',
        ]);

        if ($request->has('extra_costs')) {
            $syncData = [];
            foreach ($request->extra_costs as $cost) {
                $syncData[$cost['id']] = ['price' => $cost['price']];
            }
            $room->extraCosts()->sync($syncData);
        }

        if ($request->has('facilities')) {
            $room->facilities()->sync($request->facilities);
        }

        $room->update($validated);
        return response()->json(['message' => 'Kamer bijgewerkt', 'room' => $room->load('roomType')]);
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

    public function getExtraCosts()
    {
        return response()->json(ExtraCost::all());
    }

    public function getFacilities()
    {
        return response()->json(Facility::all());
    }

    /**
     * Zoek huurders op basis van naam of e-mail
     */
    public function searchUsers(Request $request)
    {
        $query = $request->query('q');
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('role_id', 1) // Enkel huurders
            ->where(function($q) use ($query) {
                $q->where('fname', 'LIKE', "%$query%")
                  ->orWhere('name', 'LIKE', "%$query%")
                  ->orWhere('email', 'LIKE', "%$query%");
            })
            ->limit(10)
            ->get(['id', 'fname', 'name', 'email']);

        return response()->json($users);
    }

    /**
     * Koppel een huurder aan een kamer via een nieuw contract
     */
    public function linkTenant(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'room_id' => 'required|exists:room,id',
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        $room = Room::findOrFail($validated['room_id']);
        
        if (!$room->building || $room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Deactiveer oude contracten voor deze kamer
        \App\Models\Contract::where('room_id', $room->id)
            ->where('is_active', 1)
            ->update(['is_active' => 0]);

        // Maak nieuw contract
        $contract = \App\Models\Contract::create([
            'room_id' => $room->id,
            'user_id' => $validated['user_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => 1
        ]);

        return response()->json(['message' => 'Huurder succesvol gekoppeld', 'contract' => $contract]);
    }

    /**
     * Ontkoppel een huurder van een kamer (deactiveer contract)
     */
    public function unlinkTenant(Request $request, $roomId)
    {
        $user = $request->user();
        $room = Room::findOrFail($roomId);

        if (!$room->building || $room->building->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        \App\Models\Contract::where('room_id', $room->id)
            ->where('is_active', 1)
            ->update([
                'is_active' => 0,
                'end_date' => now() // Optioneel: zet de einddatum op vandaag
            ]);

        return response()->json(['message' => 'Huurder succesvol ontkoppeld']);
    }
}
