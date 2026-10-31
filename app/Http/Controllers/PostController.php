<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Menampilkan daftar feed postingan yang sudah disetujui (Approved).
     * Mendukung pencarian keyword dan filter model AI.
     */
    public function index(Request $request): Response
    {
        $query = Post::query()
            ->approved()
            ->with('user:id,name')
            ->latest();

        // Filter pencarian berdasarkan judul atau prompt
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('prompt', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan model AI (misal: FLUX.1, Midjourney v6)
        if ($model = $request->input('model')) {
            $query->where('ai_model', $model);
        }

        $posts = $query->paginate(12)->withQueryString();

        $featuredPosts = Post::query()
            ->approved()
            ->with('user:id,name')
            ->latest()
            ->take(5)
            ->get();

        $availableModels = ['FLUX.1', 'Midjourney v6', 'SDXL', 'DALL-E 3', 'Stable Diffusion 1.5'];

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'filters' => [
                'q' => $request->input('q', ''),
                'model' => $request->input('model', ''),
            ],
            'availableModels' => $availableModels,
        ]);
    }

    /**
     * Menampilkan detail satu postingan beserta metadata prompt dan parameter teknis AI.
     */
    public function show(Post $post): Response
    {
        // Hanya izinkan post yang sudah approved, kecuali jika dilihat oleh pembuatnya sendiri atau admin
        $user = auth()->user();
        $isAuthor = $user && $user->id === $post->user_id;
        $isAdmin = $user && $user->isAdmin();

        if ($post->status !== 'approved' && !$isAuthor && !$isAdmin) {
            abort(404);
        }

        $post->load('user:id,name');

        // Postingan terkait dengan model AI yang sama
        $relatedPosts = Post::query()
            ->approved()
            ->where('id', '!=', $post->id)
            ->where('ai_model', $post->ai_model)
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
