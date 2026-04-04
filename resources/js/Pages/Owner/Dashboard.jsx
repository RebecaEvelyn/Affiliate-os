import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// ─── Cores e gradientes (iguais ao plugin) ────────────────────────────────────
const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

const PRIMARY   = '#667eea';
const PRIMARY_D = '#764ba2';

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
    wrap:        { background: '#f6f8fa', minHeight: '100vh', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#333' },
    header:      { background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', padding: '40px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 10px 40px rgba(102,126,234,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft:  {},
    headerH1:    { margin: 0, fontSize: '28px', fontWeight: 700 },
    headerP:     { margin: '8px 0 0', opacity: 0.9, fontSize: '15px' },
    headerBtn:   { background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-block' },

    // Cards métricas com gradiente
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' },
    metricCard:  (gradient) => ({ background: gradient, color: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease', cursor: 'default' }),
    metricIcon:  { fontSize: '32px', lineHeight: 1 },
    metricLabel: { fontSize: '12px', opacity: 0.9, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    metricValue: { fontSize: '26px', fontWeight: 700, lineHeight: 1 },

    // Gráficos
    chartsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' },
    chartBox:    { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    chartTitle:  { margin: '0 0 15px', fontSize: '16px', fontWeight: 600, color: '#333', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6' },

    // Secção título
    sectionTitle:{ fontSize: '18px', fontWeight: 700, color: '#333', margin: '0 0 20px' },

    // Tabela ranking
    tableWrap:   { background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '30px' },
    tableHead:   { background: '#f9fafb' },
    th:          { padding: '14px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', color: '#6b7280', borderBottom: `2px solid ${PRIMARY}` },
    td:          { padding: '14px 16px', fontSize: '14px', color: '#333', borderBottom: '1px solid #f3f4f6' },
    tdMuted:     { padding: '14px 16px', fontSize: '13px', color: '#9ca3af', borderBottom: '1px solid #f3f4f6' },
    tdDestaque:  { padding: '14px 16px', fontSize: '14px', color: PRIMARY_D, fontWeight: 600, borderBottom: '1px solid #f3f4f6' },
    badgeActivo: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeInact:  { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeAlerta: { background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    rankNum:     { width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' },

    // Actividade recente
    actBox:      { background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '30px' },
    actHeader:   { padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    actTitle:    { margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' },
    actRow:      { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto auto', gap: '10px', padding: '12px 20px', borderBottom: '1px solid #f9fafb', alignItems: 'center', fontSize: '13px' },
    actRowHead:  { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto auto', gap: '10px', padding: '10px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.5px' },

    // Nav
    nav:         { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' },
    navBtn:      { padding: '8px 16px', border: '1px solid #e9ecef', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', textDecoration: 'none', color: '#333' },
};

// ─── Chart Components ─────────────────────────────────────────────────────────
function BarChart({ labels, data, color, height = 280 }) {
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
    return <canvas ref={ref} style={{ maxHeight: height }} />;
}

function LineChart({ labels, data, color, height = 280 }) {
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
    return <canvas ref={ref} style={{ maxHeight: height }} />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard({ metrics: m, crescimento, rankingEmpresas, actividadeRecente, chartEmpresas }) {

    const metricCards = [
        { icon: '🏢', label: 'Total de Empresas',     value: m.total_empresas,                        gradient: GRADIENTS[0] },
        { icon: '✅', label: 'Empresas Activas',       value: m.empresas_activas,                      gradient: GRADIENTS[3] },
        { icon: '🔴', label: 'Empresas Inactivas',     value: m.empresas_inactivas,                    gradient: GRADIENTS[1] },
        { icon: '👥', label: 'Total de Afiliados',     value: m.total_afiliados,                       gradient: GRADIENTS[2] },
        { icon: '🛒', label: 'Total de Vendas',        value: m.total_vendas,                          gradient: GRADIENTS[4] },
        { icon: '💰', label: 'Total de Comissões',     value: `€${m.total_comissoes.toFixed(2)}`,      gradient: GRADIENTS[5] },
        { icon: '📈', label: 'Volume Total de Vendas', value: `€${m.total_volume.toFixed(2)}`,         gradient: GRADIENTS[6] },
    ];

    return (
        <>
            <Head title="Dashboard — Owner" />
            <div style={S.wrap}>

                {/* Header */}
                <div style={S.header}>
                    <div style={S.headerLeft}>
                        <h1 style={S.headerH1}>📊 Painel do Owner</h1>
                        <p style={S.headerP}>Visão global do Affiliate OS SaaS</p>
                    </div>
                    <Link href={route('owner.companies.index')} style={S.headerBtn}>
                        🏢 Gerir Empresas
                    </Link>
                </div>

                {/* Cards métricas */}
                <div style={S.metricsGrid}>
                    {metricCards.map((card, i) => (
                        <div key={i} style={S.metricCard(card.gradient)}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <span style={S.metricIcon}>{card.icon}</span>
                            <div>
                                <div style={S.metricLabel}>{card.label}</div>
                                <div style={S.metricValue}>{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gráficos */}
                <div style={S.chartsGrid}>
                    <div style={S.chartBox}>
                        <h3 style={S.chartTitle}>📅 Empresas Criadas por Mês</h3>
                        <LineChart
                            labels={crescimento.map(r => r.mes)}
                            data={crescimento.map(r => r.total)}
                            color={PRIMARY}
                        />
                    </div>
                    <div style={S.chartBox}>
                        <h3 style={S.chartTitle}>💵 Volume de Vendas por Empresa</h3>
                        <BarChart
                            labels={chartEmpresas.labels}
                            data={chartEmpresas.volume}
                            color={PRIMARY_D}
                        />
                    </div>
                </div>

                {/* Ranking de empresas */}
                <h2 style={S.sectionTitle}>🏆 Ranking de Empresas</h2>
                <div style={S.tableWrap}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={S.tableHead}>
                            <tr>
                                <th style={S.th}>#</th>
                                <th style={S.th}>Empresa</th>
                                <th style={S.th}>Afiliados</th>
                                <th style={S.th}>Vendas</th>
                                <th style={S.th}>Volume</th>
                                <th style={S.th}>Comissões</th>
                                <th style={S.th}>Última Venda</th>
                                <th style={S.th}>Estado</th>
                                <th style={S.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingEmpresas.map((company, i) => (
                                <tr key={company.id}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={S.td}>
                                        <div style={{ ...S.rankNum, background: i < 3 ? `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)` : '#e5e7eb', color: i < 3 ? 'white' : '#6b7280' }}>
                                            {i + 1}
                                        </div>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ fontWeight: 600 }}>{company.name}</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{company.email}</div>
                                    </td>
                                    <td style={S.td}>{company.afiliados}</td>
                                    <td style={S.td}>{company.vendas}</td>
                                    <td style={S.tdDestaque}>€{company.volume.toFixed(2)}</td>
                                    <td style={S.tdDestaque}>€{company.comissoes.toFixed(2)}</td>
                                    <td style={S.tdMuted}>{company.ultima_venda}</td>
                                    <td style={S.td}>
                                        {!company.active ? (
                                            <span style={S.badgeInact}>Inactiva</span>
                                        ) : company.inactiva ? (
                                            <span style={S.badgeAlerta}>⚠️ Sem vendas +30d</span>
                                        ) : (
                                            <span style={S.badgeActivo}>✅ Activa</span>
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

                {/* Actividade recente */}
                <h2 style={S.sectionTitle}>⚡ Actividade Recente</h2>
                <div style={S.actBox}>
                    <div style={S.actRowHead}>
                        <span>Empresa</span>
                        <span>Afiliado</span>
                        <span>Produto</span>
                        <span>Volume</span>
                        <span>Comissão</span>
                        <span>Data</span>
                    </div>
                    {actividadeRecente.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                            Nenhuma venda registada ainda.
                        </div>
                    ) : actividadeRecente.map((row, i) => (
                        <div key={i} style={{ ...S.actRow, background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>{row.empresa}</span>
                            <span style={{ color: '#555' }}>{row.afiliado}</span>
                            <span style={{ color: '#777' }}>{row.produto}</span>
                            <span style={{ color: PRIMARY_D, fontWeight: 600 }}>€{Number(row.amount).toFixed(2)}</span>
                            <span style={{ color: '#28a745', fontWeight: 600 }}>€{Number(row.comissao).toFixed(2)}</span>
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{row.data}</span>
                        </div>
                    ))}
                </div>

                {/* Navegação */}
                <div style={S.nav}>
                    <Link href={route('owner.companies.index')} style={S.navBtn}>🏢 Empresas</Link>
                </div>

            </div>
        </>
    );
}