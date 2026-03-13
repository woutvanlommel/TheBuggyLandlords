<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Haal de lijst met actieve gesprekken op (de Inbox).
     */
    public function getConversations()
    {
        $authId = Auth::id();

        // Haal alle unieke gesprekspartners op
        $partnerIds = Message::where('sender_id', $authId)
            ->orWhere('receiver_id', $authId)
            ->get()
            ->map(function ($msg) use ($authId) {
                return $msg->sender_id === $authId ? $msg->receiver_id : $msg->sender_id;
            })
            ->unique();

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

        return response()->json($conversations);
    }

    /**
     * Haal de berichten op tussen de ingelogde gebruiker en een specifieke partner.
     */
    public function getMessagesWithUser($userId)
    {
        $authId = Auth::id();

        $messages = Message::where(function ($q) use ($authId, $userId) {
                $q->where('sender_id', $authId)->where('receiver_id', $userId);
            })
            ->orWhere(function ($q) use ($authId, $userId) {
                $q->where('sender_id', $userId)->where('receiver_id', $authId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Sla een nieuw bericht op en stuur het live door via WebSockets.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->input('receiver_id'),
            'content' => $request->input('content'),
            'is_read' => false
        ]);

        // Real-time broadcast
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}
?>
