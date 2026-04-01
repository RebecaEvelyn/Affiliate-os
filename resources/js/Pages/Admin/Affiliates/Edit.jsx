import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ affiliate }) {
    const { data, setData, put, processing, errors } = useForm({
        name: affiliate.name ?? '',
        email: affiliate.email ?? '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.affiliates.update', affiliate.id));
    }

    return (
        <>
            <Head title="Editar Afiliado" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('admin.affiliates.index')}>← Voltar</Link>
                    <h1>Editar Afiliado</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Dados do Afiliado</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Nome</label><br />
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Email</label><br />
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                        </div>

                        <div>
                            <label>Confirmar Nova Senha</label><br />
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </fieldset>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>
        </>
    );
}