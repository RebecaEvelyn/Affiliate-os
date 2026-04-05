<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Company;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CancelController extends Controller
{
    public function cancel(Request $request): JsonResponse
    {
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

        $validated = $request->validate([
            'order_id' => ['required', 'string', 'max:255'],
        ]);

        $commissions = Commission::where('company_id', $company->id)
            ->where('order_id', $validated['order_id'])
            ->where('status', 'ativa')
            ->get();

        if ($commissions->isEmpty()) {
            return response()->json([
                'error' => 'Nenhuma comissão activa encontrada para este pedido.',
            ], 404);
        }

        foreach ($commissions as $commission) {
            $commission->update(['status' => 'cancelada']);

            // Cria notificação para o afiliado
            Notification::create([
                'affiliate_id'  => $commission->affiliate_id,
                'company_id'    => $commission->company_id,
                'type'          => 'danger',
                'title'         => 'Comissão Cancelada',
                'message'       => "A tua comissão de €{$commission->commission} referente ao pedido #{$commission->order_id} foi cancelada.",
                'commission_id' => $commission->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Comissão(ões) cancelada(s) com sucesso.',
            'data'    => [
                'order_id'               => $validated['order_id'],
                'commissions_cancelled'  => $commissions->count(),
            ],
        ], 200);
    }
}