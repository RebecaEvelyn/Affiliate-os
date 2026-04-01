import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ company, admin }) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: company.name ?? '',
        company_email: company.email ?? '',
        admin_name: admin?.name ?? '',
        admin_email: admin?.email ?? '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('owner.companies.update', company.id));
    }

    return (
        <>
            <Head title="Editar Empresa" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('owner.companies.index')}>← Voltar</Link>
                    <h1>Editar Empresa #{company.id}</h1>
                </div>

                <form onSubmit={handleSubmit}>

                    <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                        <legend><strong>Dados da Empresa</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Nome da Empresa</label><br />
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={e => setData('company_name', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.company_name && <p style={{ color: 'red' }}>{errors.company_name}</p>}
                        </div>

                        <div>
                            <label>Email da Empresa</label><br />
                            <input
                                type="email"
                                value={data.company_email}
                                onChange={e => setData('company_email', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.company_email && <p style={{ color: 'red' }}>{errors.company_email}</p>}
                        </div>
                    </fieldset>

                    <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                        <legend><strong>Usuário Admin</strong></legend>

                        {!admin && (
                            <p style={{ color: '#888' }}>Nenhum admin vinculado a esta empresa.</p>
                        )}

                        {admin && (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Nome do Admin</label><br />
                                    <input
                                        type="text"
                                        value={data.admin_name}
                                        onChange={e => setData('admin_name', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                    {errors.admin_name && <p style={{ color: 'red' }}>{errors.admin_name}</p>}
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>Email do Admin</label><br />
                                    <input
                                        type="email"
                                        value={data.admin_email}
                                        onChange={e => setData('admin_email', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                    {errors.admin_email && <p style={{ color: 'red' }}>{errors.admin_email}</p>}
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label>
                                        Nova Senha{' '}
                                        <span style={{ color: '#999', fontWeight: 'normal' }}>
                                            (deixe em branco para não alterar)
                                        </span>
                                    </label><br />
                                    <input
                                        type="password"
                                        value={data.admin_password}
                                        onChange={e => setData('admin_password', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                    {errors.admin_password && <p style={{ color: 'red' }}>{errors.admin_password}</p>}
                                </div>

                                <div>
                                    <label>Confirmar Nova Senha</label><br />
                                    <input
                                        type="password"
                                        value={data.admin_password_confirmation}
                                        onChange={e => setData('admin_password_confirmation', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </>
                        )}
                    </fieldset>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Salvar Alterações'}
                    </button>

                </form>
            </div>
        </>
    );
}