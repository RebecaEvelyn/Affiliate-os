import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        external_id: product.external_id ?? '',
        name: product.name ?? '',
        commission_rate: product.commission_rate ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('admin.products.update', product.id));
    }

    return (
        <>
            <Head title="Editar Produto" />

            <div style={{ padding: '2rem', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('admin.products.index')}>← Voltar</Link>
                    <h1>Editar Produto</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1.5rem' }}>
                        <legend><strong>Dados do Produto</strong></legend>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>ID Externo</label><br />
                            <input
                                type="text"
                                value={data.external_id}
                                onChange={e => setData('external_id', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            <small style={{ color: '#888' }}>
                                ID do produto na sua loja (WooCommerce, Shopify, etc.)
                            </small>
                            {errors.external_id && <p style={{ color: 'red' }}>{errors.external_id}</p>}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label>Nome do Produto</label><br />
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                        </div>

                        <div>
                            <label>Comissão (%)</label><br />
                            <input
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.01"
                                value={data.commission_rate}
                                onChange={e => setData('commission_rate', e.target.value)}
                                style={{ width: '100%' }}
                            />
                            <small style={{ color: '#888' }}>
                                Percentagem de comissão que o afiliado recebe por cada venda.
                            </small>
                            {errors.commission_rate && <p style={{ color: 'red' }}>{errors.commission_rate}</p>}
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