<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Coupon extends Model
{
    protected $fillable = [
        'company_id',
        'affiliate_id',
        'code',
        'discount_percentage',
        'free_shipping',
        'expires_at',
        'usage_limit',
        'usage_count',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'discount_percentage' => 'decimal:2',
            'free_shipping'       => 'boolean',
            'active'              => 'boolean',
            'expires_at'          => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'affiliate_id');
    }

    // Verifica se o cupão ainda é válido
    public function isValid(): bool
    {
        if (! $this->active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }
}