<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Document;
use App\Models\Complaint;
use App\Models\Room;
use App\Models\Contract;
use App\Http\Controllers\Api\FavoriteController;

/*
|--------------------------------------------------------------------------
| API Routes - CustomFlow / Student Housing App
|--------------------------------------------------------------------------
*/

// ========================================================================
// 1. PUBLIC ROUTES (Geen token nodig)
// ========================================================================

/**
 * Registreren van een nieuwe huurder/gebruiker
 */
Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'fname'    => 'required|string|max:255',
        'name'     => 'required|string|max:255',
        'email'    => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'phone'    => 'required|string|max:20',
    ]);

    $user = User::create([
        'fname'    => $validated['fname'],
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'phone'    => $validated['phone'],
        'password' => Hash::make($validated['password']),
        'credits'  => 0, // Standaard startkrediet
        'role_id'  => $request->input('role', 1),   // Standaard rol (1 = Huurder)
    ]);

    $user->load('role');

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json(['message' => 'Account aangemaakt', 'token' => $token, 'user' => $user], 201);
});

/**
 * Inloggen
 */
Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $validated['email'])->with('role')->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Foute inloggegevens'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Welkom terug, ' . $user->fname,
        'token'   => $token,
        'user'    => $user,
    ]);
});

/**
 * Publieke lijst van beschikbare kamers (Voorbeeld)
 * Iedereen mag zien welke kamers er zijn, maar geen contracten zien.
 */
Route::get('/public/rooms', function () {
    // Haal kamers op, inclusief straat, plaats en afbeeldingen EN de eigenaar (via building)
    $rooms = Room::with([
        'building.street',
        'building.place',
        'building.owner',
        'images',
        'roomtype'
    ])->take(20)->get();

    // Voeg url-attribuut toe aan elk document in images
    $rooms = $rooms->map(function ($room) {
        $roomArray = $room->toArray();
        if (isset($room->images)) {
            $roomArray['images'] = collect($room->images)->map(function ($doc) {
                $arr = $doc->toArray();
                $arr['url'] = $doc->url;
                return $arr;
            })->all();
        }
        // Voeg roomtype toe
        $roomArray['roomtype'] = $room->roomtype ? $room->roomtype->type : null;
        return $roomArray;
    });

    return response()->json($rooms);
});


// ========================================================================
// 2. PROTECTED ROUTES (Token vereist via Sanctum)
// ========================================================================

Route::middleware('auth:sanctum')->group(function () {

    // --- ALGEMEEN ---

    /**
     * Uitloggen (Token vernietigen)
     */
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Succesvol uitgelogd']);
    });

    /**
     * Huidige gebruiker ophalen
     */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /**
     * Profiel updaten (bijv. nieuw telefoonnummer)
     */
    Route::put('/profile', function (Request $request) {
        $user = $request->user();

        $validated = $request->validate([
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);
        return response()->json(['message' => 'Profiel bijgewerkt', 'user' => $user]);
    });

    // --- SPECIFIEK VOOR HUURDERS ---

    /**
     * MIJN DOCUMENTEN
     * Haal alleen contracten op die gelinkt zijn aan de ingelogde user.
     */
   Route::get('/my-documents', function (Request $request) {
    $userId = $request->user()->id;
    $documents = \App\Models\Document::where('user_id', $userId)->get();

    // Voeg het url-attribuut toe aan elk document
    $documents = $documents->map(function ($doc) {
        $array = $doc->toArray();
        $array['url'] = $doc->url;
        return $array;
    });

    return response()->json($documents);
});

    /**
     * DOCUMENT DOWNLOADEN (Veilig)
     */
    Route::get('/documents/{id}/download', function (Request $request, $id) {
        $document = Document::findOrFail($id);

        // Security check: mag deze user dit zien?
        if ($document->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Geen toegang'], 403);
        }

        // Check of bestand bestaat (optioneel, anders gooit download error)
        // if (!Storage::exists($document->file_path)) {
        //    return response()->json(['message' => 'Bestand niet gevonden'], 404);
        // }

        return Storage::download($document->file_path, $document->name);
    });

    /**
     * NIEUWE KLACHT INDIENEN
     */
    Route::post('/complaints', function (Request $request) {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'required|string',
            'complaint_type_id' => 'required|integer|exists:complainttype,id',
        ]);

        $complaint = Complaint::create([
            'name'              => $validated['name'],
            'description'       => $validated['description'],
            'complaint_type_id' => $validated['complaint_type_id'],
            'user_id'           => $request->user()->id,
        ]);

        return response()->json(['message' => 'Klacht ontvangen', 'data' => $complaint], 201);
    });

    /**
     * MIJN GEHUURDE KAMER
     * Haal de kamer op die gelinkt is aan deze user via een actief contract
     */
    Route::get('/my-room', function (Request $request) {
        $userId = $request->user()->id;

        // Zoek een ACTIEF contract voor deze user
        $contract = Contract::where('user_id', $userId)
                            ->where('is_active', true)
                            ->first();

        if (!$contract) {
            return response()->json(['message' => 'Geen actieve huur gevonden'], 404);
        }

        // Haal de room op via het contract
        $room = Room::with(['building', 'building.street', 'building.place'])
                    ->find($contract->room_id);

        return response()->json($room);
    });

    // --- SPECIFIEK VOOR VERHUURDERS ---

    /**
     * MIJN GEBOUWEN
     * Haal de gebouwen op die eigendom zijn van de ingelogde user
     */
    Route::get('/my-buildings', function (Request $request) {
        $user = $request->user();

        // Check of het wel een verhuurder is (rol 2)
        if ($user->role_id !== 2) {
            return response()->json(['message' => 'Alleen voor verhuurders'], 403);
        }

        // Haal gebouwen op met kamers
        $buildings = $user->buildings()->with(['rooms', 'street', 'place'])->get();

        return response()->json($buildings);
    });

    // --- FAVORIETEN BEHEREN ---
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

});
