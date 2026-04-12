<?php

use Illuminate\Support\Facades\Broadcast;
// toegang tot deze channel is alleen toegestaan als de gebruiker geauthenticeerd is en zijn ID overeenkomt met het ID in de channel naam
Broadcast::channel('chat.user.{id}', function ($user, $id) {
    return true;
});

Broadcast::channel('chat.{receiverId}', function ($user, $receiverId) {
    return (int) $user->id === (int) $receiverId;
});
