import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ affiliates }) {
    const { data, setData, post, processing, errors } = useForm({
        affiliate_id: '',
        code: '',
        discount_percentage: '',
        free_shipping: false,
        expires_at: '',
        usage_limit: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.coupons.store'));
    }

    return (
        <>
            <Head title="Novo Cupão" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('admin.coupons.index')}>← Voltar</Link>
                    <h1>Novo Cupão</h1>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Dados base */}
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Dados do Cupão</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Afiliado</label><br />
                            <select
                                value={data.affiliate_id}
                                onChange={e => setData('affiliate_id', e.target.value)}
                                style={{ width: '100%', padding: '4px' }}
                            >
                                <option value="">Selecione um afiliado...</option>
                                {affiliates.map(affiliate => (
                                    <option key={affiliate.id} value={affiliate.id}>
                                        {affiliate.name} ({affiliate.email})
                                    </option>
                                ))}
                            </select>
                            {errors.affiliate_id && <p style={{ color: 'red' }}>{errors.affiliate_id}</p>}
                        </div>

                        <div>
                            <label>Código do Cupão</label><br />
                            <input
                                type="text"
                                value={data.code}
                                onChange={e => setData('code', e.target.value.toUpperCase())}
                                placeholder="ex: JOAO2026"
                                style={{ width: '100%', textTransform: 'uppercase' }}
                            />
                            <small style={{ color: '#888' }}>O código será guardado em maiúsculas.</small>
                            {errors.code && <p style={{ color: 'red' }}>{errors.code}</p>}
                        </div>
                    </fieldset>

                    {/* Desconto */}
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Desconto</strong></legend>
                        <small style={{ color: '#888', display: 'block', marginBottom: '1rem' }}>
                            Defina pelo menos um tipo de desconto.
                        </small>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Percentagem de Desconto (%)</label><br />
                            <input
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.01"
                                value={data.discount_percentage}
                                onChange={e => setData('discount_percentage', e.target.value)}
                                placeholder="ex: 10"
                                style={{ width: '100%' }}
                            />
                            <small style={{ color: '#888' }}>Deixe em branco se não quiser desconto em percentagem.</small>
                            {errors.discount_percentage && <p style={{ color: 'red' }}>{errors.discount_percentage}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={data.free_shipping}
                                    onChange={e => setData('free_shipping', e.target.checked)}
                                />
                                Frete Grátis
                            </label>
                        </div>
                    </fieldset>

                    {/* Limites opcionais */}
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Limites (opcional)</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Data de Expiração</label><br />
                            <input
                                type="date"
                                value={data.expires_at}
                                onChange={e => setData('expires_at', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            <small style={{ color: '#888' }}>Deixe em branco para não expirar.</small>
                            {errors.expires_at && <p style={{ color: 'red' }}>{errors.expires_at}</p>}
                        </div>

                        <div>
                            <label>Limite de Utilizações</label><br />
                            <input
                                type="number"
                                min="1"
                                value={data.usage_limit}
                                onChange={e => setData('usage_limit', e.target.value)}
                                placeholder="ex: 100"
                                style={{ width: '100%' }}
                            />
                            <small style={{ color: '#888' }}>Deixe em branco para utilizações ilimitadas.</small>
                            {errors.usage_limit && <p style={{ color: 'red' }}>{errors.usage_limit}</p>}
                        </div>
                    </fieldset>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Criando...' : 'Criar Cupão'}
                    </button>
                </form>
            </div>
        </>
    );
}