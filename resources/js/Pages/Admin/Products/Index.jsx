import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ products }) {
    const { flash } = usePage().props;

    function handleDelete(product) {
        if (confirm(`Deletar o produto "${product.name}"? Esta ação não pode ser desfeita.`)) {
            router.delete(route('admin.products.destroy', product.id));
        }
    }

    function handleToggleActive(product) {
        const acao = product.active ? 'desativar' : 'ativar';
        if (confirm(`Deseja ${acao} o produto "${product.name}"?`)) {
            router.patch(route('admin.products.toggleActive', product.id), {}, {
                onSuccess: () => router.reload(),
            });
        }
    }

    return (
        <>
            <Head title="Produtos" />

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <Link href={route('admin.dashboard')}>← Dashboard</Link>
                        <h1>Produtos</h1>
                    </div>
                    <Link href={route('admin.products.create')}>
                        <button>+ Novo Produto</button>
                    </Link>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {products.length === 0 ? (
                    <p>Nenhum produto registado ainda.</p>
                ) : (
                    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID Externo</th>
                                <th>Nome</th>
                                <th>Comissão</th>
                                <th>Status</th>
                                <th>Criado em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} style={{ opacity: product.active ? 1 : 0.5 }}>
                                    <td>{product.id}</td>
                                    <td><code>{product.external_id}</code></td>
                                    <td>{product.name}</td>
                                    <td>{product.commission_rate}%</td>
                                    <td>{product.active ? '✅ Ativo' : '🔴 Inativo'}</td>
                                    <td>{new Date(product.created_at).toLocaleDateString('pt-BR')}</td>
                                    <td style={{ display: 'flex', gap: '6px' }}>
                                        <Link href={route('admin.products.edit', product.id)}>
                                            <button>Editar</button>
                                        </Link>
                                        <button onClick={() => handleToggleActive(product)}>
                                            {product.active ? 'Desativar' : 'Ativar'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
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