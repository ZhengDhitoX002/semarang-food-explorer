<?php

namespace App\Libraries;

class GeofenceLibrary
{
    /**
     * Calculate the great-circle distance between two points on Earth using the Haversine formula.
     *
     * @param float $lat1 Latitude of point 1
     * @param float $lon1 Longitude of point 1
     * @param float $lat2 Latitude of point 2
     * @param float $lon2 Longitude of point 2
     * @return float Distance in meters
     */
    public static function calculateHaversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Radius of the Earth in meters

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Get the raw SQL string for Haversine formula to be used in database queries.
     *
     * @param float $lat User's latitude
     * @param float $lng User's longitude
     * @return string
     */
    public static function getHaversineSql($lat, $lng)
    {
        return "(6371000 * acos(cos(radians($lat)) 
            * cos(radians(latitude)) 
            * cos(radians(longitude) - radians($lng)) 
            + sin(radians($lat)) 
            * sin(radians(latitude))))";
    }
}
