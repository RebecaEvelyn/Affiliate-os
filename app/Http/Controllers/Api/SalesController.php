<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Company;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalesController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // 1. Valida a API Key
        $apiKey = $request->header('X-API-Key');

        if (! $apiKey) {
            return response()->json([
                'error' => 'API Key não fornecida.',
            ], 401);
        }

        $company = Company::where('api_key', $apiKey)->first();

        if (! $company) {
            return response()->json([
                'error' => 'API Key inválida.',
            ], 401);
        }

        // 2. Verifica se a empresa está activa
        if (! $company->active) {
            return response()->json([
                'error' => 'Empresa inactiva.',
            ], 403);
        }

        // 3. Valida os campos obrigatórios
        $validated = $request->validate([
            'order_id'     => ['required', 'string', 'max:255'],
            'coupon_code'  => ['required', 'string', 'max:255'],
            'product_id'   => ['required', 'string', 'max:255'],
            'product_name' => ['nullable', 'string', 'max:255'],
            'amount'       => ['required', 'numeric', 'min:0.01'],
        ]);

        // 4. Procura o cupão na empresa
        $coupon = Coupon::where('company_id', $company->id)
            ->where('code', strtoupper($validated['coupon_code']))
            ->where('active', true)
            ->first();

        if (! $coupon) {
            return response()->json([
                'error' => 'Cupão não encontrado ou inactivo.',
            ], 404);
        }

        // Verifica se o cupão ainda é válido
        if (! $coupon->isValid()) {
            return response()->json([
                'error' => 'Cupão expirado ou limite de utilizações atingido.',
            ], 422);
        }

        // 5. Procura o produto pelo external_id na empresa
        $product = Product::where('company_id', $company->id)
            ->where('external_id', $validated['product_id'])
            ->where('active', true)
            ->first();

        if (! $product) {
            return response()->json([
                'error' => 'Produto não encontrado ou inactivo. Registe o produto no painel antes de enviar vendas.',
            ], 404);
        }

        // 6. Verifica se a venda já foi registada (idempotência)
        $alreadyExists = Commission::where('company_id', $company->id)
            ->where('order_id', $validated['order_id'])
            ->where('product_id', $product->id)
            ->exists();

        if ($alreadyExists) {
            return response()->json([
                'error' => 'Esta venda já foi registada.',
            ], 409);
        }

        // 7. Calcula a comissão
        $commissionValue = round(($validated['amount'] * $product->commission_rate) / 100, 2);

        // 8. Regista a comissão
        $commission = Commission::create([
            'company_id'   => $company->id,
            'affiliate_id' => $coupon->affiliate_id,
            'product_id'   => $product->id,
            'coupon_id'    => $coupon->id,
            'order_id'     => $validated['order_id'],
            'amount'       => $validated['amount'],
            'commission'   => $commissionValue,
            'status'       => 'ativa',
        ]);

        // 9. Incrementa o usage_count do cupão
        $coupon->increment('usage_count');

        // 10. Retorna resposta de sucesso
        return response()->json([
            'success'    => true,
            'message'    => 'Comissão registada com sucesso.',
            'data'       => [
                'commission_id'   => $commission->id,
                'order_id'        => $commission->order_id,
                'affiliate'       => $coupon->affiliate->name,
                'product'         => $product->name,
                'amount'          => $commission->amount,
                'commission_rate' => $product->commission_rate . '%',
                'commission'      => $commission->commission,
                'status'          => $commission->status,
            ],
        ], 201);
    }
}