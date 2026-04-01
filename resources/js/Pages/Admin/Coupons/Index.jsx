import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ coupons }) {
    const { flash } = usePage().props;

    function handleDelete(coupon) {
        if (confirm(`Deletar o cupão "${coupon.code}"? Esta ação não pode ser desfeita.`)) {
            router.delete(route('admin.coupons.destroy', coupon.id));
        }
    }

    function handleToggleActive(coupon) {
        const acao = coupon.active ? 'desativar' : 'ativar';
        if (confirm(`Deseja ${acao} o cupão "${coupon.code}"?`)) {
            router.patch(route('admin.coupons.toggleActive', coupon.id), {}, {
                onSuccess: () => router.reload(),
            });
        }
    }

    function formatDiscount(coupon) {
        const parts = [];
        if (coupon.discount_percentage) parts.push(`${coupon.discount_percentage}%`);
        if (coupon.free_shipping) parts.push('Frete grátis');
        return parts.length > 0 ? parts.join(' + ') : '—';
    }

    function formatExpiry(coupon) {
        if (!coupon.expires_at) return 'Sem expiração';
        return new Date(coupon.expires_at).toLocaleDateString('pt-BR');
    }

    function formatUsage(coupon) {
        if (!coupon.usage_limit) return `${coupon.usage_count} usos / Ilimitado`;
        return `${coupon.usage_count} / ${coupon.usage_limit} usos`;
    }

    return (
        <>
            <Head title="Cupões" />

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <Link href={route('admin.dashboard')}>← Dashboard</Link>
                        <h1>Cupões</h1>
                    </div>
                    <Link href={route('admin.coupons.create')}>
                        <button>+ Novo Cupão</button>
                    </Link>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {coupons.length === 0 ? (
                    <p>Nenhum cupão criado ainda.</p>
                ) : (
                    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Código</th>
                                <th>Afiliado</th>
                                <th>Desconto</th>
                                <th>Utilizações</th>
                                <th>Expira em</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} style={{ opacity: coupon.active ? 1 : 0.5 }}>
                                    <td>{coupon.id}</td>
                                    <td><strong>{coupon.code}</strong></td>
                                    <td>{coupon.affiliate?.name ?? '—'}</td>
                                    <td>{formatDiscount(coupon)}</td>
                                    <td>{formatUsage(coupon)}</td>
                                    <td>{formatExpiry(coupon)}</td>
                                    <td>{coupon.active ? '✅ Ativo' : '🔴 Inativo'}</td>
                                    <td style={{ display: 'flex', gap: '6px' }}>
                                        <Link href={route('admin.coupons.edit', coupon.id)}>
                                            <button>Editar</button>
                                        </Link>
                                        <button onClick={() => handleToggleActive(coupon)}>
                                            {coupon.active ? 'Desativar' : 'Ativar'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon)}
                                            style={{ color: 'red' }}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}