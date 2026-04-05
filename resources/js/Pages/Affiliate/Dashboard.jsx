import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// ─── Design System ────────────────────────────────────────────────────────────
const C = {
    primary:   '#667eea',
    primaryD:  '#764ba2',
    bg:        '#f0f2f5',
    sidebar:   '#1a1a2e',
    sidebarHover: '#16213e',
    white:     '#ffffff',
    gray:      '#6b7280',
    border:    '#e5e7eb',
    success:   '#10b981',
    danger:    '#ef4444',
    warning:   '#f59e0b',
    text:      '#1f2937',
    textLight: '#6b7280',
};

const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, unread, affiliate }) {
    const tabs = [
        { id: 'overview',       label: 'Visão Geral',         icon: '📊' },
        { id: 'report',         label: 'Relatório Detalhado', icon: '📋' },
        { id: 'links',          label: 'Links & Rastreamento', icon: '🔗' },
        { id: 'notifications',  label: 'Notificações',        icon: '🔔', badge: unread },
    ];

    return (
        <div style={{
            width: '260px', minHeight: '100vh', background: C.sidebar,
            display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>📊</span>
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Affiliate OS</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Painel do Afiliado</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === tab.id ? 600 : 400,
                            marginBottom: '4px', transition: 'all 0.2s', textAlign: 'left',
                            position: 'relative',
                        }}
                        onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                        <span style={{ flex: 1 }}>{tab.label}</span>
                        {tab.badge > 0 && (
                            <span style={{
                                background: C.danger, color: 'white', borderRadius: '20px',
                                padding: '2px 8px', fontSize: '11px', fontWeight: 700,
                            }}>{tab.badge}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* User + Logout */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '16px',
                    }}>
                        {affiliate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{affiliate.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{affiliate.email}</div>
                    </div>
                </div>
                <a href="/logout" onClick={e => { e.preventDefault(); document.getElementById('logout-form').submit(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none', padding: '8px 0' }}>
                    <span>🚪</span> Sair
                </a>
                <form id="logout-form" method="POST" action="/logout" style={{ display: 'none' }}>
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                </form>
            </div>
        </div>
    );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, gradient }) {
    return (
        <div style={{
            background: gradient, borderRadius: '16px', padding: '24px',
            color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '13px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
}

// ─── Chart ───────────────────────────────────────────────────────────────────
function ComparativeChart({ chartData }) {
    const ref = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        chart.current?.destroy();
        chart.current = new Chart(ref.current, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.mes),
                datasets: [
                    {
                        label: 'Comissões (€)',
                        data: chartData.map(d => d.comissoes),
                        borderColor: C.primary,
                        backgroundColor: C.primary + '26',
                        borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: C.primary,
                    },
                    {
                        label: 'Vendas',
                        data: chartData.map(d => d.vendas),
                        borderColor: '#f5576c',
                        backgroundColor: '#f5576c26',
                        borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#f5576c',
                    },
                ]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } },
        });
        return () => chart.current?.destroy();
    }, [chartData]);

    return <canvas ref={ref} style={{ maxHeight: 300 }} />;
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ metrics, chartData }) {
    const cards = [
        { icon: '💰', label: 'Comissões do Mês Actual',   value: `€${metrics.comissoes_mes_actual.toFixed(2)}`,   gradient: GRADIENTS[0] },
        { icon: '📊', label: 'Comissões do Mês Anterior', value: `€${metrics.comissoes_mes_anterior.toFixed(2)}`, gradient: GRADIENTS[1] },
        { icon: '🛒', label: 'Vendas do Mês Actual',      value: metrics.vendas_mes_actual,                       gradient: GRADIENTS[2] },
        { icon: '📅', label: 'Vendas da Semana',          value: metrics.vendas_semana,                           gradient: GRADIENTS[3] },
        { icon: '📆', label: 'Vendas Semana Anterior',    value: metrics.vendas_semana_anterior,                  gradient: GRADIENTS[4] },
        { icon: '🔥', label: 'Comissões Hoje',            value: `€${metrics.comissoes_hoje.toFixed(2)}`,         gradient: GRADIENTS[5] },
        { icon: '🎯', label: 'Vendas Hoje',               value: metrics.vendas_hoje,                             gradient: GRADIENTS[6] },
        { icon: '💵', label: 'Total Geral',               value: `€${metrics.comissoes_total.toFixed(2)}`,        gradient: GRADIENTS[7] },
    ];

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {cards.map((card, i) => <MetricCard key={i} {...card} />)}
            </div>

            <div style={{ background: C.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📈 Comparativo Mensal
                </h3>
                <ComparativeChart chartData={chartData} />
            </div>
        </div>
    );
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ affiliateId }) {
    const [loading, setLoading]   = useState(false);
    const [data, setData]         = useState(null);
    const [mesInicio, setMesInicio] = useState(new Date().getMonth() + 1);
    const [anoInicio, setAnoInicio] = useState(new Date().getFullYear());
    const [mesFim, setMesFim]     = useState(new Date().getMonth() + 1);
    const [anoFim, setAnoFim]     = useState(new Date().getFullYear());

    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const anos  = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    function load() {
        setLoading(true);
        fetch(`/affiliate/report?mes_inicio=${mesInicio}&ano_inicio=${anoInicio}&mes_fim=${mesFim}&ano_fim=${anoFim}`, {
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        }).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    const statusColor = (s) => s === 'ativa' ? C.success : s === 'paga' ? C.primary : C.danger;

    return (
        <div>
            {/* Filtros */}
            <div style={{ background: C.white, borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: C.text }}>📋 Filtros do Relatório</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {[
                        { label: 'Mês Início', value: mesInicio, set: setMesInicio, options: meses.map((m, i) => ({ label: m, value: i + 1 })) },
                        { label: 'Ano Início', value: anoInicio, set: setAnoInicio, options: anos.map(a => ({ label: a, value: a })) },
                        { label: 'Mês Fim',    value: mesFim,    set: setMesFim,    options: meses.map((m, i) => ({ label: m, value: i + 1 })) },
                        { label: 'Ano Fim',    value: anoFim,    set: setAnoFim,    options: anos.map(a => ({ label: a, value: a })) },
                    ].map((f, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: C.textLight, textTransform: 'uppercase' }}>{f.label}</label>
                            <select value={f.value} onChange={e => f.set(e.target.value)} style={{ padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    ))}
                    <button onClick={load} disabled={loading} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                        {loading ? 'A filtrar...' : '🔍 Filtrar'}
                    </button>
                </div>
            </div>

            {data && (
                <div style={{ background: C.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: C.text }}>🧾 Total do Período: <span style={{ color: C.primary }}>€{data.total.toFixed(2)}</span></h3>
                        <span style={{ fontSize: '13px', color: C.textLight }}>{data.periodo?.inicio} — {data.periodo?.fim}</span>
                    </div>

                    {data.commissions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: C.textLight, padding: '30px' }}>Nenhuma comissão encontrada para o período seleccionado.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        {['Data', 'Produto', 'Cupão', 'Venda', 'Comissão', 'Status', 'Pedido'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: C.textLight, borderBottom: `2px solid ${C.primary}` }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.commissions.map((c, i) => (
                                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.data}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.produto}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.cupao}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>€{Number(c.amount).toFixed(2)}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: C.primary, fontWeight: 600 }}>€{Number(c.comissao).toFixed(2)}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ background: statusColor(c.status) + '20', color: statusColor(c.status), padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{c.status}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: C.textLight }}>#{c.order_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Links Tab ────────────────────────────────────────────────────────────────
