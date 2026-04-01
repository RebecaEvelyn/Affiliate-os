import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const PRIMARY   = '#667eea';
const PRIMARY_D = '#764ba2';
const GRADIENT  = `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`;

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
    wrap:        { background: '#f8f9fa', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", system-ui, sans-serif', color: '#333' },
    header:      { background: GRADIENT, color: 'white', padding: '40px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 10px 40px rgba(102,126,234,0.15)' },
    headerH1:    { margin: 0, fontSize: '28px', fontWeight: 700 },
    headerP:     { margin: '8px 0 0', opacity: 0.9, fontSize: '15px' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    metricCard:  (c) => ({ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e9ecef', borderLeft: `5px solid ${c}`, display: 'flex', alignItems: 'center', gap: '20px' }),
    metricIcon:  { fontSize: '36px', lineHeight: 1 },
    metricLabel: { fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' },
    metricValue: { fontSize: '26px', fontWeight: 700, color: '#333', lineHeight: 1 },
    filters:     { background: 'white', padding: '20px 25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end', border: '1px solid #e9ecef' },
    filterGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '180px' },
    filterLabel: { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', color: '#333' },
    filterInput: { padding: '10px 12px', border: '1px solid #e9ecef', borderRadius: '8px', fontSize: '14px', background: 'white' },
    filterBtn:   { padding: '10px 24px', background: GRADIENT, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
    chartsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' },
    chartBox:    { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e9ecef' },
    chartTitle:  { margin: '0 0 20px', fontSize: '16px', fontWeight: 600, paddingBottom: '15px', borderBottom: '2px solid #f8f9fa' },
    affiliatesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' },
    affiliateCard:  { background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e9ecef', overflow: 'hidden' },
    cardHeader:     { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f0f0f0' },
    cardName:       { margin: 0, fontSize: '16px', fontWeight: 600 },
    cardEmail:      { margin: '4px 0 0', fontSize: '13px', color: '#999' },
    badgeAtivo:     { background: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' },
    badgeInativo:   { background: '#f8d7da', color: '#721c24', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' },
    cardMetrics:    { display: 'flex', padding: '15px 20px', borderBottom: '1px solid #f0f0f0' },
    metricItem:     { flex: 1, textAlign: 'center', padding: '0 10px' },
    metricItemLabel:{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' },
    metricItemValue:{ fontSize: '18px', fontWeight: 700, color: '#333' },
    cardFooter:     { padding: '15px 20px' },
    btnDetalhes:    { width: '100%', padding: '10px', background: GRADIENT, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
    nav:            { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' },
    navBtn:         { padding: '8px 16px', border: '1px solid #e9ecef', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' },

    // Modal
    overlay:       { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px 0' },
    modal:         { background: 'white', borderRadius: '12px', width: '90%', maxWidth: '900px', overflow: 'hidden', marginTop: '20px' },
    modalHeader:   { background: GRADIENT, color: 'white', padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle:    { margin: 0, fontSize: '22px', fontWeight: 700 },
    modalClose:    { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '20px', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalFilters:  { background: '#f8f9fa', padding: '15px 30px', display: 'flex', gap: '15px', alignItems: 'flex-end', borderBottom: '1px solid #e9ecef', flexWrap: 'wrap' },
    modalBody:     { padding: '25px 30px' },
    modalSubtitle: { margin: '0 0 5px', fontSize: '15px', color: '#555' },
    modalPeriodo:  { margin: '0 0 20px', fontSize: '13px', color: '#999' },

    // Cards métricas modal
    modalMetricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '25px' },
    modalMetricBox:   (destaque) => ({
        background: destaque ? GRADIENT : '#f8f9fa',
        color: destaque ? 'white' : '#333',
        borderRadius: '10px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    }),
    modalMetricLabel: (destaque) => ({ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', opacity: destaque ? 0.85 : 0.6 }),
    modalMetricValue: { fontSize: '20px', fontWeight: 700 },

    // Modal gráficos
    modalChartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '25px' },

    // Tabela histórico
    tableWrap:  { overflowX: 'auto' },
    tableHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    tableTitle: { margin: 0, fontSize: '16px', fontWeight: 600 },
    tablePeriod:{ fontSize: '13px', color: '#999', background: '#f8f9fa', padding: '4px 12px', borderRadius: '20px' },
    table:      { width: '100%', borderCollapse: 'collapse' },
    th:         { padding: '12px 15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', color: '#555', background: '#f8f9fa', borderBottom: '2px solid #667eea' },
    td:         { padding: '12px 15px', borderBottom: '1px solid #e9ecef', fontSize: '14px', color: '#333' },
    tdDestaque: { padding: '12px 15px', borderBottom: '1px solid #e9ecef', fontSize: '14px', color: PRIMARY_D, fontWeight: 600 },
    tfootTd:    { padding: '12px 15px', fontWeight: 700, fontSize: '14px', color: '#333' },
};

// ─── Chart Components ─────────────────────────────────────────────────────────
function BarChart({ labels, data, color, height = 250 }) {
    const ref = useRef(null);
    const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        chart.current?.destroy();
        chart.current = new Chart(ref.current, {
            type: 'bar',
            data: { labels, datasets: [{ data, backgroundColor: color + 'BF', borderColor: color, borderWidth: 1, borderRadius: 4 }] },
            options: { responsive: true, plugins: { legend: { display: false } } },
        });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: height }} />;
}

function LineChart({ labels, data, color, height = 250 }) {
    const ref = useRef(null);
    const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        chart.current?.destroy();
        chart.current = new Chart(ref.current, {
            type: 'line',
            data: { labels, datasets: [{ data, borderColor: color, backgroundColor: color + '26', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3 }] },
            options: { responsive: true, plugins: { legend: { display: false } } },
        });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: height }} />;
}

// ─── Modal Detalhes ───────────────────────────────────────────────────────────
function AffiliateModal({ affiliateId, onClose }) {
    const [periodo, setPeriodo]       = useState('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim]       = useState('');
    const [loading, setLoading]       = useState(true);
    const [data, setData]             = useState(null);

    function load(p = periodo, di = dataInicio, df = dataFim) {
        setLoading(true);
        fetch(route('admin.dashboard.affiliate', affiliateId) + `?periodo=${p}&data_inicio=${di}&data_fim=${df}`, {
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        })
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    function handleFilter() {
        if (periodo === 'personalizado' && (!dataInicio || !dataFim)) return;
        load(periodo, dataInicio, dataFim);
    }

    useEffect(() => {
        if (periodo !== 'personalizado') load(periodo);
    }, [periodo]);

    const metricCards = data ? [
        { icon: '🔥', label: 'Comissões Hoje',      value: `€${data.metrics.comissoes_hoje.toFixed(2)}`,    destaque: false },
        { icon: '📊', label: 'Comissões Este Mês',  value: `€${data.metrics.comissoes_mes.toFixed(2)}`,     destaque: false },
        { icon: '💵', label: 'Total Comissões',      value: `€${data.metrics.comissoes_total.toFixed(2)}`,   destaque: true  },
        { icon: '🛒', label: 'Total de Vendas',      value: data.metrics.vendas_total,                       destaque: false },
        { icon: '📅', label: 'Vendas no Período',    value: data.metrics.vendas_periodo,                     destaque: false },
        { icon: '💰', label: 'Comissões no Período', value: `€${data.metrics.comissoes_periodo.toFixed(2)}`, destaque: false },
    ] : [];

    return (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={S.modal}>
                {/* Header */}
                <div style={S.modalHeader}>
                    <h2 style={S.modalTitle}>👤 {data?.affiliate?.name ?? '...'}</h2>
                    <button style={S.modalClose} onClick={onClose}>×</button>
                </div>

                {/* Filtros */}
                <div style={S.modalFilters}>
                    <div style={{ ...S.filterGroup, minWidth: '200px' }}>
                        <label style={S.filterLabel}>Período</label>
                        <select style={S.filterInput} value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            <option value="hoje">Hoje</option>
                            <option value="ontem">Ontem</option>
                            <option value="semana">Esta semana</option>
                            <option value="semana_passada">Semana passada</option>
                            <option value="mes">Este mês</option>
                            <option value="mes_passado">Mês passado</option>
                            <option value="ultimos_30">Últimos 30 dias</option>
                            <option value="ultimos_90">Últimos 90 dias</option>
                            <option value="ano">Este ano</option>
                            <option value="total">Todo o período</option>
                            <option value="personalizado">Personalizado…</option>
                        </select>
                    </div>
                    {periodo === 'personalizado' && (
                        <>
                            <div style={S.filterGroup}>
                                <label style={S.filterLabel}>De</label>
                                <input type="date" style={S.filterInput} value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                            </div>
                            <div style={S.filterGroup}>
                                <label style={S.filterLabel}>Até</label>
                                <input type="date" style={S.filterInput} value={dataFim} onChange={e => setDataFim(e.target.value)} />
                            </div>
                        </>
                    )}
                    <button style={S.filterBtn} onClick={handleFilter} disabled={loading}>
                        {loading ? 'A carregar...' : '🔍 Filtrar'}
                    </button>
                </div>

                {/* Body */}
                <div style={S.modalBody}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                            A carregar...
                        </div>
                    ) : data ? (
                        <>
                            <p style={S.modalSubtitle}>{data.affiliate.email}</p>
                            <p style={S.modalPeriodo}>📅 Período filtrado: <strong>{data.periodo.inicio}</strong> até <strong>{data.periodo.fim}</strong></p>

                            {/* Cards métricas */}
                            <div style={S.modalMetricsGrid}>
                                {metricCards.map((card, i) => (
                                    <div key={i} style={S.modalMetricBox(card.destaque)}>
                                        <span style={S.modalMetricLabel(card.destaque)}>{card.icon} {card.label}</span>
                                        <span style={S.modalMetricValue}>{card.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Gráficos */}
                            {data.charts.comissoes.labels.length > 0 && (
                                <div style={S.modalChartsGrid}>
                                    <div style={S.chartBox}>
                                        <h3 style={S.chartTitle}>📈 Comissões no Período</h3>
                                        <LineChart labels={data.charts.comissoes.labels} data={data.charts.comissoes.data} color={PRIMARY} height={220} />
                                    </div>
                                    <div style={S.chartBox}>
                                        <h3 style={S.chartTitle}>📊 Vendas no Período</h3>
                                        <BarChart labels={data.charts.vendas.labels} data={data.charts.vendas.data} color={PRIMARY_D} height={220} />
                                    </div>
                                </div>
                            )}

                            {/* Histórico */}
                            <div>
                                <div style={S.tableHeader}>
                                    <h3 style={S.tableTitle}>🧾 Histórico de Vendas</h3>
                                    <span style={S.tablePeriod}>{data.periodo.inicio} – {data.periodo.fim} | <strong>{data.historico.length}</strong> venda(s)</span>
                                </div>

                                {data.historico.length === 0 ? (
                                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Nenhuma venda encontrada no período.</p>
                                ) : (
                                    <div style={S.tableWrap}>
                                        <table style={S.table}>
                                            <thead>
                                                <tr>
                                                    <th style={S.th}>Data</th>
                                                    <th style={S.th}>Produto</th>
                                                    <th style={S.th}>Preço</th>
                                                    <th style={S.th}>Comissão</th>
                                                    <th style={S.th}>Pedido</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.historico.map((row, i) => (
                                                    <tr key={i}>
                                                        <td style={S.td}>{row.data}</td>
                                                        <td style={S.td}>{row.produto}</td>
                                                        <td style={S.td}>€{Number(row.preco).toFixed(2)}</td>
                                                        <td style={S.tdDestaque}>€{Number(row.comissao).toFixed(2)}</td>
                                                        <td style={S.td}>#{row.order_id}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td style={S.tfootTd} colSpan={3}><strong>Total do período</strong></td>
                                                    <td style={{ ...S.tfootTd, color: PRIMARY_D }}><strong>€{data.metrics.comissoes_periodo.toFixed(2)}</strong></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard({ company, metrics, affiliates, charts }) {
    const [periodo, setPeriodo]       = useState('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim]       = useState('');
    const [loading, setLoading]       = useState(false);
    const [data, setData]             = useState({ metrics, affiliates, charts });
    const [modalId, setModalId]       = useState(null);

    function applyFilter() {
        if (periodo === 'personalizado' && (!dataInicio || !dataFim)) return;
        setLoading(true);
        fetch(route('admin.dashboard.filter'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json' },
            body: JSON.stringify({ periodo, data_inicio: dataInicio, data_fim: dataFim }),
        }).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }

    useEffect(() => { if (periodo !== 'personalizado') applyFilter(); }, [periodo]);

    const m = data.metrics;
    const c = data.charts;

    const metricCards = [
        { icon: '💰', label: 'Comissões Hoje',   value: `€${m.comissoes_hoje.toFixed(2)}`,   color: PRIMARY },
        { icon: '📊', label: 'Comissões Mês',    value: `€${m.comissoes_mes.toFixed(2)}`,    color: '#28a745' },
        { icon: '🎯', label: 'Vendas Hoje',      value: m.vendas_hoje,                       color: '#ff9800' },
        { icon: '📈', label: 'Vendas Mês',       value: m.vendas_mes,                        color: '#e91e63' },
        { icon: '🛒', label: 'Total Vendas Mês', value: `€${m.total_vendas_mes.toFixed(2)}`, color: '#00bcd4' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div style={S.wrap}>

                {/* Header */}
                <div style={S.header}>
                    <h1 style={S.headerH1}>📊 Dashboard de Afiliados</h1>
                    <p style={S.headerP}>{company.name} — Painel de Gestão</p>
                </div>

                {/* Métricas */}
                <div style={S.metricsGrid}>
                    {metricCards.map((card, i) => (
                        <div key={i} style={S.metricCard(card.color)}>
                            <span style={S.metricIcon}>{card.icon}</span>
                            <div>
                                <div style={S.metricLabel}>{card.label}</div>
                                <div style={S.metricValue}>{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div style={S.filters}>
                    <div style={S.filterGroup}>
                        <label style={S.filterLabel}>Período</label>
                        <select style={S.filterInput} value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            <option value="hoje">Hoje</option>
                            <option value="ontem">Ontem</option>
                            <option value="semana">Esta semana</option>
                            <option value="semana_passada">Semana passada</option>
                            <option value="mes">Este mês</option>
                            <option value="mes_passado">Mês passado</option>
                            <option value="ultimos_30">Últimos 30 dias</option>
                            <option value="ultimos_90">Últimos 90 dias</option>
                            <option value="ano">Este ano</option>
                            <option value="total">Todo o período</option>
                            <option value="personalizado">Personalizado…</option>
                        </select>
                    </div>
                    {periodo === 'personalizado' && (
                        <>
                            <div style={S.filterGroup}>
                                <label style={S.filterLabel}>De</label>
                                <input type="date" style={S.filterInput} value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                            </div>
                            <div style={S.filterGroup}>
                                <label style={S.filterLabel}>Até</label>
                                <input type="date" style={S.filterInput} value={dataFim} onChange={e => setDataFim(e.target.value)} />
                            </div>
                            <button style={S.filterBtn} onClick={applyFilter} disabled={loading}>
                                {loading ? 'A carregar...' : '🔍 Filtrar'}
                            </button>
                        </>
                    )}
                    {loading && periodo !== 'personalizado' && <span style={{ alignSelf: 'center', color: '#999' }}>A carregar...</span>}
                </div>

                {/* Gráficos gerais */}
                <div style={S.chartsGrid}>
                    <div style={S.chartBox}>
                        <h3 style={S.chartTitle}>💵 Comissões por Afiliado</h3>
                        <BarChart labels={c.comissoes.labels} data={c.comissoes.data} color={PRIMARY} />
                    </div>
                    <div style={S.chartBox}>
                        <h3 style={S.chartTitle}>📊 Vendas por Afiliado</h3>
                        <BarChart labels={c.vendas.labels} data={c.vendas.data} color={PRIMARY_D} />
                    </div>
                </div>

                {/* Evolução diária */}
                {c.evolucao?.labels?.length > 0 && (
                    <div style={{ ...S.chartBox, marginBottom: '30px' }}>
                        <h3 style={S.chartTitle}>📈 Evolução de Comissões no Período</h3>
                        <LineChart labels={c.evolucao.labels} data={c.evolucao.comissoes} color={PRIMARY} />
                    </div>
                )}

                {/* Cards afiliados */}
                <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600 }}>👥 Afiliados no Período</h2>
                {data.affiliates.length === 0 ? (
                    <div style={{ ...S.chartBox, textAlign: 'center', color: '#999', padding: '40px', marginBottom: '30px' }}>
                        Nenhuma venda registada no período seleccionado.
                    </div>
                ) : (
                    <div style={S.affiliatesGrid}>
                        {data.affiliates.map(affiliate => (
                            <div key={affiliate.id} style={S.affiliateCard}>
                                <div style={S.cardHeader}>
                                    <div>
                                        <h3 style={S.cardName}>{affiliate.name}</h3>
                                        <p style={S.cardEmail}>{affiliate.email}</p>
                                    </div>
                                    <span style={affiliate.vendas > 0 ? S.badgeAtivo : S.badgeInativo}>
                                        {affiliate.vendas > 0 ? '✔ Com vendas' : '✖ Sem vendas'}
                                    </span>
                                </div>
                                <div style={S.cardMetrics}>
                                    <div style={S.metricItem}>
                                        <span style={S.metricItemLabel}>Vendas</span>
                                        <span style={S.metricItemValue}>{affiliate.vendas}</span>
                                    </div>
                                    <div style={{ ...S.metricItem, borderLeft: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>
                                        <span style={S.metricItemLabel}>Comissões</span>
                                        <span style={S.metricItemValue}>€{affiliate.comissoes.toFixed(2)}</span>
                                    </div>
                                    <div style={S.metricItem}>
                                        <span style={S.metricItemLabel}>Total Vendas</span>
                                        <span style={S.metricItemValue}>€{affiliate.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div style={S.cardFooter}>
                                    <button style={S.btnDetalhes} onClick={() => setModalId(affiliate.id)}>
                                        👁️ Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Navegação */}
                <div style={S.nav}>
                    <Link href={route('admin.affiliates.index')}><button style={S.navBtn}>👥 Afiliados</button></Link>
                    <Link href={route('admin.coupons.index')}><button style={S.navBtn}>🎟️ Marketing</button></Link>
                    <Link href={route('admin.products.index')}><button style={S.navBtn}>📦 Produtos</button></Link>
                    <Link href={route('admin.settings')}><button style={S.navBtn}>⚙️ Configurações</button></Link>
                </div>
            </div>

            {/* Modal */}
            {modalId && <AffiliateModal affiliateId={modalId} onClose={() => setModalId(null)} />}
        </>
    );
}