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

// CONTROLLER: CreditController
// Holds all credit-related endpoints: balance, buying packages (Stripe),
// activating spotlight (landlord), unlocking chat (tenant).
class CreditController extends Controller
{
    // [GET] Returns the current credit balance of the logged-in user.
    // $request->user() = the user resolved from the Bearer token (Sanctum).
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

    // ============================================================
    // STRIPE FLOW = 3 STEPS: Intent → Payment → Verify
    // ============================================================

    // [POST] STEP 1: Create the Intent
    // Frontend only sends a package_id. We compute the price ourselves.
    // IMPORTANT: never read the price from the frontend → user can manipulate it!
    public function createPaymentIntent(Request $request)
    {
        // Validation: package_id must be 1, 2 or 3 (otherwise 422 error).
        $request->validate([
            'package_id' => 'required|integer|in:1,2,3',
        ]);

        // SECURITY: prices are hardcoded server-side.
        // The frontend cannot lie about how much something costs.
        $packages = [
            1 => ['credits' => 50, 'price' => 25],
            2 => ['credits' => 100, 'price' => 45],
            3 => ['credits' => 500, 'price' => 200]
        ];

        $package = $packages[$request->package_id];
        $amount = $package['price'] * 100; // Stripe expects the amount in cents

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // PaymentIntent = Stripe's way of preparing a payment.
            // metadata = extra info attached to the payment; on verification
            // we read it back to know who the credits belong to.
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

            // clientSecret = token used by the frontend to complete the payment
            // (without exposing the Stripe SECRET key).
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * [Step 2] The Payment (Frontend)
     * 
     * No controller method here. The frontend handles this directly with Stripe.
     */

    // [POST] STEP 3: Verification (after the payment)
    // Frontend redirects to /credits with ?payment_intent=... in the URL.
    // We check DIRECTLY with Stripe whether the payment really succeeded
    // before adding credits. Never trust the frontend!
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'paymentIntentId' => 'required|string',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // SECURITY: we ask Stripe itself whether the payment succeeded.
            // An attacker can put "succeeded" in the URL, but Stripe doesn't lie.
            Log::info('Verifying Payment: ' . $request->paymentIntentId);
            $paymentIntent = PaymentIntent::retrieve($request->paymentIntentId);
            Log::info('PaymentIntent Status: ' . $paymentIntent->status);

            // Only grant credits if Stripe confirms: status === 'succeeded'
            if ($paymentIntent->status === 'succeeded') {
                $credits = (int) $paymentIntent->metadata->credits;
                $userId = $paymentIntent->metadata->user_id;

                Log::info("Metadata - Credits: {$credits}, User: {$userId}, AuthUser: " . $request->user()->id);

                // SECURITY: make sure the logged-in user is the same one who
                // started the payment. Prevents user A from stealing user B's credits.
                if ($request->user()->id != $userId) {
                    Log::warning('User ID mismatch');
                    return response()->json(['error' => 'Unauthorized payment verification'], 403);
                }

                $result = DB::transaction(function () use ($request, $credits) {
                    // lockForUpdate prevents concurrent requests from reading the same
                    // stale balance before either write commits (TOCTOU race).
                    $user = User::lockForUpdate()->find($request->user()->id);
                    $oldCredits = $user->credits;
                    $user->credits += $credits;
                    $user->save();
                    Log::info("Credits Updated. Old: {$oldCredits}, Added: {$credits}, New: {$user->credits}");
                    return ['credits_added' => $credits, 'new_balance' => $user->credits];
                });

                return response()->json(['success' => true] + $result);
            } else {
                return response()->json(['success' => false, 'status' => $paymentIntent->status]);
            }

        } catch (\Exception $e) {
            Log::error('Verify Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Toggle Spotlight (Landlord)
     * Using Room's is_highlighted field
     */
    // [POST] Activate spotlight (landlord)
    // Costs 1 credit per day. The landlord chooses how many days.
    public function activateSpotlight(Request $request)
    {
        // Validation: room_id and number of days required; minimum 1 day.
        $request->validate([
            'property_id' => 'required|integer',
            'days' => 'required|integer|min:1'
        ]);

        $roomId = $request->input('property_id');
        $days = (int) $request->input('days');
        $cost = $days; // formula: 1 credit = 1 day
        $user = $request->user();

        $room = Room::find($roomId);

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        // SECURITY: ownership check → only the landlord of the building
        // is allowed to spotlight their own room.
        $isOwner = $room->building && $room->building->user_id === $user->id;
        if (!$isOwner) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 403);
        }

        return DB::transaction(function () use ($user, $room, $cost, $days) {
            // lockForUpdate: re-read balance inside the transaction to close
            // the TOCTOU window between the credit check and the deduction.
            $user = User::lockForUpdate()->find($user->id);

            // Make sure the user has enough credits (otherwise 402 Payment Required).
            if ($user->credits < $cost) {
                return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
            }

            // 1) Deduct credits
            $user->credits -= $cost;
            $user->save();

            // 2) Set spotlight + compute expiry date (now + X days)
            $room->is_highlighted = true;
            $room->highlight_expires_at = now()->addDays($days);
            $room->save();

            return response()->json([
                'success' => true,
                'message' => "Spotlight activated for {$days} days",
                'new_balance' => $user->credits
            ]);
        });
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

    // [POST] Unlock chat / contact (tenant)
    // Costs 1 credit, but only once per room per user.
    public function unlockChat(Request $request)
    {
        $request->validate([
            'property_id' => 'required|integer' // = room_id
        ]);

        $user = $request->user();
        $roomId = $request->input('property_id');

        return DB::transaction(function () use ($user, $roomId) {
            // lockForUpdate: re-read balance inside the transaction to prevent
            // concurrent unlocks from racing past the credit check.
            $user = User::lockForUpdate()->find($user->id);

            // IMPORTANT: first check if this user already unlocked this room.
            // Prevents anyone from paying twice for the same contact card.
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

            // Enough credits? (1 credit needed)
            if ($user->credits < 1) {
                return response()->json(['success' => false, 'message' => 'Insufficient credits'], 402);
            }

            // 1) Deduct credit
            $user->credits -= 1;
            $user->save();

            // 2) Remember the unlock in DB → no extra cost next time.
            \App\Models\UnlockedRoom::create([
                'user_id' => $user->id,
                'room_id' => $roomId
            ]);

            return response()->json([
                'success' => true,
                'new_balance' => $user->credits
            ]);
        });
    }
}
