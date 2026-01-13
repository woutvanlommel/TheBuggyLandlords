<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
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

        // Bounding box filter: minLat, maxLat, minLng, maxLng
        if ($request->has(['minLat','maxLat','minLng','maxLng'])) {
            $q->whereHas('building', function ($b) use ($request) {
                $b->whereBetween('latitude', [$request->minLat, $request->maxLat])
                  ->whereBetween('longitude', [$request->minLng, $request->maxLng]);
            });
        }

        $rooms = $q->take(20)->get();

        $rooms = $rooms->map(function ($room) {
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

        return response()->json($rooms);
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