<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    /**
     * Haal de lijst met actieve gesprekken op (de Inbox).
     */
    public function getConversations()
    {
        $authId = Auth::id();

        Log::info('getConversations called', ['auth_id' => $authId]);

        // Haal alle unieke gesprekspartners op
        $partnerIds = Message::where('sender_id', $authId)
            ->orWhere('receiver_id', $authId)
            ->get()
            ->map(function ($msg) use ($authId) {
                return $msg->sender_id === $authId ? $msg->receiver_id : $msg->sender_id;
            })
            ->unique();

        Log::info('Partner IDs found', ['partners' => $partnerIds->toArray()]);

        $conversations = [];

        foreach ($partnerIds as $id) {
            $partner = User::find($id);
            if (!$partner) continue;

            $lastMessage = Message::where(function ($q) use ($authId, $id) {
                    $q->where('sender_id', $authId)->where('receiver_id', $id);
                })
                ->orWhere(function ($q) use ($authId, $id) {
                    $q->where('sender_id', $id)->where('receiver_id', $authId);
                })
                ->latest()
                ->first();

            $conversations[] = [
                'user' => $partner,
                'last_message' => $lastMessage
            ];
        }

        Log::info('Conversations result', ['count' => count($conversations)]);

        return response()->json($conversations);
    }

    /**
     * Haal de berichten op tussen de ingelogde gebruiker en een specifieke partner.
     */
    public function getMessagesWithUser($userId)
    {
        $authId = Auth::id();

        $messages = Message::where(function ($query) use ($authId, $userId) {
                $query->where(function ($q) use ($authId, $userId) {
                    $q->where('sender_id', $authId)->where('receiver_id', $userId);
                })
                ->orWhere(function ($q) use ($authId, $userId) {
                    $q->where('sender_id', $userId)->where('receiver_id', $authId);
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        Log::info('Messages retrieved for user ' . $userId, [
            'auth_id' => $authId,
            'partner_id' => $userId,
            'count' => $messages->count(),
            'messages' => $messages->toArray()
        ]);

        return response()->json($messages);
    }

    /**
     * Sla een nieuw bericht op en stuur het live door via WebSockets.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required', // Kan een ID zijn of de string 'all'
        ]);

        $senderId = Auth::id();
        $receiverId = $request->input('receiver_id');

        // Scenario A: Bericht naar ALLE eigen huurders
        if ($receiverId === 'all') {
            $tenants = User::whereHas('contracts', function ($q) use ($senderId) {
                $q->where('is_active', 1)->whereHas('room.building', function ($q2) use ($senderId) {
                    $q2->where('user_id', $senderId);
                });
            })->get();

            foreach ($tenants as $tenant) {
                $msg = Message::create([
                    'sender_id' => $senderId,
                    'receiver_id' => (int) $tenant->id, // Cast to integer
                    'content' => $request->input('content'),
                    'is_read' => false
                ]);
                broadcast(new MessageSent($msg))->toOthers();
            }
            return response()->json(['message' => 'Mededeling verzonden naar alle huurders']);
        }

        // CRITICAL FIX: Ensure receiver_id is always an integer
        $receiverId = (int) $receiverId;

        // Scenario B: Bericht naar één specifieke gebruiker
        // Security check: alleen toegestaan als je de eigenaar bent OF als je huurder bent die je verhuurder contacteert
        $user = User::find($receiverId);

        if (!$user) {
            return response()->json(['error' => 'Ontvanger niet gevonden'], 404);
        }

        // Check 1: Is dit je eigen huurder? (verhuurder -> huurder)
        $isOwnTenant = User::where('id', $receiverId)
            ->whereHas('contracts.room.building', function($q) use ($senderId) {
                $q->where('user_id', $senderId);
            })->exists();

        // Check 2: Is dit je verhuurder? (huurder -> verhuurder)
        $isMyLandlord = User::where('id', $receiverId)
            ->whereHas('buildings.rooms.contracts', function($q) use ($senderId) {
                $q->where('user_id', $senderId)->where('is_active', 1);
            })->exists();

        if (!$isOwnTenant && !$isMyLandlord) {
            return response()->json(['error' => 'Niet geautoriseerd'], 403);
        }

        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'content' => $request->input('content'),
            'is_read' => false
        ]);

        broadcast(new MessageSent($message))->toOthers();
        return response()->json($message);
    }
}
?>
