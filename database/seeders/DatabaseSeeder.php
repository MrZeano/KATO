<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Admin Default
        $admin = User::firstOrCreate(
            ['email' => 'admin@kato.test'],
            [
                'name' => 'Kato Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Buat Akun User Biasa Default
        $user = User::firstOrCreate(
            ['email' => 'user@kato.test'],
            [
                'name' => 'Demo Creator',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // 3. Buat beberapa Post AI Nyata (Approved)
        $postsData = [
            [
                'title' => 'Neon Cyberpunk Samurai in Rainy Shinjuku',
                'image_path' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
                'prompt' => 'A futuristic cyberpunk samurai standing on a rooftop in neo-Tokyo, reflective wet pavement, rainy night, holographic neon billboards, cinematic rim lighting, 8k resolution, photorealistic masterpiece',
                'negative_prompt' => 'deformed, bad anatomy, cartoon, blurry, low resolution, watermark',
                'ai_model' => 'FLUX.1',
                'seed' => '482910381',
                'cfg_scale' => 3.5,
                'steps' => 28,
                'sampler' => 'Euler a',
                'status' => 'approved',
            ],
            [
                'title' => 'Ethereal Forest Spirit Deer with Glowing Antlers',
                'image_path' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
                'prompt' => 'Mystical glowing deer spirit in an enchanted bioluminescent ancient forest, sparkling moss, gentle mist, ethereal mood, soft volumetric rays, Studio Ghibli inspired realistic render',
                'negative_prompt' => 'ugly, mutated, extra horns, oversaturated, noisy',
                'ai_model' => 'Midjourney v6',
                'seed' => '918237123',
                'cfg_scale' => 7.0,
                'steps' => 30,
                'sampler' => 'DPM++ 2M Karras',
                'status' => 'approved',
            ],
            [
                'title' => 'Retro 70s Sci-Fi Astronaut Exploring Red Dunes',
                'image_path' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
                'prompt' => 'Retro-futuristic astronaut walking on Mars red sand dunes, giant ringed gas planet in sky, 1970s sci-fi book cover aesthetic, film grain, Kodachrome color grading',
                'negative_prompt' => 'modern digital render, 3d CGI plastic look, dark shadows',
                'ai_model' => 'SDXL',
                'seed' => '77361284',
                'cfg_scale' => 6.5,
                'steps' => 35,
                'sampler' => 'DPM++ SDE Karras',
                'status' => 'approved',
            ],
            [
                'title' => 'Studio Portrait of Ceramic Android with Golden Kintsugi',
                'image_path' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'thumbnail_path' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                'prompt' => 'Hyper-detailed porcelain female humanoid face, gold kintsugi cracks filled with liquid light, minimal matte black background, Hasselblad 80mm lens, studio depth of field',
                'negative_prompt' => 'doll, low poly, noisy, jpeg artifacts',
                'ai_model' => 'FLUX.1',
                'seed' => '33491022',
                'cfg_scale' => 4.0,
                'steps' => 25,
                'sampler' => 'Euler a',
                'status' => 'approved',
            ],
        ];

        foreach ($postsData as $post) {
            Post::create(array_merge($post, ['user_id' => $user->id]));
        }

        // 4. Buat 2 Post berstatus Pending (untuk antrean kurasi admin)
        Post::factory()->count(2)->pending()->create([
            'user_id' => $user->id,
            'title' => 'Post Menunggu Moderasi Admin',
        ]);

        // 5. Buat 1 Post berstatus Rejected (untuk pengujian tampilan status ditolak)
        Post::factory()->rejected('Prompt mengandung unsur sensitif atau melanggar aturan kurasi.')->create([
            'user_id' => $user->id,
            'title' => 'Contoh Post yang Ditolak',
        ]);
    }
}
