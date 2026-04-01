import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ company, admin, affiliates }) {
    const { flash } = usePage().props;
    const [copied, setCopied] = useState(false);

    function handleRegenerateApiKey() {
        if (confirm('Tens a certeza que queres regenerar a API Key? A key antiga deixará de funcionar imediatamente.')) {
            router.post(route('owner.companies.regenerateApiKey', company.id));
        }
    }

    function handleCopyApiKey() {
        navigator.clipboard.writeText(company.api_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <Head title={`Empresa: ${company.name}`} />

            <div style={{ padding: '2rem', maxWidth: '700px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href={route('owner.companies.index')}>← Voltar</Link>
                    <h1>{company.name}</h1>
                    <p style={{ color: company.active ? 'green' : 'red' }}>
                        {company.active ? '✅ Empresa Ativa' : '🔴 Empresa Inativa'}
                    </p>
                </div>

                {flash?.success && (
                    <p style={{ color: 'green', marginBottom: '1rem' }}>{flash.success}</p>
                )}

                {/* Dados da Empresa */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>Dados da Empresa</strong></legend>
                    <p><strong>ID:</strong> {company.id}</p>
                    <p><strong>Nome:</strong> {company.name}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Criada em:</strong> {new Date(company.created_at).toLocaleDateString('pt-BR')}</p>
                </fieldset>

                {/* API Key */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>API Key</strong></legend>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        Esta key é usada para integrar a loja do cliente com o SaaS.
                    </p>
                    {company.api_key ? (
                        <>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.5rem' }}>
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
                            <button
                                onClick={handleRegenerateApiKey}
                                style={{ color: 'orange', marginTop: '0.5rem' }}
                            >
                                🔄 Regenerar API Key
                            </button>
                        </>
                    ) : (
                        <p style={{ color: 'red' }}>Sem API Key gerada.</p>
                    )}
                </fieldset>

                {/* Admin */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>Administrador</strong></legend>
                    {admin ? (
                        <>
                            <p><strong>Nome:</strong> {admin.name}</p>
                            <p><strong>Email:</strong> {admin.email}</p>
                            <p><strong>Desde:</strong> {new Date(admin.created_at).toLocaleDateString('pt-BR')}</p>
                            <Link href={route('owner.companies.swapAdmin.form', company.id)}>
                                <button style={{ marginTop: '0.5rem' }}>Trocar Admin</button>
                            </Link>
                        </>
                    ) : (
                        <p>Nenhum admin vinculado.</p>
                    )}
                </fieldset>

                {/* Afiliados */}
                <fieldset style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <legend><strong>Afiliados ({affiliates.length})</strong></legend>
                    {affiliates.length === 0 ? (
                        <p>Nenhum afiliado cadastrado ainda.</p>
                    ) : (
                        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {affiliates.map(affiliate => (
                                    <tr key={affiliate.id}>
                                        <td>{affiliate.name}</td>
                                        <td>{affiliate.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </fieldset>

                {/* Ações */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={route('owner.companies.edit', company.id)}>
                        <button>Editar Empresa</button>
                    </Link>
                </div>
            </div>
        </>
    );
}