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
                    'addressdetails' => 1,
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (is_array($data) && count($data) > 0) {
                $result = $data[0];

                // Controleer of het resultaat specifiek genoeg is (straat of huisnummer)
                // Als iemand "Kakastraat" typt die niet bestaat, geeft de API 
                // vaak een resultaat van de stad terug of een heel lage 'importance'.
                $addressDetails = $result['address'] ?? [];
                
                // We willen minstens een straat in het resultaat hebben
                if (!isset($addressDetails['road'])) {
                    return null;
                }

                return [
                    'latitude' => (float) $result['lat'],
                    'longitude' => (float) $result['lon'],
                    'street' => $addressDetails['road'] ?? $street,
                    'housenumber' => $addressDetails['house_number'] ?? $housenumber,
                    'city' => $addressDetails['city'] ?? $addressDetails['town'] ?? $addressDetails['village'] ?? $place,
                    'postalCode' => $addressDetails['postcode'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            // echo "Error: " . $e->getMessage() . "\n";
            // Log error instead?
        }

        // echo "✗ No results found\n";
        return null;
    }

    public function suggest(string $query): array
    {
        try {
            $client = new Client(['verify' => false]);
            $apiKey = env('LOCATIONIQ_API_KEY');

            $response = $client->get('https://us1.locationiq.com/v1/autocomplete.php', [
                'query' => [
                    'key' => $apiKey,
                    'q' => $query,
                    'countrycodes' => 'be',
                    'format' => 'json',
                    'limit' => 5,
                    'addressdetails' => 1,
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (is_array($data)) {
                return array_map(function($item) {
                    $addr = $item['address'] ?? [];
                    return [
                        'display_name' => $item['display_name'],
                        'street' => $addr['road'] ?? null,
                        'city' => $addr['city'] ?? $addr['town'] ?? $addr['village'] ?? null,
                        'postalCode' => $addr['postcode'] ?? null,
                    ];
                }, $data);
            }
        } catch (\Exception $e) {
            // Silently fail or log
        }

        return [];
    }
}
