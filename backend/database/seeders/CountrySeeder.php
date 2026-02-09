<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            // Export destinations
            ['name' => 'Korea', 'code' => 'KR', 'type' => 'both'],
            ['name' => 'China', 'code' => 'CN', 'type' => 'both'],
            ['name' => 'Singapore', 'code' => 'SG', 'type' => 'both'],
            ['name' => 'Malaysia', 'code' => 'MY', 'type' => 'export_destination'],
            ['name' => 'Hong Kong', 'code' => 'HK', 'type' => 'export_destination'],
            ['name' => 'Saudi Arabia', 'code' => 'SA', 'type' => 'export_destination'],
            ['name' => 'United Arab Emirates', 'code' => 'AE', 'type' => 'export_destination'], // Jebel Ali
            ['name' => 'Qatar', 'code' => 'QA', 'type' => 'export_destination'],
            ['name' => 'Mongolia', 'code' => 'MN', 'type' => 'export_destination'],
            ['name' => 'Iran', 'code' => 'IR', 'type' => 'export_destination'],

            // Import origins
            ['name' => 'Japan', 'code' => 'JP', 'type' => 'import_origin'],
            ['name' => 'United States', 'code' => 'US', 'type' => 'import_origin'],
            ['name' => 'Thailand', 'code' => 'TH', 'type' => 'import_origin'],
            ['name' => 'Indonesia', 'code' => 'ID', 'type' => 'import_origin'],
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ['code' => $country['code']],
                $country
            );
        }
    }
}
