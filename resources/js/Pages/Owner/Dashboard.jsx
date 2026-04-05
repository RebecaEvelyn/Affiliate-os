import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import AppLayout from '@/Layouts/AppLayout';

Chart.register(...registerables);

const PRIMARY   = '#667eea';
const PRIMARY_D = '#764ba2';

const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

function MetricCard({ icon, label, value, gradient }) {
    return (
        <div style={{ background: gradient, borderRadius: '16px', padding: '24px', color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.2s', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '12px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
}

function BarChart({ labels, data, color }) {
    const ref = useRef(null);
    const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        chart.current?.destroy();
        chart.current = new Chart(ref.current, {
            type: 'bar',
            data: { labels, datasets: [{ data, backgroundColor: color + 'BF', borderColor: color, borderWidth: 1, borderRadius: 6 }] },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: 280 }} />;
}

function LineChart({ labels, data, color }) {
    const ref = useRef(null);
    const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        chart.current?.destroy();
        chart.current = new Chart(ref.current, {
            type: 'line',
            data: { labels, datasets: [{ data, borderColor: color, backgroundColor: color + '26', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: color }] },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: 280 }} />;
}

const S = {
    card:     { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
    cardTitle:{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' },
    th:       { padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', borderBottom: `2px solid ${PRIMARY}`, background: '#f9fafb' },
    td:       { padding: '12px 16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #f3f4f6' },
    tdMuted:  { padding: '12px 16px', fontSize: '13px', color: '#9ca3af', borderBottom: '1px solid #f3f4f6' },
    tdPurple: { padding: '12px 16px', fontSize: '14px', color: PRIMARY_D, fontWeight: 600, borderBottom: '1px solid #f3f4f6' },
    rankNum:  (top) => ({ width: '32px', height: '32px', borderRadius: '50%', background: top ? `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)` : '#e5e7eb', color: top ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }),
    badgeOk:  { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeWarn:{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeErr: { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
};

export default function Dashboard({ metrics: m, crescimento, rankingEmpresas, actividadeRecente, chartEmpresas }) {
    const { auth } = usePage().props;

    const navItems = [
        { href: route('owner.dashboard'),        icon: '📊', label: 'Dashboard',  active: true },
        { href: route('owner.companies.index'),  icon: '🏢', label: 'Empresas',   active: false },
    ];

    const metricCards = [
        { icon: '🏢', label: 'Total de Empresas',     value: m.total_empresas,                       gradient: GRADIENTS[0] },
        { icon: '✅', label: 'Empresas Activas',       value: m.empresas_activas,                     gradient: GRADIENTS[1] },
        { icon: '🔴', label: 'Empresas Inactivas',     value: m.empresas_inactivas,                   gradient: GRADIENTS[2] },
        { icon: '👥', label: 'Total de Afiliados',     value: m.total_afiliados,                      gradient: GRADIENTS[3] },
        { icon: '🛒', label: 'Total de Vendas',        value: m.total_vendas,                         gradient: GRADIENTS[4] },
        { icon: '💰', label: 'Total de Comissões',     value: `€${m.total_comissoes.toFixed(2)}`,     gradient: GRADIENTS[5] },
        { icon: '📈', label: 'Volume Total de Vendas', value: `€${m.total_volume.toFixed(2)}`,        gradient: GRADIENTS[6] },
    ];

    return (
        <AppLayout user={auth?.user} navItems={navItems} subtitle="Painel do Owner" title="Painel do Owner">
            <Head title="Dashboard — Owner" />

            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                {metricCards.map((card, i) => <MetricCard key={i} {...card} />)}
            </div>

            {/* Gráficos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={S.card}>
                    <h3 style={S.cardTitle}>📅 Empresas Criadas por Mês</h3>
                    <LineChart labels={crescimento.map(r => r.mes)} data={crescimento.map(r => r.total)} color={PRIMARY} />
                </div>
                <div style={S.card}>
                    <h3 style={S.cardTitle}>💵 Volume de Vendas por Empresa</h3>
                    <BarChart labels={chartEmpresas.labels} data={chartEmpresas.volume} color={PRIMARY_D} />
                </div>
            </div>

            {/* Ranking */}
            <div style={S.card}>
                <h3 style={S.cardTitle}>🏆 Ranking de Empresas</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['#', 'Empresa', 'Afiliados', 'Vendas', 'Volume', 'Comissões', 'Última Venda', 'Estado', ''].map(h => (
                                    <th key={h} style={S.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rankingEmpresas.map((company, i) => (
                                <tr key={company.id}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={S.td}><div style={S.rankNum(i < 3)}>{i + 1}</div></td>
                                    <td style={S.td}>
                                        <div style={{ fontWeight: 600 }}>{company.name}</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{company.email}</div>
                                    </td>
                                    <td style={S.td}>{company.afiliados}</td>
                                    <td style={S.td}>{company.vendas}</td>
                                    <td style={S.tdPurple}>€{company.volume.toFixed(2)}</td>
                                    <td style={S.tdPurple}>€{company.comissoes.toFixed(2)}</td>
                                    <td style={S.tdMuted}>{company.ultima_venda}</td>
                                    <td style={S.td}>
                                        {!company.active ? (
                                            <span style={S.badgeErr}>Inactiva</span>
                                        ) : company.inactiva ? (
                                            <span style={S.badgeWarn}>⚠️ Sem vendas +30d</span>
                                        ) : (
                                            <span style={S.badgeOk}>✅ Activa</span>
                                        )}
                                    </td>
                                    <td style={S.td}>
                                        <Link href={route('owner.companies.show', company.id)} style={{ color: PRIMARY, textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
                                            Ver →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actividade recente */}
            <div style={S.card}>
                <h3 style={S.cardTitle}>⚡ Actividade Recente</h3>
                {actividadeRecente.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: '30px' }}>Nenhuma venda registada ainda.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Empresa', 'Afiliado', 'Produto', 'Volume', 'Comissão', 'Data'].map(h => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {actividadeRecente.map((row, i) => (
                                    <tr key={i}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ ...S.td, fontWeight: 600 }}>{row.empresa}</td>
                                        <td style={S.td}>{row.afiliado}</td>
                                        <td style={S.tdMuted}>{row.produto}</td>
                                        <td style={S.tdPurple}>€{Number(row.amount).toFixed(2)}</td>
                                        <td style={{ ...S.td, color: '#10b981', fontWeight: 600 }}>€{Number(row.comissao).toFixed(2)}</td>
                                        <td style={S.tdMuted}>{row.data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}