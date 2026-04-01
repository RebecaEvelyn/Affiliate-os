import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ company, totalAffiliates, activeAffiliates }) {
    return (
        <>
            <Head title="Dashboard" />

            <div style={{ padding: '2rem' }}>
                <h1>Bem-vindo, {company.name}</h1>
                <p style={{ color: company.active ? 'green' : 'red' }}>
                    {company.active ? '✅ Empresa Ativa' : '🔴 Empresa Inativa'}
                </p>

                <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid #ccc', minWidth: '180px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Total de Afiliados</p>
                        <h2 style={{ margin: '0.5rem 0 0' }}>{totalAffiliates}</h2>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid #ccc', minWidth: '180px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Afiliados Ativos</p>
                        <h2 style={{ margin: '0.5rem 0 0' }}>{activeAffiliates}</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={route('admin.affiliates.index')}>
                        <button>Gerenciar Afiliados</button>
                    </Link>
                    <Link href={route('admin.coupons.index')}>
                        <button>Marketing</button>
                    </Link>
                </div>
            </div>
        </>
    );
}