<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Room;
use App\Models\Building;
use Illuminate\Support\Facades\DB;

class CreditController extends Controller
{
    /**
     * Get current user balance
     */
    public function getBalance(Request $request)
    {
        return response()->json(['balance' => $request->user()->credits]);
    }

    /**
     * Get available packages (Mock or DB)
     */
    public function getPackages()
    {
        // Frontend has these hardcoded, but we provide API just in case or for validation
        $packages = [
            ['id' => 1, 'name' => 'Starter', 'credits' => 50, 'price' => 25],
            ['id' => 2, 'name' => 'Pro', 'credits' => 100, 'price' => 45],
            ['id' => 3, 'name' => 'Enterprise', 'credits' => 500, 'price' => 200]
        ];
        return response()->json($packages);
    }

    /**
     * Buy credits
     */
    public function buyPackage(Request $request)
    {
        $request->validate([
            'package_id' => 'required|integer'
        ]);

        $packages = [
            1 => 50,
            2 => 100,
            3 => 500
        ];

        $packageId = $request->input('package_id');
        
        if (!isset($packages[$packageId])) {
            return response()->json(['success' => false, 'message' => 'Invalid package'], 400);
        }

        $creditsToAdd = $packages[$packageId];
        $user = $request->user();

        // Update user credits
        $user->credits += $creditsToAdd;
        $user->save();

        return response()->json([
            'success' => true,
            'new_balance' => $user->credits,
            'message' => "Added $creditsToAdd credits"
        ]);
    }

    /**
     * Toggle Spotlight (Landlord)
     * Using Room's is_highlighted field
     */
    /**
     * Activate Spotlight with Timer (Landlord)
     * COST: 1 Credit = 1 Day
     */
    public function activateSpotlight(Request $request) 
    {
        $request->validate([
            'property_id' => 'required|integer', 
            'days' => 'required|integer|min:1'
        ]);

        $roomId = $request->input('property_id');
        $days = (int) $request->input('days');
        $cost = $days; // 1 credit per day
        $user = $request->user();

        $room = Room::find($roomId);

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        // Verify ownership
        $isOwner = $room->building && $room->building->user_id === $user->id;
        if (!$isOwner) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        // Check balance
        if ($user->credits < $cost) {
            return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
        }

        // Deduct credits
        $user->credits -= $cost;
        $user->save();

        // Update Room
        $room->is_highlighted = true;
        $room->highlight_expires_at = now()->addDays($days);
        $room->save();

        return response()->json([
            'success' => true,
            'message' => "Spotlight activated for {$days} days",
            'new_balance' => $user->credits
        ]);
    }

    /**
     * Toggle Spotlight (Landlord)
     */
    public function toggleSpotlight(Request $request)
    {
        $request->validate([
            'property_id' => 'required|integer', 
            'active' => 'required|boolean'
        ]);

        $roomId = $request->input('property_id');
        $isActive = $request->input('active');
        $user = $request->user();

        $room = Room::find($roomId);

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        if ($room->building->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        if (!$isActive) {
            $room->is_highlighted = false;
            $room->highlight_expires_at = null; 
            $room->save();
            return response()->json(['success' => true]);
        }

        if ($user->credits < 1) {
             return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
        }
        
        $user->credits -= 1;
        $user->save();
        
        $room->is_highlighted = true;
        // Default 1 day if toggled via old button
        $room->highlight_expires_at = now()->addDay();
        $room->save();

        return response()->json(['success' => true]);
    }

    /**
     * Unlock Chat (Tenant)
     */
    public function unlockChat(Request $request)
    {
        $request->validate([
            'property_id' => 'required|integer' // room_id or building_id?
        ]);

        $user = $request->user();
        if ($user->credits < 1) {
            return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
        }

        // Logic to record the unlock?
        // Ideally we store this in a 'unlocked_chats' pivot table or similar.
        // For MVP/Demo: Just deduct credit.
        
        $user->credits -= 1;
        $user->save();

        return response()->json([
            'success' => true,
            'new_balance' => $user->credits
        ]);
    }
}