function LinksTab({ affiliate }) {
    const [copied, setCopied] = useState(false);
    const link = affiliate.affiliate_code ? `www.loja.com/ref/${affiliate.affiliate_code}` : null;

    function handleCopy() {
        if (!link) return;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div>
            <div style={{ background: C.white, borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: C.text }}>🔗 O Teu Link de Afiliado</h3>

                {link ? (
                    <>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <input readOnly value={link} style={{ flex: 1, padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '14px', background: '#f9fafb', color: C.text }} />
                            <button onClick={handleCopy} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {copied ? '✅ Copiado!' : '📋 Copiar Link'}
                            </button>
                        </div>
                        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px' }}>
                            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '14px', color: '#0369a1' }}>Como usar:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#0369a1', lineHeight: 1.8 }}>
                                <li>Partilha este link nas tuas redes sociais</li>
                                <li>Quando alguém clicar, será redirecionado para a loja</li>
                                <li>Se a pessoa comprar qualquer produto, ganharás a tua comissão</li>
                                <li>Funciona em conjunto com o teu cupão de desconto</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px', color: C.textLight }}>
                        <p style={{ fontSize: '16px' }}>⚠️ Ainda não tens um código de afiliado atribuído.</p>
                        <p style={{ fontSize: '14px' }}>Contacta o administrador para activar o teu link de afiliado.</p>
                    </div>
                )}
            </div>

            {/* Cupões */}
            <div style={{ background: C.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: C.text }}>🎟️ O Teu Código de Afiliado</h3>
                {affiliate.affiliate_code ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px 24px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '20px' }}>🏷️</span>
                        <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }}>{affiliate.affiliate_code}</span>
                    </div>
                ) : (
                    <p style={{ color: C.textLight }}>Sem código atribuído.</p>
                )}
            </div>
        </div>
    );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/affiliate/notifications', {
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        }).then(r => r.json()).then(d => { setNotifications(d.notifications); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const typeColor = (t) => t === 'danger' ? C.danger : t === 'warning' ? C.warning : C.primary;
    const typeIcon  = (t) => t === 'danger' ? '❌' : t === 'warning' ? '⚠️' : 'ℹ️';

    return (
        <div style={{ background: C.white, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600, color: C.text }}>🔔 As Tuas Notificações</h3>

            {loading ? (
                <p style={{ textAlign: 'center', color: C.textLight, padding: '30px' }}>A carregar...</p>
            ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: C.textLight }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                    <p style={{ fontSize: '16px', fontWeight: 600 }}>Não há notificações</p>
                    <p style={{ fontSize: '14px' }}>Estás em dia com todas as actualizações!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map((n, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px',
                            background: n.read ? '#f9fafb' : typeColor(n.type) + '10',
                            border: `1px solid ${n.read ? C.border : typeColor(n.type) + '30'}`,
                        }}>
                            <span style={{ fontSize: '24px' }}>{typeIcon(n.type)}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: C.text, marginBottom: '4px' }}>{n.title}</div>
                                <div style={{ fontSize: '13px', color: C.textLight, marginBottom: '6px' }}>{n.message}</div>
                                <div style={{ fontSize: '11px', color: C.textLight }}>{n.created_at}</div>
                            </div>
                            {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: typeColor(n.type), marginTop: '6px' }} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard({ affiliate, metrics, chartData, unreadNotifications }) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabTitles = {
        overview:      'Visão Geral',
        report:        'Relatório Detalhado',
        links:         'Links & Rastreamento',
        notifications: 'Notificações',
    };

    return (
        <>
            <Head title="Dashboard do Afiliado" />
            <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: '"Inter", system-ui, sans-serif' }}>

                {/* Sidebar */}
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unread={unreadNotifications} affiliate={affiliate} />

                {/* Main Content */}
                <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: C.text }}>
                            {tabTitles[activeTab]}
                        </h1>
                        <p style={{ margin: '6px 0 0', color: C.textLight, fontSize: '15px' }}>
                            Olá, {affiliate.name}! 👋
                        </p>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview'      && <OverviewTab metrics={metrics} chartData={chartData} />}
                    {activeTab === 'report'        && <ReportTab affiliateId={affiliate.id} />}
                    {activeTab === 'links'         && <LinksTab affiliate={affiliate} />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                </div>
            </div>
        </>
    );
}