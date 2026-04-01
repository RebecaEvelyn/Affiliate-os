import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ companies }) {
    const { flash } = usePage().props;

    function handleDelete(company) {
        if (confirm(`Deletar a empresa "${company.name}"? Essa ação não pode ser desfeita.`)) {
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
        <>
            <Head title="Empresas" />

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1>Empresas</h1>
                    <Link href={route('owner.companies.create')}>
                        <button>+ Nova Empresa</button>
                    </Link>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {companies.length === 0 ? (
                    <p>Nenhuma empresa cadastrada ainda.</p>
                ) : (
                    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Empresa</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Status</th>
                                <th>Criada em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => {
                                const admin = company.users?.find(u => u.role === 'admin');
                                return (
                                    <tr key={company.id} style={{ opacity: company.active ? 1 : 0.5 }}>
                                        <td>{company.id}</td>
                                        <td>{company.name}</td>
                                        <td>{company.email}</td>
                                        <td>{admin?.name ?? '—'}</td>
                                        <td>{company.active ? '✅ Ativa' : '🔴 Inativa'}</td>
                                        <td>{new Date(company.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ display: 'flex', gap: '6px' }}>
                                            <Link href={route('owner.companies.show', company.id)}>
                                                <button>Ver</button>
                                            </Link>
                                            <Link href={route('owner.companies.edit', company.id)}>
                                                <button>Editar</button>
                                            </Link>
                                            <button onClick={() => handleToggleActive(company)}>
                                                {company.active ? 'Desativar' : 'Ativar'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company)}
                                                style={{ color: 'red' }}
                                            >
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}