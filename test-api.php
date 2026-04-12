<?php
// Test script to check messages API
// Run with: php test-api.php <your-token>

if ($argc < 2) {
    echo "Usage: php test-api.php <auth-token>\n";
    echo "Get your token from sessionStorage.getItem('auth_token') in browser console\n";
    exit(1);
}

$token = $argv[1];
$baseUrl = 'http://localhost:8000/api';

echo "=== Testing Messages API ===\n\n";

// Test 1: Get conversations
echo "1. Testing GET /api/conversations\n";
$ch = curl_init("$baseUrl/conversations");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response: $response\n\n";

// Test 2: Get messages with specific user (ID 45 from your screenshot)
echo "2. Testing GET /api/messages/45\n";
$ch = curl_init("$baseUrl/messages/45");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response: $response\n\n";

// Test 3: Check if there are any messages in database
echo "3. Checking database directly...\n";
echo "Run this SQL query in your database:\n";
echo "SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;\n\n";
