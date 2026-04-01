import { Head, Link, useForm } from '@inertiajs/react';

export default function SwapAdmin({ company, admin }) {
    const { data, setData, post, processing, errors } = useForm({
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('owner.companies.swapAdmin', company.id));
    }

    return (
        <>
            <Head title="Trocar Admin" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('owner.companies.show', company.id)}>← Voltar</Link>
                    <h1>Trocar Admin — {company.name}</h1>
                </div>

                {admin && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #f0ad4e', background: '#fff8e1' }}>
                        <p><strong>Admin atual:</strong> {admin.name} ({admin.email})</p>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                            O admin atual perderá o papel de admin e ficará como afiliado da empresa.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Novo Admin</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Nome</label><br />
                            <input
                                type="text"
                                value={data.admin_name}
                                onChange={e => setData('admin_name', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.admin_name && <p style={{ color: 'red' }}>{errors.admin_name}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Email</label><br />
                            <input
                                type="email"
                                value={data.admin_email}
                                onChange={e => setData('admin_email', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.admin_email && <p style={{ color: 'red' }}>{errors.admin_email}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Senha</label><br />
                            <input
                                type="password"
                                value={data.admin_password}
                                onChange={e => setData('admin_password', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.admin_password && <p style={{ color: 'red' }}>{errors.admin_password}</p>}
                        </div>

                        <div>
                            <label>Confirmar Senha</label><br />
                            <input
                                type="password"
                                value={data.admin_password_confirmation}
                                onChange={e => setData('admin_password_confirmation', e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </fieldset>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Salvando...' : 'Confirmar Troca de Admin'}
                    </button>
                </form>
            </div>
        </>
    );
}