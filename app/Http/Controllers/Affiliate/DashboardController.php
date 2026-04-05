<?php

namespace App\Http\Controllers\Affiliate;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $base = Commission::where('affiliate_id', $user->id);

        // Métricas
        $comissoesMesActual  = (clone $base)->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->where('status', '!=', 'cancelada')->sum('commission');
        $comissoesMesAnterior = (clone $base)->whereMonth('created_at', now()->subMonth()->month)->whereYear('created_at', now()->subMonth()->year)->where('status', '!=', 'cancelada')->sum('commission');
        $comissoesHoje       = (clone $base)->whereDate('created_at', today())->where('status', '!=', 'cancelada')->sum('commission');
        $comissoesTotal      = (clone $base)->where('status', '!=', 'cancelada')->sum('commission');

        $vendasHoje          = (clone $base)->whereDate('created_at', today())->where('status', '!=', 'cancelada')->count();
        $vendasMesActual     = (clone $base)->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->where('status', '!=', 'cancelada')->count();
        $vendasSemana        = (clone $base)->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->where('status', '!=', 'cancelada')->count();
        $vendasSemanaAnterior = (clone $base)->whereBetween('created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()])->where('status', '!=', 'cancelada')->count();

        // Gráfico comparativo mensal (últimos 6 meses)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = now()->subMonths($i);
            $chartData[] = [
                'mes'       => $mes->format('M/Y'),
                'comissoes' => round((clone $base)->whereMonth('created_at', $mes->month)->whereYear('created_at', $mes->year)->where('status', '!=', 'cancelada')->sum('commission'), 2),
                'vendas'    => (clone $base)->whereMonth('created_at', $mes->month)->whereYear('created_at', $mes->year)->where('status', '!=', 'cancelada')->count(),
            ];
        }

        // Notificações não lidas
        $unreadNotifications = Notification::where('affiliate_id', $user->id)->where('read', false)->count();

        return Inertia::render('Affiliate/Dashboard', [
            'affiliate' => $user,
            'metrics'   => [
                'comissoes_mes_actual'    => round($comissoesMesActual, 2),
                'comissoes_mes_anterior'  => round($comissoesMesAnterior, 2),
                'comissoes_hoje'          => round($comissoesHoje, 2),
                'comissoes_total'         => round($comissoesTotal, 2),
                'vendas_hoje'             => $vendasHoje,
                'vendas_mes_actual'       => $vendasMesActual,
                'vendas_semana'           => $vendasSemana,
                'vendas_semana_anterior'  => $vendasSemanaAnterior,
            ],
            'chartData'           => $chartData,
            'unreadNotifications' => $unreadNotifications,
        ]);
    }

    public function report(Request $request)
    {
        $user      = $request->user();
        $mesInicio = $request->input('mes_inicio', now()->month);
        $anoInicio = $request->input('ano_inicio', now()->year);
        $mesFim    = $request->input('mes_fim', now()->month);
        $anoFim    = $request->input('ano_fim', now()->year);

        $inicio = Carbon::create($anoInicio, $mesInicio, 1)->startOfMonth();
        $fim    = Carbon::create($anoFim, $mesFim, 1)->endOfMonth();

        $commissions = Commission::with('product', 'coupon')
            ->where('affiliate_id', $user->id)
            ->whereBetween('created_at', [$inicio, $fim])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                'data'     => $c->created_at->format('d/m/Y'),
                'produto'  => $c->product?->name ?? '—',
                'cupao'    => $c->coupon?->code ?? '—',
                'amount'   => $c->amount,
                'comissao' => $c->commission,
                'status'   => $c->status,
                'order_id' => $c->order_id,
            ]);

        $total = $commissions->where('status', '!=', 'cancelada')->sum('comissao');

        return response()->json([
            'commissions' => $commissions,
            'total'       => round($total, 2),
            'periodo'     => [
                'inicio' => $inicio->format('d/m/Y'),
                'fim'    => $fim->format('d/m/Y'),
            ],
        ]);
    }

    public function notifications(Request $request)
    {
        $user = $request->user();

        $notifications = Notification::where('affiliate_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($n) => [
                'id'         => $n->id,
                'type'       => $n->type,
                'title'      => $n->title,
                'message'    => $n->message,
                'read'       => $n->read,
                'created_at' => $n->created_at->format('d/m/Y H:i'),
            ]);

        // Marca todas como lidas
        Notification::where('affiliate_id', $user->id)->where('read', false)->update(['read' => true]);

        return response()->json(['notifications' => $notifications]);
    }
}