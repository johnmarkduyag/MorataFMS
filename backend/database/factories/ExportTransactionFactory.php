<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\ExportTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExportTransaction>
 */
class ExportTransactionFactory extends Factory
{
    protected $model = ExportTransaction::class;

    public function definition(): array
    {
        return [
            'shipper_id' => Client::factory(),
            'bl_no' => 'BL-' . fake()->unique()->numerify('########'),
            'vessel' => 'MV ' . fake()->lastName() . ' ' . fake()->randomElement(['Star', 'Express', 'Voyager', 'Spirit']),
            'destination_country_id' => null,
            'assigned_user_id' => null,
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
