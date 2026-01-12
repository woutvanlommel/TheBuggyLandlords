<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // 1. GET MESSAGES (For the Inbox)
    public function index()
    {
        // Get messages sent TO the current user
        $messages = Message::where('recipient_id', Auth::id())
            ->with('sender:id,name,email') // Get sender details
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    // 2. SEND MESSAGE (The Logic)
    public function store(Request $request)
    {
        $request->validate([
            'scope' => 'required|in:single,building,all',
            'content' => 'required|string',
            'recipient_id' => 'required_if:scope,single|exists:users,id',
            'building_id' => 'required_if:scope,building|exists:building,id',
            'subject' => 'nullable|string'
        ]);

        $senderId = Auth::id();
        $recipients = [];

        // DECISION LOGIC
        if ($request->scope === 'single') {
            $recipients[] = $request->recipient_id;
        }
        elseif ($request->scope === 'building') {
            // Find all renters in this building
            // Assuming your User model has a 'building_id' or relation
            // You might need to adjust this query based on your exact User structure
            $recipients = User::where('building_id', $request->building_id)
                              ->where('id', '!=', $senderId) // Don't send to self
                              ->pluck('id');
        }
        elseif ($request->scope === 'all') {
            // Find ALL renters
            $recipients = User::where('role', 'renter') // Assuming you have roles
                              ->where('id', '!=', $senderId)
                              ->pluck('id');
        }

        // FAN-OUT: Create a message for each person
        foreach ($recipients as $recipientId) {
            Message::create([
                'sender_id' => $senderId,
                'recipient_id' => $recipientId,
                'subject' => $request->subject,
                'content' => $request->content,
                'is_read' => false
            ]);
        }

        return response()->json(['message' => 'Messages sent successfully!', 'count' => count($recipients)]);
    }

    // 3. Mark as Read
    public function markAsRead($id)
    {
        $message = Message::where('id', $id)
                          ->where('recipient_id', Auth::id())
                          ->firstOrFail();

        $message->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
