<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Company extends Model
{
    protected $fillable = [
        'name',
        'email',
        'active',
        'api_key',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }

    // Gera uma API Key única
    public static function generateApiKey(): string
    {
        do {
            $key = 'aos_' . Str::random(40);
        } while (self::where('api_key', $key)->exists());

        return $key;
    }

    // Regenera a API Key da empresa
    public function regenerateApiKey(): string
    {
        $key = self::generateApiKey();
        $this->update(['api_key' => $key]);
        return $key;
    }
}