<?php

namespace App\Helpers;

class FormatHelper
{
    /**
     * Format number to IDR currency
     *
     * @param float|int $amount
     * @param bool $withSymbol
     * @return string
     */
    public static function rupiah($amount, $withSymbol = true)
    {
        $formatted = number_format($amount, 0, ',', '.');
        return $withSymbol ? 'Rp ' . $formatted : $formatted;
    }

    /**
     * Format distance in meters to readable format (m or km)
     *
     * @param float $meters
     * @return string
     */
    public static function distance($meters)
    {
        if ($meters >= 1000) {
            return round($meters / 1000, 1) . ' km';
        }
        return round($meters) . ' m';
    }
}
