<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Document;
use App\Models\Complaint;
use App\Models\Room;

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
        'credits'  => 100, // Standaard startkrediet
        'role_id'  => 1,   // Standaard rol (1 = Huurder)
    ]);

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

    $user = User::where('email', $validated['email'])->first();

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
    // Haal kamers op, inclusief straat en gebouw info (via relaties)
    // Let op: Je moet wel relaties definiëren in je Room model!
    $rooms = Room::with('building.street')->take(20)->get(); 
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
        
        // Zorg dat je een Document model hebt aangemaakt!
        // We zoeken op 'user_id' omdat je database die naam gebruikt.
        $documents = Document::where('user_id', $userId)->get();
        
        return response()->json($documents);
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
     * Haal de kamer op die gelinkt is aan deze user
     */
    Route::get('/my-room', function (Request $request) {
        $userId = $request->user()->id;
        
        $room = Room::where('user_id', $userId)
                    ->with(['building', 'building.street', 'building.place']) // Haal adresdata erbij
                    ->first();

        if (!$room) {
            return response()->json(['message' => 'Geen kamer gevonden voor deze gebruiker'], 404);
        }

        return response()->json($room);
    });

});