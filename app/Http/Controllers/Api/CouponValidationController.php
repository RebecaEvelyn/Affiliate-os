<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CouponValidationController extends Controller
{
    public function validate(Request $request, string $code): JsonResponse
    {
        // 1. Valida a API Key
        $apiKey = $request->header('X-API-Key');

        if (! $apiKey) {
            return response()->json(['error' => 'API Key não fornecida.'], 401);
        }

        $company = Company::where('api_key', $apiKey)->first();

        if (! $company) {
            return response()->json(['error' => 'API Key inválida.'], 401);
        }

        if (! $company->active) {
            return response()->json(['error' => 'Empresa inactiva.'], 403);
        }

        // 2. Procura o cupão
        $coupon = Coupon::with('affiliate')
            ->where('company_id', $company->id)
            ->where('code', strtoupper($code))
            ->first();

        if (! $coupon) {
            return response()->json([
                'valid'   => false,
                'error'   => 'Cupão não encontrado.',
            ], 404);
        }

        if (! $coupon->active) {
            return response()->json([
                'valid'   => false,
                'error'   => 'Cupão inactivo.',
            ], 422);
        }

        if (! $coupon->isValid()) {
            $reason = 'Cupão inválido.';

            if ($coupon->expires_at && $coupon->expires_at->isPast()) {
                $reason = 'Cupão expirado.';
            } elseif ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
                $reason = 'Limite de utilizações atingido.';
            }

            return response()->json([
                'valid' => false,
                'error' => $reason,
            ], 422);
        }

        // 3. Retorna informações do cupão
        return response()->json([
            'valid' => true,
            'data'  => [
                'code'                => $coupon->code,
                'affiliate'           => $coupon->affiliate->name,
                'discount_percentage' => $coupon->discount_percentage,
                'free_shipping'       => $coupon->free_shipping,
                'expires_at'          => $coupon->expires_at?->format('d/m/Y') ?? null,
                'usage_count'         => $coupon->usage_count,
                'usage_limit'         => $coupon->usage_limit,
                'uses_remaining'      => $coupon->usage_limit
                    ? $coupon->usage_limit - $coupon->usage_count
                    : null,
            ],
        ], 200);
    }
}