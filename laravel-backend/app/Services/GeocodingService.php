<?php

namespace App\Services;

use GuzzleHttp\Client;

class GeocodingService
{
    public function geocode(string $street, string $housenumber, string $place): ?array
    {
        $address = "$housenumber $street, $place";

        // echo "Trying to geocode: $address\n";

        try {
            $client = new Client(['verify' => false]);

            // LocationIQ API
            $apiKey = env('LOCATIONIQ_API_KEY');

            $response = $client->get('https://us1.locationiq.com/v1/search.php', [
                'query' => [
                    'key' => $apiKey,
                    'q' => $address,
                    'countrycodes' => 'be', // Limit to Belgium
                    'format' => 'json',
                    'limit' => 1,
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (is_array($data) && count($data) > 0) {
                $result = $data[0];

                // echo "✓ Found: lat={$result['lat']}, lon={$result['lon']}\n";

                return [
                    'latitude' => (float) $result['lat'],
                    'longitude' => (float) $result['lon']
                ];
            }
        } catch (\Exception $e) {
            // echo "Error: " . $e->getMessage() . "\n";
            // Log error instead?
        }

        // echo "✗ No results found\n";
        return null;
    }
}
