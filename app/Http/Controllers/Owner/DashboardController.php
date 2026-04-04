<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Métricas globais
        $totalEmpresas      = Company::count();
        $empresasActivas    = Company::where('active', true)->count();
        $empresasInactivas  = Company::where('active', false)->count();
        $totalAfiliados     = User::where('role', 'affiliate')->count();
        $totalVendas        = Commission::where('status', '!=', 'cancelada')->count();
        $totalComissoes     = Commission::where('status', '!=', 'cancelada')->sum('commission');
        $totalVolume        = Commission::where('status', '!=', 'cancelada')->sum('amount');

        // Crescimento de empresas por mês (últimos 12 meses)
        $crescimento = Company::selectRaw("strftime('%Y-%m', created_at) as mes, COUNT(*) as total")
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('mes')
            ->orderBy('mes')
            ->get()
            ->map(fn($r) => ['mes' => $r->mes, 'total' => $r->total]);

        // Ranking de empresas por volume de vendas
        $rankingEmpresas = Company::with('users')
            ->get()
            ->map(function ($company) {
                $vendas     = Commission::where('company_id', $company->id)->where('status', '!=', 'cancelada')->count();
                $comissoes  = Commission::where('company_id', $company->id)->where('status', '!=', 'cancelada')->sum('commission');
                $volume     = Commission::where('company_id', $company->id)->where('status', '!=', 'cancelada')->sum('amount');
                $afiliados  = $company->users->where('role', 'affiliate')->count();
                $ultimaVenda = Commission::where('company_id', $company->id)->latest()->first()?->created_at;

                return [
                    'id'           => $company->id,
                    'name'         => $company->name,
                    'email'        => $company->email,
                    'active'       => $company->active,
                    'vendas'       => $vendas,
                    'comissoes'    => round($comissoes, 2),
                    'volume'       => round($volume, 2),
                    'afiliados'    => $afiliados,
                    'ultima_venda' => $ultimaVenda?->format('d/m/Y') ?? 'Nunca',
                    'inactiva'     => $ultimaVenda ? $ultimaVenda->diffInDays(now()) > 30 : true,
                ];
            })
            ->sortByDesc('volume')
            ->values();

        // Actividade recente — últimas 10 vendas
        $actividadeRecente = Commission::with(['company', 'affiliate', 'product'])
            ->where('status', '!=', 'cancelada')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'empresa'   => $c->company?->name ?? '—',
                'afiliado'  => $c->affiliate?->name ?? '—',
                'produto'   => $c->product?->name ?? '—',
                'amount'    => $c->amount,
                'comissao'  => $c->commission,
                'data'      => $c->created_at->format('d/m/Y H:i'),
            ]);

        // Gráfico — volume de vendas por empresa
        $chartEmpresas = [
            'labels' => $rankingEmpresas->pluck('name')->toArray(),
            'volume' => $rankingEmpresas->pluck('volume')->toArray(),
            'vendas' => $rankingEmpresas->pluck('vendas')->toArray(),
        ];

        return Inertia::render('Owner/Dashboard', [
            'metrics' => [
                'total_empresas'     => $totalEmpresas,
                'empresas_activas'   => $empresasActivas,
                'empresas_inactivas' => $empresasInactivas,
                'total_afiliados'    => $totalAfiliados,
                'total_vendas'       => $totalVendas,
                'total_comissoes'    => round($totalComissoes, 2),
                'total_volume'       => round($totalVolume, 2),
            ],
            'crescimento'       => $crescimento,
            'rankingEmpresas'   => $rankingEmpresas,
            'actividadeRecente' => $actividadeRecente,
            'chartEmpresas'     => $chartEmpresas,
        ]);
    }
}