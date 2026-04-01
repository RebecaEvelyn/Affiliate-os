import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Settings({ company }) {
    const { flash } = usePage().props;
    const [copied, setCopied] = useState(false);

    function handleCopyApiKey() {
        navigator.clipboard.writeText(company.api_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <Head title="Configurações" />

            <div style={{ padding: '2rem', maxWidth: '700px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('admin.dashboard')}>← Dashboard</Link>
                    <h1>Configurações</h1>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {/* Dados da Empresa */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>Dados da Empresa</strong></legend>
                    <p><strong>Nome:</strong> {company.name}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                </fieldset>

                {/* API Key */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>API Key</strong></legend>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        Use esta key para integrar a sua loja com o sistema de afiliados.
                        Guarde-a num local seguro — não a partilhe publicamente.
                    </p>

                    {company.api_key ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <code style={{
                                background: '#f3f4f6',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                flex: 1,
                                wordBreak: 'break-all'
                            }}>
                                {company.api_key}
                            </code>
                            <button onClick={handleCopyApiKey}>
                                {copied ? '✅ Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: 'red' }}>Sem API Key gerada. Contacte o suporte.</p>
                    )}

                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>Como integrar:</p>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Envie um POST para o endpoint de vendas com a sua API Key no header:</p>
                        <code style={{ display: 'block', background: '#eee', padding: '8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                            POST https://seu-saas.com/api/v1/sales<br />
                            X-API-Key: {company.api_key}
                        </code>
                    </div>
                </fieldset>
            </div>
        </>
    );
}