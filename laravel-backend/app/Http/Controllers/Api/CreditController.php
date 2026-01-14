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
    public function toggleSpotlight(Request $request)
    {
        $request->validate([
            'property_id' => 'required|integer', // This will be room_id
            'active' => 'required|boolean'
        ]);

        $roomId = $request->input('property_id');
        $isActive = $request->input('active');
        $user = $request->user();

        $room = Room::find($roomId);

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        // Verify ownership (Room -> Building -> User)
        if ($room->building->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        // If turning ON, check balance
        if ($isActive) {
            if ($user->credits < 1) {
                return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
            }
            // Deduct 1 credit (Daily cost applied once for demo?? Or is it an activation fee?)
            // "Boost visibility for 1 credit/day" implies a recurring job.
            // For this implementation, we just deduct 1 credit on activation or per toggle?
            // User requirement: "Boost visibility for 1 credit/day"
            // Implementation: Simple deduction on activation for now, or assume cron job handles daily deduction.
            // To mimic immediate effect, we deduct 1 now? The previous mock did "1 credit deducted".
            // Let's deduct 1 credit immediately on activation.
            
             // Only deduct if we are activating it and it wasn't valid before?
             // Since we have no expiry date logic here yet, let's just deduct 1 credit per activation.
             $user->credits -= 1;
             $user->save();
        }

        $room->is_highlighted = $isActive;
        $room->save();

        return response()->json([
            'success' => true, 
            'new_balance' => $user->credits
        ]);
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
