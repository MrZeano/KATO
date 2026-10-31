<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $models = ['FLUX.1', 'Midjourney v6', 'SDXL', 'DALL-E 3', 'Stable Diffusion 1.5'];

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'image_path' => 'https://picsum.photos/seed/' . fake()->uuid() . '/1200/800',
            'thumbnail_path' => 'https://picsum.photos/seed/' . fake()->uuid() . '/600/400',
            'prompt' => fake()->paragraph(2),
            'negative_prompt' => fake()->boolean(60) ? 'blurry, low quality, distorted, extra limbs, watermark' : null,
            'ai_model' => fake()->randomElement($models),
            'seed' => (string) fake()->numberBetween(100000, 999999999),
            'cfg_scale' => fake()->randomFloat(1, 3.5, 9.0),
            'steps' => fake()->randomElement([20, 25, 30, 40, 50]),
            'sampler' => fake()->randomElement(['Euler a', 'DPM++ 2M Karras', 'DPM++ SDE Karras']),
            'status' => 'approved',
            'rejection_reason' => null,
        ];
    }

    /**
     * Indicate that the post is pending moderation.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'rejection_reason' => null,
        ]);
    }

    /**
     * Indicate that the post was rejected.
     */
    public function rejected(string $reason = 'Gambar tidak sesuai dengan pedoman komunitas.'): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }
}
