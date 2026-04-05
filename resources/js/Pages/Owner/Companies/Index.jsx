import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const PRIMARY = '#667eea';
const PRIMARY_D = '#764ba2';

const S = {
    card:    { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    th:      { padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', borderBottom: `2px solid ${PRIMARY}`, background: '#f9fafb' },
    td:      { padding: '14px 16px', fontSize: '14px', color: '#1f2937', borderBottom: '1px solid #f3f4f6' },
    tdMuted: { padding: '14px 16px', fontSize: '13px', color: '#9ca3af', borderBottom: '1px solid #f3f4f6' },
    badgeOk: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    badgeErr:{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
    btnPrimary: { background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_D} 100%)`, color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', textDecoration: 'none', display: 'inline-block' },
    btnSmall: (color) => ({ background: color === 'red' ? '#fee2e2' : '#f3f4f6', color: color === 'red' ? '#991b1b' : '#374151', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: '12px', textDecoration: 'none', display: 'inline-block' }),
};

export default function Index({ companies }) {
    const { auth, flash } = usePage().props;

    const navItems = [
        { href: route('owner.dashboard'),       icon: '📊', label: 'Dashboard', active: false },
        { href: route('owner.companies.index'), icon: '🏢', label: 'Empresas',  active: true },
    ];

    function handleDelete(company) {
        if (confirm(`Deletar a empresa "${company.name}"? Esta ação não pode ser desfeita.`)) {
            router.delete(route('owner.companies.destroy', company.id));
        }
    }

    function handleToggleActive(company) {
        const acao = company.active ? 'desativar' : 'ativar';
        if (confirm(`Deseja ${acao} a empresa "${company.name}"?`)) {
            router.patch(route('owner.companies.toggleActive', company.id));
        }
    }

    return (
        <AppLayout user={auth?.user} navItems={navItems} subtitle="Painel do Owner" title="Empresas">
            <Head title="Empresas" />

            {flash?.success && (
                <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#065f46', fontWeight: 500 }}>
                    ✅ {flash.success}
                </div>
            )}

            <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>🏢 Lista de Empresas</h3>
                    <Link href={route('owner.companies.create')} style={S.btnPrimary}>+ Nova Empresa</Link>
                </div>

                {companies.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Nenhuma empresa cadastrada ainda.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['#', 'Empresa', 'Email', 'Admin', 'Status', 'Criada em', 'Ações'].map(h => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => {
                                    const admin = company.users?.find(u => u.role === 'admin');
                                    return (
                                        <tr key={company.id} style={{ opacity: company.active ? 1 : 0.6 }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={S.td}>{company.id}</td>
                                            <td style={S.td}><span style={{ fontWeight: 600 }}>{company.name}</span></td>
                                            <td style={S.tdMuted}>{company.email}</td>
                                            <td style={S.td}>{admin?.name ?? '—'}</td>
                                            <td style={S.td}>
                                                <span style={company.active ? S.badgeOk : S.badgeErr}>
                                                    {company.active ? '✅ Ativa' : '🔴 Inativa'}
                                                </span>
                                            </td>
                                            <td style={S.tdMuted}>{new Date(company.created_at).toLocaleDateString('pt-BR')}</td>
                                            <td style={{ ...S.td, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <Link href={route('owner.companies.show', company.id)} style={S.btnSmall()}>Ver</Link>
                                                <Link href={route('owner.companies.edit', company.id)} style={S.btnSmall()}>Editar</Link>
                                                <button onClick={() => handleToggleActive(company)} style={S.btnSmall()}>
                                                    {company.active ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button onClick={() => handleDelete(company)} style={S.btnSmall('red')}>Deletar</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}