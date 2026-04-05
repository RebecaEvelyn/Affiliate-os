import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        affiliate_code: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.affiliates.store'));
    }

    return (
        <>
            <Head title="Novo Afiliado" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('admin.affiliates.index')}>← Voltar</Link>
                    <h1>Novo Afiliado</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Dados do Afiliado</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Nome</label><br />
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} style={{ width: '100%' }} />
                            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Email</label><br />
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} style={{ width: '100%' }} />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Senha</label><br />
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} style={{ width: '100%' }} />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Confirmar Senha</label><br />
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} style={{ width: '100%' }} />
                        </div>

                        <div>
                            <label>Código de Afiliado</label><br />
                            <input
                                type="text"
                                value={data.affiliate_code}
                                onChange={e => setData('affiliate_code', e.target.value.toUpperCase())}
                                placeholder="ex: JOAO123"
                                style={{ width: '100%', textTransform: 'uppercase' }}
                            />
                            <small style={{ color: '#888' }}>
                                Código único para o link de afiliado. Apenas letras, números e hífens. Deixe em branco se não quiser link de afiliado.
                            </small>
                            {errors.affiliate_code && <p style={{ color: 'red' }}>{errors.affiliate_code}</p>}
                            {data.affiliate_code && (
                                <p style={{ color: '#667eea', fontSize: '13px', marginTop: '6px' }}>
                                    🔗 Link: www.loja.com/ref/{data.affiliate_code}
                                </p>
                            )}
                        </div>
                    </fieldset>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Criando...' : 'Criar Afiliado'}
                    </button>
                </form>
            </div>
        </>
    );
}