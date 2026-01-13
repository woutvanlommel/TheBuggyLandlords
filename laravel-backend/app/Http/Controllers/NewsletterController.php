<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\PersonalAccessToken;

class NewsletterController extends Controller
{
    public function subscribe(Request $request) {
        $data = $request->validate([
            'email' => 'required|email'
        ]);

        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            $user = $accessToken?->tokenable;
        }

        // Only store the email, link to user when available
        $subscriber = Subscriber::updateOrCreate(
            ['email' => $data['email']],
            [
                'user_id' => $user?->id,
            ]
        );

        // send to emailjs
        Http::post('https://api.emailjs.com/api/v1.0/email/send', [
            'service_id' => env('EMAILJS_SERVICE_ID'),
            'template_id' => env('EMAILJS_TEMPLATE_ID'),
            'user_id' => env('EMAILJS_PUBLIC_KEY'),
            'accessToken' => env('EMAILJS_PRIVATE_KEY'),
            'template_params' => [
                'name' => $user?->fname ?? $user?->name,
                'email' => $subscriber->email
            ]
        ]);

        return response()->json(['message' => 'Succes!'], 201);
    }
}
