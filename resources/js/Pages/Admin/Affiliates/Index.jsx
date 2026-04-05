import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ affiliates }) {
    const { flash } = usePage().props;

    function handleDelete(affiliate) {
        if (confirm(`Deletar o afiliado "${affiliate.name}"? Esta ação não pode ser desfeita.`)) {
            router.delete(route('admin.affiliates.destroy', affiliate.id));
        }
    }

    function handleToggleActive(affiliate) {
        const acao = affiliate.active ? 'desativar' : 'ativar';
        if (confirm(`Deseja ${acao} o afiliado "${affiliate.name}"?`)) {
            router.patch(route('admin.affiliates.toggleActive', affiliate.id), {}, {
                onSuccess: () => router.reload(),
            });
        }
    }

    return (
        <>
            <Head title="Afiliados" />

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <Link href={route('admin.dashboard')}>← Dashboard</Link>
                        <h1>Afiliados</h1>
                    </div>
                    <Link href={route('admin.affiliates.create')}>
                        <button>+ Novo Afiliado</button>
                    </Link>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {affiliates.length === 0 ? (
                    <p>Nenhum afiliado cadastrado ainda.</p>
                ) : (
                    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Código</th>
                                <th>Link de Afiliado</th>
                                <th>Status</th>
                                <th>Criado em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliates.map((affiliate) => (
                                <tr key={affiliate.id} style={{ opacity: affiliate.active ? 1 : 0.5 }}>
                                    <td>{affiliate.id}</td>
                                    <td>{affiliate.name}</td>
                                    <td>{affiliate.email}</td>
                                    <td>
                                        {affiliate.affiliate_code ? (
                                            <code style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                                                {affiliate.affiliate_code}
                                            </code>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        {affiliate.affiliate_code ? (
                                            <span style={{ fontSize: '12px', color: '#667eea' }}>
                                                www.loja.com/ref/{affiliate.affiliate_code}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td>{affiliate.active ? '✅ Ativo' : '🔴 Inativo'}</td>
                                    <td>{new Date(affiliate.created_at).toLocaleDateString('pt-BR')}</td>
                                    <td style={{ display: 'flex', gap: '6px' }}>
                                        <Link href={route('admin.affiliates.edit', affiliate.id)}>
                                            <button>Editar</button>
                                        </Link>
                                        <button onClick={() => handleToggleActive(affiliate)}>
                                            {affiliate.active ? 'Desativar' : 'Ativar'}
                                        </button>
                                        <button onClick={() => handleDelete(affiliate)} style={{ color: 'red' }}>
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