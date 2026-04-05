<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Company;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalesController extends Controller
{
    public function store(Request $request): JsonResponse
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

        // 2. Valida os campos
        $validated = $request->validate([
            'order_id'       => ['required', 'string', 'max:255'],
            'coupon_code'    => ['nullable', 'string', 'max:255'],
            'affiliate_code' => ['nullable', 'string', 'max:255'],
            'product_id'     => ['required', 'string', 'max:255'],
            'product_name'   => ['nullable', 'string', 'max:255'],
            'amount'         => ['required', 'numeric', 'min:0.01'],
        ]);

        if (empty($validated['coupon_code']) && empty($validated['affiliate_code'])) {
            return response()->json(['error' => 'Deve fornecer coupon_code ou affiliate_code.'], 422);
        }

        // 3. Procura o produto
        $product = Product::where('company_id', $company->id)
            ->where('external_id', $validated['product_id'])
            ->where('active', true)
            ->first();

        if (! $product) {
            return response()->json(['error' => 'Produto não encontrado ou inactivo.'], 404);
        }

        // 4. Resolve afiliados
        $coupon            = null;
        $affiliateByCoupon = null;
        $affiliateByCode   = null;

        if (!empty($validated['coupon_code'])) {
            $coupon = Coupon::where('company_id', $company->id)
                ->where('code', strtoupper($validated['coupon_code']))
                ->where('active', true)
                ->first();

            if ($coupon && $coupon->isValid()) {
                $affiliateByCoupon = $coupon->affiliate_id;
            }
        }

        if (!empty($validated['affiliate_code'])) {
            $affiliateUser = User::where('company_id', $company->id)
                ->where('affiliate_code', strtoupper($validated['affiliate_code']))
                ->where('active', true)
                ->first();

            if ($affiliateUser) {
                $affiliateByCode = $affiliateUser->id;
            }
        }

        // 5. Determina quais afiliados recebem comissão
        $affiliatesToCommission = [];

        if ($affiliateByCoupon && $affiliateByCode) {
            if ($affiliateByCoupon === $affiliateByCode) {
                // Mesmo afiliado — 1 comissão apenas (cupão tem prioridade)
                $affiliatesToCommission[] = ['affiliate_id' => $affiliateByCoupon, 'coupon_id' => $coupon->id, 'source' => 'coupon'];
            } else {
                // Afiliados diferentes — 2 comissões
                $affiliatesToCommission[] = ['affiliate_id' => $affiliateByCoupon, 'coupon_id' => $coupon->id, 'source' => 'coupon'];
                $affiliatesToCommission[] = ['affiliate_id' => $affiliateByCode, 'coupon_id' => null, 'source' => 'link'];
            }
        } elseif ($affiliateByCoupon) {
            $affiliatesToCommission[] = ['affiliate_id' => $affiliateByCoupon, 'coupon_id' => $coupon->id, 'source' => 'coupon'];
        } elseif ($affiliateByCode) {
            $affiliatesToCommission[] = ['affiliate_id' => $affiliateByCode, 'coupon_id' => null, 'source' => 'link'];
        }

        if (empty($affiliatesToCommission)) {
            return response()->json(['error' => 'Nenhum afiliado válido encontrado.'], 404);
        }

        // 6. Calcula e regista comissões
        $commissionValue = round(($validated['amount'] * $product->commission_rate) / 100, 2);
        $registered      = [];

        foreach ($affiliatesToCommission as $entry) {
            $alreadyExists = Commission::where('company_id', $company->id)
                ->where('order_id', $validated['order_id'])
                ->where('product_id', $product->id)
                ->where('affiliate_id', $entry['affiliate_id'])
                ->exists();

            if ($alreadyExists) continue;

            $commission = Commission::create([
                'company_id'   => $company->id,
                'affiliate_id' => $entry['affiliate_id'],
                'product_id'   => $product->id,
                'coupon_id'    => $entry['coupon_id'],
                'order_id'     => $validated['order_id'],
                'amount'       => $validated['amount'],
                'commission'   => $commissionValue,
                'status'       => 'ativa',
            ]);

            if ($entry['coupon_id'] && $coupon) {
                $coupon->increment('usage_count');
            }

            $affiliate = User::find($entry['affiliate_id']);

            $registered[] = [
                'commission_id'   => $commission->id,
                'affiliate'       => $affiliate->name,
                'source'          => $entry['source'],
                'commission_rate' => $product->commission_rate . '%',
                'commission'      => $commissionValue,
                'status'          => 'ativa',
            ];
        }

        if (empty($registered)) {
            return response()->json(['error' => 'Esta venda já foi registada.'], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Comissão(ões) registada(s) com sucesso.',
            'data'    => [
                'order_id'    => $validated['order_id'],
                'product'     => $product->name,
                'amount'      => $validated['amount'],
                'commissions' => $registered,
            ],
        ], 201);
    }
}