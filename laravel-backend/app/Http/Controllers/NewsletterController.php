<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Http;

class NewsletterController extends Controller
{
    public function subscribe(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email'
        ]);

        // Opslaan in SQL
        $subscriber = Subscriber::create($data);

        // Verzenden naar EmailJS API
        Http::post('https://api.emailjs.com/api/v1.0/email/send', [
            'service_id' => env('EMAILJS_SERVICE_ID'),
            'template_id' => env('EMAILJS_TEMPLATE_ID'),
            'user_id' => env('EMAILJS_PUBLIC_KEY'),
            'accessToken' => env('EMAILJS_PRIVATE_KEY'),
            'template_params' => [
                'name' => $subscriber->name,
                'email' => $subscriber->email
            ]
        ]);

        return response()->json(['message' => 'Succes!'], 201);
    }
}
