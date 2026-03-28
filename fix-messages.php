<?php
// Fix existing messages with string receiver_ids
// Run from project root: php fix-messages.php

require __DIR__ . '/laravel-backend/vendor/autoload.php';

$app = require_once __DIR__ . '/laravel-backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Fixing Message IDs ===\n\n";

// Update all messages to ensure IDs are integers
$updated = \Illuminate\Support\Facades\DB::statement("
    UPDATE messages 
    SET sender_id = CAST(sender_id AS UNSIGNED), 
        receiver_id = CAST(receiver_id AS UNSIGNED)
");

echo "Fixed message IDs in database\n\n";

// Show some messages
$messages = \App\Models\Message::orderBy('created_at', 'desc')->limit(5)->get();
echo "Recent messages:\n";
foreach ($messages as $msg) {
    echo "ID: {$msg->id} | From: {$msg->sender_id} | To: {$msg->receiver_id} | Content: " . substr($msg->content, 0, 30) . "...\n";
}

echo "\nDone! Try refreshing your app now.\n";
