<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->company;
        $data    = $this->getMetrics($company->id, 'mes');

        return Inertia::render('Admin/Dashboard', [
            'company'    => $company,
            'metrics'    => $data['metrics'],
            'affiliates' => $data['affiliates'],
            'charts'     => $data['charts'],
            'periodo'    => $data['periodo'],
        ]);
    }

    public function filter(Request $request)
    {
        $company    = $request->user()->company;
        $periodo    = $request->input('periodo', 'mes');
        $dataInicio = $request->input('data_inicio');
        $dataFim    = $request->input('data_fim');

        return response()->json(
            $this->getMetrics($company->id, $periodo, $dataInicio, $dataFim)
        );
    }

    public function affiliateDetails(Request $request, User $affiliate)
    {
        $company = $request->user()->company;

        // Garante que o afiliado pertence à empresa
        if ($affiliate->company_id !== $company->id) {
            return response()->json(['error' => 'Não autorizado.'], 403);
        }

        $periodo    = $request->input('periodo', 'mes');
        $dataInicio = $request->input('data_inicio');
        $dataFim    = $request->input('data_fim');

        [$inicio, $fim] = $this->resolvePeriodo($periodo, $dataInicio, $dataFim);

        $baseQuery = Commission::where('company_id', $company->id)
            ->where('affiliate_id', $affiliate->id)
            ->where('status', '!=', 'cancelada');

        // Métricas fixas
        $comissoesHoje  = (clone $baseQuery)->whereDate('created_at', today())->sum('commission');
        $comissoesMes   = (clone $baseQuery)
            ->whereDate('created_at', '>=', now()->startOfMonth())
            ->whereDate('created_at', '<=', now()->endOfMonth())
            ->sum('commission');
        $comissoesTotal = (clone $baseQuery)->sum('commission');
        $vendasTotal    = (clone $baseQuery)->count();

        // Vendas no período
        $vendasPeriodo = (clone $baseQuery)
            ->whereBetween('created_at', [$inicio->copy()->startOfDay(), $fim->copy()->endOfDay()])
            ->with('product')
            ->orderByDesc('created_at')
            ->get();

        $comissoesPeriodo = $vendasPeriodo->sum('commission');

        // Histórico formatado
        $historico = $vendasPeriodo->map(fn($c) => [
            'data'      => $c->created_at->format('d/m/Y'),
            'produto'   => $c->product?->name ?? 'Produto não encontrado',
            'preco'     => $c->amount,
            'comissao'  => $c->commission,
            'order_id'  => $c->order_id,
        ]);

        // Evolução diária no período
        $evolucao = (clone $baseQuery)
            ->whereBetween('created_at', [$inicio->copy()->startOfDay(), $fim->copy()->endOfDay()])
            ->selectRaw('DATE(created_at) as dia, SUM(commission) as total_comissoes, COUNT(*) as total_vendas')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        $charts = [
            'comissoes' => [
                'labels' => $evolucao->pluck('dia')->toArray(),
                'data'   => $evolucao->pluck('total_comissoes')->map(fn($v) => round($v, 2))->toArray(),
            ],
            'vendas' => [
                'labels' => $evolucao->pluck('dia')->toArray(),
                'data'   => $evolucao->pluck('total_vendas')->toArray(),
            ],
        ];

        return response()->json([
            'affiliate' => [
                'id'    => $affiliate->id,
                'name'  => $affiliate->name,
                'email' => $affiliate->email,
            ],
            'metrics' => [
                'comissoes_hoje'     => round($comissoesHoje, 2),
                'comissoes_mes'      => round($comissoesMes, 2),
                'comissoes_total'    => round($comissoesTotal, 2),
                'vendas_total'       => $vendasTotal,
                'vendas_periodo'     => $vendasPeriodo->count(),
                'comissoes_periodo'  => round($comissoesPeriodo, 2),
            ],
            'historico' => $historico,
            'charts'    => $charts,
            'periodo'   => [
                'inicio' => $inicio->format('d/m/Y'),
                'fim'    => $fim->format('d/m/Y'),
            ],
        ]);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function getMetrics(int $companyId, string $periodo, ?string $dataInicio = null, ?string $dataFim = null): array
    {
        [$inicio, $fim] = $this->resolvePeriodo($periodo, $dataInicio, $dataFim);

        $base = Commission::where('company_id', $companyId)->where('status', '!=', 'cancelada');

        $comissoesHoje   = (clone $base)->whereDate('created_at', today())->sum('commission');
        $comissoesMes    = (clone $base)->whereDate('created_at', '>=', now()->startOfMonth())->whereDate('created_at', '<=', now()->endOfMonth())->sum('commission');
        $vendasHoje      = (clone $base)->whereDate('created_at', today())->count();
        $vendasMes       = (clone $base)->whereDate('created_at', '>=', now()->startOfMonth())->whereDate('created_at', '<=', now()->endOfMonth())->count();
        $totalVendasMes  = (clone $base)->whereDate('created_at', '>=', now()->startOfMonth())->whereDate('created_at', '<=', now()->endOfMonth())->sum('amount');

        $affiliates = (clone $base)
            ->whereBetween('created_at', [$inicio->copy()->startOfDay(), $fim->copy()->endOfDay()])
            ->with('affiliate')
            ->get()
            ->groupBy('affiliate_id')
            ->map(function ($items) {
                $affiliate = $items->first()->affiliate;
                return [
                    'id'        => $affiliate->id,
                    'name'      => $affiliate->name,
                    'email'     => $affiliate->email,
                    'vendas'    => $items->count(),
                    'comissoes' => round($items->sum('commission'), 2),
                    'amount'    => round($items->sum('amount'), 2),
                ];
            })->values();

        $evolucao = (clone $base)
            ->whereBetween('created_at', [$inicio->copy()->startOfDay(), $fim->copy()->endOfDay()])
            ->selectRaw('DATE(created_at) as dia, SUM(commission) as total_comissoes, COUNT(*) as total_vendas')
            ->groupBy('dia')->orderBy('dia')->get();

        return [
            'metrics' => [
                'comissoes_hoje'   => round($comissoesHoje, 2),
                'comissoes_mes'    => round($comissoesMes, 2),
                'vendas_hoje'      => $vendasHoje,
                'vendas_mes'       => $vendasMes,
                'total_vendas_mes' => round($totalVendasMes, 2),
            ],
            'affiliates' => $affiliates,
            'charts' => [
                'comissoes' => ['labels' => $affiliates->pluck('name')->toArray(), 'data' => $affiliates->pluck('comissoes')->toArray()],
                'vendas'    => ['labels' => $affiliates->pluck('name')->toArray(), 'data' => $affiliates->pluck('vendas')->toArray()],
                'evolucao'  => [
                    'labels'    => $evolucao->pluck('dia')->toArray(),
                    'comissoes' => $evolucao->pluck('total_comissoes')->map(fn($v) => round($v, 2))->toArray(),
                    'vendas'    => $evolucao->pluck('total_vendas')->toArray(),
                ],
            ],
            'periodo' => ['inicio' => $inicio->format('Y-m-d'), 'fim' => $fim->format('Y-m-d')],
        ];
    }

    private function resolvePeriodo(string $periodo, ?string $dataInicio, ?string $dataFim): array
    {
        return match ($periodo) {
            'hoje'           => [now(), now()],
            'ontem'          => [now()->subDay(), now()->subDay()],
            'semana'         => [now()->startOfWeek(), now()->endOfWeek()],
            'semana_passada' => [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()],
            'mes'            => [now()->startOfMonth(), now()->endOfMonth()],
            'mes_passado'    => [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()],
            'ultimos_30'     => [now()->subDays(30), now()],
            'ultimos_90'     => [now()->subDays(90), now()],
            'ano'            => [now()->startOfYear(), now()->endOfYear()],
            'total'          => [Carbon::create(2000, 1, 1), now()],
            'personalizado'  => [Carbon::parse($dataInicio), Carbon::parse($dataFim)],
            default          => [now()->startOfMonth(), now()->endOfMonth()],
        };
    }
}