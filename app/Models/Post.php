<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal (Mass Assignable).
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'image_path',
        'thumbnail_path',
        'prompt',
        'negative_prompt',
        'ai_model',
        'seed',
        'cfg_scale',
        'steps',
        'sampler',
        'status',
        'rejection_reason',
    ];

    /**
     * Konversi tipe data otomatis (Casting).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cfg_scale' => 'float',
            'steps' => 'integer',
        ];
    }

    /**
     * Relasi ke pembuat post (User).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk mengambil post yang sudah disetujui (Approved).
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope untuk mengambil post yang masih menunggu kurasi (Pending).
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope untuk mengambil post yang ditolak (Rejected).
     */
    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }
}
