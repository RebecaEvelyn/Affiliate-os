import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
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
];

const S = {
    card:      { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' },
    cardTitle: { margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: '#1f2937' },
    metricCard:(g) => ({ background: g, borderRadius: '16px', padding: '22px', color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'transform 0.2s', cursor: 'default' }),
    th:        { padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', borderBottom: `2px solid ${PRIMARY}`, background: '#f9fafb' },
    td:        { padding: '12px 16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #f3f4f6' },
    tdPurple:  { padding: '12px 16px', fontSize: '14px', color: PRIMARY_D, fontWeight: 600, borderBottom: '1px solid #f3f4f6' },
    badgeOk:   { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeErr:  { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    btnDetalhes:{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', width: '100%' },
    filterInput:{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: 'white', flex: 1, minWidth: '160px' },
    filterBtn:  { padding: '10px 24px', background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
};

function BarChart({ labels, data, color }) {
    const ref = useRef(null); const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return; chart.current?.destroy();
        chart.current = new Chart(ref.current, { type: 'bar', data: { labels, datasets: [{ data, backgroundColor: color + 'BF', borderColor: color, borderWidth: 1, borderRadius: 4 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: 260 }} />;
}

function LineChart({ labels, data, color }) {
    const ref = useRef(null); const chart = useRef(null);
    useEffect(() => {
        if (!ref.current) return; chart.current?.destroy();
        chart.current = new Chart(ref.current, { type: 'line', data: { labels, datasets: [{ data, borderColor: color, backgroundColor: color + '26', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
        return () => chart.current?.destroy();
    }, [labels, data]);
    return <canvas ref={ref} style={{ maxHeight: 260 }} />;
}

// Modal detalhes afiliado
function AffiliateModal({ affiliateId, onClose }) {
    const [periodo, setPeriodo] = useState('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim]       = useState('');
    const [loading, setLoading]       = useState(true);
    const [data, setData]             = useState(null);

    function load(p = periodo, di = dataInicio, df = dataFim) {
        setLoading(true);
        fetch(route('admin.dashboard.affiliate', affiliateId) + `?periodo=${p}&data_inicio=${di}&data_fim=${df}`, {
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        }).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);
    useEffect(() => { if (periodo !== 'personalizado') load(periodo); }, [periodo]);

    const statusColor = (s) => s === 'ativa' ? '#10b981' : s === 'paga' ? PRIMARY : '#ef4444';

    const metricBoxes = data ? [
        { label: '🔥 Comissões Hoje',      value: `€${data.metrics.comissoes_hoje.toFixed(2)}`,    highlight: false },
        { label: '📊 Comissões Este Mês',  value: `€${data.metrics.comissoes_mes.toFixed(2)}`,     highlight: false },
        { label: '💵 Total Comissões',      value: `€${data.metrics.comissoes_total.toFixed(2)}`,   highlight: true  },
        { label: '🛒 Total de Vendas',      value: data.metrics.vendas_total,                       highlight: false },
        { label: '📅 Vendas no Período',    value: data.metrics.vendas_periodo,                     highlight: false },
        { label: '💰 Comissões no Período', value: `€${data.metrics.comissoes_periodo.toFixed(2)}`, highlight: false },
    ] : [];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px 0' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '900px', overflow: 'hidden', marginTop: '20px' }}>
                <div style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>👤 {data?.affiliate?.name ?? '...'}</h2>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>

                <div style={{ background: '#f9fafb', padding: '16px 30px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Período</label>
                        <select style={S.filterInput} value={periodo} onChange={e => setPeriodo(e.target.value)}>
                            {['hoje','ontem','semana','semana_passada','mes','mes_passado','ultimos_30','ultimos_90','ano','total','personalizado'].map(p => (
                                <option key={p} value={p}>{p.replace(/_/g,' ')}</option>
                            ))}
                        </select>
                    </div>
                    {periodo === 'personalizado' && (<>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>De</label>
                            <input type="date" style={S.filterInput} value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Até</label>
                            <input type="date" style={S.filterInput} value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                    </>)}
                    <button style={S.filterBtn} onClick={() => load(periodo, dataInicio, dataFim)} disabled={loading}>
                        {loading ? 'A carregar...' : '🔍 Filtrar'}
                    </button>
                </div>

                <div style={{ padding: '24px 30px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>⏳ A carregar...</div>
                    ) : data ? (<>
                        <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '14px' }}>{data.affiliate.email}</p>
                        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#9ca3af' }}>📅 {data.periodo.inicio} até {data.periodo.fim}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                            {metricBoxes.map((box, i) => (
                                <div key={i} style={{ background: box.highlight ? `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)` : '#f8f9fa', color: box.highlight ? 'white' : '#1f2937', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, opacity: 0.7, marginBottom: '6px' }}>{box.label}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{box.value}</div>
                                </div>
                            ))}
                        </div>

                        {data.charts.comissoes.labels.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>📈 Comissões no Período</h4>
                                    <LineChart labels={data.charts.comissoes.labels} data={data.charts.comissoes.data} color={PRIMARY} />
                                </div>
                                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>📊 Vendas no Período</h4>
                                    <BarChart labels={data.charts.vendas.labels} data={data.charts.vendas.data} color={PRIMARY_D} />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>🧾 Histórico de Vendas</h4>
                            <span style={{ fontSize: '13px', color: '#9ca3af', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' }}>{data.periodo.inicio} – {data.periodo.fim} | {data.historico.length} venda(s)</span>
                        </div>

                        {data.historico.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Nenhuma venda no período.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr>{['Data','Produto','Preço','Comissão','Pedido'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                                    <tbody>
                                        {data.historico.map((row, i) => (
                                            <tr key={i} onMouseEnter={e => e.currentTarget.style.background='#f9fafb'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                                                <td style={S.td}>{row.data}</td>
                                                <td style={S.td}>{row.produto}</td>
                                                <td style={S.td}>€{Number(row.preco).toFixed(2)}</td>
                                                <td style={S.tdPurple}>€{Number(row.comissao).toFixed(2)}</td>
                                                <td style={{ ...S.td, color: '#9ca3af' }}>#{row.order_id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot><tr>
                                        <td colSpan={3} style={{ padding: '12px 16px', fontWeight: 700, fontSize: '14px' }}>Total do período</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '14px', color: PRIMARY_D }}>€{data.metrics.comissoes_periodo.toFixed(2)}</td>
                                        <td></td>
                                    </tr></tfoot>
                                </table>
                            </div>
                        )}
                    </>) : null}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ company, metrics, affiliates, charts }) {
    const { auth } = usePage().props;
    const [periodo, setPeriodo]       = useState('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim]       = useState('');
    const [loading, setLoading]       = useState(false);
    const [data, setData]             = useState({ metrics, affiliates, charts });
    const [modalId, setModalId]       = useState(null);

    const navItems = [
        { href: route('admin.dashboard'),        icon: '📊', label: 'Dashboard',    active: true },
        { href: route('admin.affiliates.index'), icon: '👥', label: 'Afiliados',    active: false },
        { href: route('admin.coupons.index'),    icon: '🎟️', label: 'Marketing',    active: false },
        { href: route('admin.products.index'),   icon: '📦', label: 'Produtos',     active: false },
        { href: route('admin.settings'),         icon: '⚙️', label: 'Configurações',active: false },
    ];

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
        { icon: '💰', label: 'Comissões Hoje',   value: `€${m.comissoes_hoje.toFixed(2)}`,   gradient: GRADIENTS[0] },
        { icon: '📊', label: 'Comissões Mês',    value: `€${m.comissoes_mes.toFixed(2)}`,    gradient: GRADIENTS[1] },
        { icon: '🎯', label: 'Vendas Hoje',      value: m.vendas_hoje,                       gradient: GRADIENTS[2] },
        { icon: '📈', label: 'Vendas Mês',       value: m.vendas_mes,                        gradient: GRADIENTS[3] },
        { icon: '🛒', label: 'Total Vendas Mês', value: `€${m.total_vendas_mes.toFixed(2)}`, gradient: GRADIENTS[4] },
    ];

    return (
        <AppLayout user={auth?.user} navItems={navItems} subtitle={company.name} title="Dashboard">
            <Head title="Dashboard" />

            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {metricCards.map((card, i) => (
                    <div key={i} style={S.metricCard(card.gradient)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{card.icon}</div>
                        <div style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>{card.value}</div>
                        <div style={{ fontSize: '11px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div style={{ ...S.card, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Período</label>
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
                {periodo === 'personalizado' && (<>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>De</label>
                        <input type="date" style={S.filterInput} value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Até</label>
                        <input type="date" style={S.filterInput} value={dataFim} onChange={e => setDataFim(e.target.value)} />
                    </div>
                    <button style={S.filterBtn} onClick={applyFilter} disabled={loading}>{loading ? 'A carregar...' : '🔍 Filtrar'}</button>
                </>)}
                {loading && periodo !== 'personalizado' && <span style={{ alignSelf: 'center', color: '#9ca3af', fontSize: '14px' }}>A carregar...</span>}
            </div>

            {/* Gráficos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={S.card}>
                    <h3 style={S.cardTitle}>💵 Comissões por Afiliado</h3>
                    <BarChart labels={c.comissoes.labels} data={c.comissoes.data} color={PRIMARY} />
                </div>
                <div style={S.card}>
                    <h3 style={S.cardTitle}>📊 Vendas por Afiliado</h3>
                    <BarChart labels={c.vendas.labels} data={c.vendas.data} color={PRIMARY_D} />
                </div>
            </div>

            {c.evolucao?.labels?.length > 0 && (
                <div style={S.card}>
                    <h3 style={S.cardTitle}>📈 Evolução de Comissões no Período</h3>
                    <LineChart labels={c.evolucao.labels} data={c.evolucao.comissoes} color={PRIMARY} />
                </div>
            )}

            {/* Cards afiliados */}
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>👥 Afiliados no Período</h2>
            {data.affiliates.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
                    Nenhuma venda registada no período seleccionado.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {data.affiliates.map(affiliate => (
                        <div key={affiliate.id} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f3f4f6', transition: 'box-shadow 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                        >
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f3f4f6' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>{affiliate.name}</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>{affiliate.email}</p>
                                </div>
                                <span style={affiliate.vendas > 0 ? S.badgeOk : S.badgeErr}>
                                    {affiliate.vendas > 0 ? '✔ Com vendas' : '✖ Sem vendas'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                                {[
                                    { label: 'Vendas', value: affiliate.vendas },
                                    { label: 'Comissões', value: `€${affiliate.comissoes.toFixed(2)}` },
                                    { label: 'Volume', value: `€${affiliate.amount.toFixed(2)}` },
                                ].map((item, i) => (
                                    <div key={i} style={{ flex: 1, textAlign: 'center', ...(i > 0 ? { borderLeft: '1px solid #f3f4f6' } : {}) }}>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '16px 20px' }}>
                                <button style={S.btnDetalhes} onClick={() => setModalId(affiliate.id)}>👁️ Ver Detalhes</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalId && <AffiliateModal affiliateId={modalId} onClose={() => setModalId(null)} />}
        </AppLayout>
    );
}