<?php
// Quick database check
// Run from laravel-backend directory: php ../check-messages.php

require __DIR__ . '/laravel-backend/vendor/autoload.php';

$app = require_once __DIR__ . '/laravel-backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Checking Messages in Database ===\n\n";

// Check total messages
$totalMessages = \App\Models\Message::count();
echo "Total messages in database: $totalMessages\n\n";

if ($totalMessages > 0) {
    echo "Recent messages:\n";
    echo "----------------\n";
    $messages = \App\Models\Message::orderBy('created_at', 'desc')->limit(10)->get();
    
    foreach ($messages as $msg) {
        echo "ID: {$msg->id}\n";
        echo "From: User {$msg->sender_id}\n";
        echo "To: User {$msg->receiver_id}\n";
        echo "Content: " . substr($msg->content, 0, 50) . "...\n";
        echo "Created: {$msg->created_at}\n";
        echo "----------------\n";
    }
} else {
    echo "No messages found in database!\n";
    echo "Try sending a message through your app first.\n";
}

// Check users
echo "\nUsers in database:\n";
$users = \App\Models\User::select('id', 'name', 'email')->limit(5)->get();
foreach ($users as $user) {
    echo "ID: {$user->id} - {$user->name} ({$user->email})\n";
}
