<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Street;
use App\Models\Place;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = Room::with([
            'building.street',
            'building.place',
            'building.owner',
            'images',
            'roomtype'
        ]);

        if ($request->has('building_id')) {
            $q->where('building_id', $request->building_id);
        }

        if ($request->has('highlighted') && $request->highlighted === 'true') {
            $q->where('is_highlighted', true);
        }

        // --- NEW FILTERS ---

        // 1. City Filter
        if ($request->filled('city') && $request->city !== 'All Cities' && $request->city !== '') {
            $q->whereHas('building.place', function($query) use ($request) {
                $query->where('place', $request->city);
            });
        }

        // 3. Text Search (Street or City)
        if ($request->filled('query')) {
            $search = $request->input('query');
            $q->whereHas('building', function($b) use ($search) {
                $b->whereHas('street', function($s) use ($search) {
                    $s->where('street', 'LIKE', "%{$search}%");
                })->orWhereHas('place', function($p) use ($search) {
                    $p->where('place', 'LIKE', "%{$search}%");
                });
            });
        }

        // Bounding box filter: minLat, maxLat, minLng, maxLng
        if ($request->has(['minLat','maxLat','minLng','maxLng'])) {
            $q->whereHas('building', function ($b) use ($request) {
                $b->whereBetween('latitude', [$request->minLat, $request->maxLat])
                  ->whereBetween('longitude', [$request->minLng, $request->maxLng]);
            });
        }

        // --- FETCH AVAILABLE TYPES BASED ON CURRENT FILTERS (EXCEPT CATEGORY) ---
        // We look for types present in the filtered set (location/search) to update the UI.
        try {
            // Clone the query state *before* category filters are applied
            $typesQuery = clone $q;
            
            // We need to ensure we don't have ambiguous column selects if the base query used 'with' or 'select'
            // So we explicitly select the type column.
            // NOTE: Table is 'room' (singular) based on Model, and FK is 'roomtype_id'.
            // Joined table is 'roomtype' (singular).
            $availableTypes = $typesQuery
                ->join('roomtype', 'room.roomtype_id', '=', 'roomtype.id')
                ->select('roomtype.type')
                ->distinct()
                ->pluck('roomtype.type'); // Be specific
        } catch (\Exception $e) {
            // Fallback if query fails, so we don't break the map
            \Illuminate\Support\Facades\Log::error('Available Types Query Failed: ' . $e->getMessage());
            // Fallback to all types or empty (so UI shows defaults or all)
            $availableTypes = \App\Models\RoomType::pluck('type'); 
        }

        // 2. Category (RoomType) Filter (NOW SUPPORTS MULTIPLE)
        if ($request->filled('category') && $request->category !== 'All') {
            $categories = explode(',', $request->category); // Support 'Studio,Appartement'
            $q->whereHas('roomtype', function($query) use ($categories) {
                $query->whereIn('type', $categories);
            });
        }

        // 4. Sorting
        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $q->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $q->orderBy('price', 'desc');
                    break;
                case 'newest':
                default:
                    $q->orderBy('id', 'desc');
                    break;
            }
        } else {
            $q->orderBy('id', 'desc');
        }


        // $rooms = $q->take(20)->get();

        $defaultLimit = $request->has(['minLat', 'maxLat']) ? 500 : 12;

        $perPage = $request->input('limit', $defaultLimit);
        $paginator = $q->paginate($perPage);

        $paginator->getCollection()->transform(function($room){
            $roomArray = $room->toArray();

            if ($room->building) {
                $roomArray['building']['latitude'] = $room->building->latitude;
                $roomArray['building']['longitude'] = $room->building->longitude;
                $roomArray['lat'] = $room->building->latitude;
                $roomArray['lng'] = $room->building->longitude;
            }

            if (isset($room->images) && $room->images->count() > 0) {
                $roomArray['images'] = collect($room->images)->map(function ($doc) {
                    $d = $doc->toArray();
                    $d['url'] = $doc->url;
                    return $d;
                })->all();
            }

            $roomArray['roomtype'] = $room->roomtype ? $room->roomtype->type : null;
            return $roomArray;
        });

        $response = $paginator->toArray();
        $response['available_types'] = $availableTypes ?? [];

        return response()->json($response);
    }


    public function searchSuggestions(Request $request)
    {
        $query = $request->input('query');
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        // Search streets
        $streets = Street::where('street', 'LIKE', "%{$query}%")
            ->limit(5)
            ->pluck('street')
            ->toArray();

        // Search places
        $places = Place::where('place', 'LIKE', "%{$query}%")
            ->limit(5)
            ->pluck('place')
            ->toArray();

        // Merge and unique
        $suggestions = array_unique(array_merge($streets, $places));
        
        // Return as simple list
        return response()->json(array_values($suggestions));
    }

    public function searchLocation(Request $request)
    {
        $query = $request->input('query');
        if (!$query) return response()->json(null, 404);

        // 1. Try Place match
        $place = Place::where('place', $query)->first();
        if ($place) {
            // Find a building in this place to get coords
            $building = \App\Models\Building::where('place_id', $place->id)->whereNotNull('latitude')->first();
            if ($building) {
                return response()->json([
                    'lat' => $building->latitude,
                    'lng' => $building->longitude,
                    'zoom' => 13
                ]);
            }
        }

        // 2. Try Street match
        $street = Street::where('street', $query)->first();
        if ($street) {
            $building = \App\Models\Building::where('street_id', $street->id)->whereNotNull('latitude')->first();
            if ($building) {
                return response()->json([
                    'lat' => $building->latitude,
                    'lng' => $building->longitude,
                    'zoom' => 15
                ]);
            }
        }

        return response()->json(null, 404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // gebruik $request voor validatie en create => triggert model events voor geocoding
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $room = Room::with([
            'building.street',
            'building.place',
            'building.owner',
            'images',
            'roomtype'
        ])->findOrFail($id);

        $roomArray = $room->toArray();

        // Check if unlocked for current user
        $user = request()->user('sanctum');
        $roomArray['is_unlocked'] = false;
        
        if ($user) {
            $roomArray['is_unlocked'] = \App\Models\UnlockedRoom::where('user_id', $user->id)
                ->where('room_id', $id)
                ->exists();
        }

        if ($room->building) {
            $roomArray['building']['latitude'] = $room->building->latitude;
            $roomArray['building']['longitude'] = $room->building->longitude;
            $roomArray['lat'] = $room->building->latitude;
            $roomArray['lng'] = $room->building->longitude;

            // SANITIZE OWNER DATA IF NOT UNLOCKED AND NOT OWNER
            $ownerId = $room->building->user_id;
            $isMe = $user && $user->id === $ownerId;
            
            // Note: ContactCard checks (isUnlocked || isSpotlighted || isMe).
            // We must mirror this logic to decide whether to hide data.
            // NEW RULE: User MUST be logged in ($user != null) to see data,
            // even if it is spotlighted. Spotlight just implies "free to view if logged in".
            $canSeeData = $user && ($roomArray['is_unlocked'] || $room->is_highlighted || $isMe);

            if (!$canSeeData && isset($roomArray['building']['owner'])) {
                $roomArray['building']['owner']['name'] = 'Verhuurder'; // generic last name
                $roomArray['building']['owner']['fname'] = 'Naam';      // generic first name
                $roomArray['building']['owner']['email'] = 'hidden@example.com';
                $roomArray['building']['owner']['phone'] = null;
                $roomArray['building']['owner']['profile_image_url'] = null; 
            }
        }

        if (isset($room->images) && $room->images->count() > 0) {
            $roomArray['images'] = collect($room->images)->map(function ($doc) {
                $d = $doc->toArray();
                $d['url'] = $doc->url;
                return $d;
            })->all();
        }
        $roomArray['roomtype'] = $room->roomtype ? $room->roomtype->type : null;

        return response()->json($roomArray);
    }

    public function update(Request $request, string $id)
    {
        // gebruik $request voor validatie en update
    }

    public function destroy(string $id)
    {
        //
    }
}