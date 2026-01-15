<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Room;
use App\Models\Building;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;

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
     * Start Stripe Payment Intent
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'package_id' => 'required|integer|in:1,2,3',
        ]);

        $packages = [
            1 => ['credits' => 50, 'price' => 25],
            2 => ['credits' => 100, 'price' => 45],
            3 => ['credits' => 500, 'price' => 200]
        ];

        $package = $packages[$request->package_id];
        $amount = $package['price'] * 100; // Stripe expects cents

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'eur',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'user_id' => $request->user()->id,
                    'package_id' => $request->package_id,
                    'credits' => $package['credits']
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify Stripe Payment and Add Credits
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'paymentIntentId' => 'required|string',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            Log::info('Verifying Payment: ' . $request->paymentIntentId);
            $paymentIntent = PaymentIntent::retrieve($request->paymentIntentId);
            Log::info('PaymentIntent Status: ' . $paymentIntent->status);

            if ($paymentIntent->status === 'succeeded') {
                $credits = (int) $paymentIntent->metadata->credits;
                $userId = $paymentIntent->metadata->user_id;

                Log::info("Metadata - Credits: {$credits}, User: {$userId}, AuthUser: " . $request->user()->id);

                if ($request->user()->id != $userId) {
                    Log::warning('User ID mismatch');
                    return response()->json(['error' => 'Unauthorized payment verification'], 403);
                }

                $user = $request->user();
                $oldCredits = $user->credits;
                
                // Refresh user from DB to ensure we have latest data
                $user = User::find($user->id); 
                
                $user->credits += $credits;
                $user->save();
                
                Log::info("Credits Updated. Old: {$oldCredits}, Added: {$credits}, New: {$user->credits}");

                return response()->json(['success' => true, 'credits_added' => $credits, 'new_balance' => $user->credits]);
            } else {
                return response()->json(['success' => false, 'status' => $paymentIntent->status]);
            }

        } catch (\Exception $e) {
            Log::error('Verify Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Buy credits (LEGACY / TESTING)
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
            'property_id' => 'required|integer' // room_id
        ]);

        $user = $request->user();
        $roomId = $request->input('property_id');

        // Check if already unlocked
        $alreadyUnlocked = \App\Models\UnlockedRoom::where('user_id', $user->id)
            ->where('room_id', $roomId)
            ->exists();

        if ($alreadyUnlocked) {
            return response()->json([
                'success' => true,
                'new_balance' => $user->credits,
                'already_unlocked' => true
            ]);
        }

        if ($user->credits < 1) {
            return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
        }

        // Deduct credit
        $user->credits -= 1;
        $user->save();

        // Record unlock
        \App\Models\UnlockedRoom::create([
            'user_id' => $user->id,
            'room_id' => $roomId
        ]);

        return response()->json([
            'success' => true,
            'new_balance' => $user->credits
        ]);
    }
}
