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
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\VerhuurderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CreditController;

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
 Route::get('/public/rooms', [RoomController::class, 'index']);
Route::get('/public/search-suggestions', [RoomController::class, 'searchSuggestions']);
Route::get('/public/search-cities', [RoomController::class, 'searchCities']);
Route::get('/public/search-location', [RoomController::class, 'searchLocation']);
/**
 * Publieke detailroute voor één kamer
 */
Route::get('/public/rooms/{id}', [RoomController::class, 'show']);

Route::post('/subscribe', [NewsletterController::class, 'subscribe']);

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

    Route::get('/my-buildings', [VerhuurderController::class, 'getMyBuildings']);
    Route::get('/suggest-address', [VerhuurderController::class, 'suggestAddress']);
    Route::get('/buildings/{id}', [VerhuurderController::class, 'showBuilding']);
    Route::post('/add-building', [VerhuurderController::class, 'storeBuilding']);
    Route::put('/buildings/{id}', [VerhuurderController::class, 'updateBuilding']);
    Route::delete('/buildings/{id}', [VerhuurderController::class, 'deleteBuilding']);

    Route::get('/room-types', [VerhuurderController::class, 'roomTypes']);
    Route::get('/rooms/{id}', [VerhuurderController::class, 'showRoom']);
    Route::post('/rooms', [VerhuurderController::class, 'storeRoom']);
    Route::put('/rooms/{id}', [VerhuurderController::class, 'updateRoom']);
    Route::delete('/rooms/{id}', [VerhuurderController::class, 'deleteRoom']);
    Route::get('/extra-costs', [VerhuurderController::class, 'getExtraCosts']);
    Route::get('/facilities', [VerhuurderController::class, 'getFacilities']);
    Route::get('/search-users', [VerhuurderController::class, 'searchUsers']);
    Route::post('/rooms/link-tenant', [VerhuurderController::class, 'linkTenant']);
    Route::post('/rooms/{roomId}/unlink-tenant', [VerhuurderController::class, 'unlinkTenant']);

    Route::post('/rooms/upload-image', [VerhuurderController::class, 'uploadRoomImage']);
    Route::delete('/documents/{id}', [VerhuurderController::class, 'deleteDocument']);

    Route::get('/messages', [App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::post('/messages', [App\Http\Controllers\Api\MessageController::class, 'store']);
    Route::put('/messages/{id}/read', [App\Http\Controllers\Api\MessageController::class, 'markAsRead']);

    // --- FAVORIETEN BEHEREN ---
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites', [FavoriteController::class, 'getFavorites']);

    // --- Voor profile tab ---

    Route::get('/user/profile', [UserController::class, 'getProfile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    Route::put('/user/password', [UserController::class, 'updatePassword']);

    Route::post('/user/avatar', [UserController::class, 'updateAvatar']);

    // --- CREDITS SYSTEM ---
    Route::group(['prefix' => 'credits'], function () {
        Route::get('/balance', [App\Http\Controllers\Api\CreditController::class, 'getBalance']);
        Route::get('/packages', [App\Http\Controllers\Api\CreditController::class, 'getPackages']);
        Route::post('/payment-intent', [App\Http\Controllers\Api\CreditController::class, 'createPaymentIntent']);
        Route::post('/verify-payment', [App\Http\Controllers\Api\CreditController::class, 'verifyPayment']);
        Route::post('/buy', [App\Http\Controllers\Api\CreditController::class, 'buyPackage']);
        Route::post('/spotlight', [App\Http\Controllers\Api\CreditController::class, 'toggleSpotlight']);
        Route::post('/activate-spotlight', [App\Http\Controllers\Api\CreditController::class, 'activateSpotlight']);
        Route::post('/unlock-chat', [App\Http\Controllers\Api\CreditController::class, 'unlockChat']);
    });

});
