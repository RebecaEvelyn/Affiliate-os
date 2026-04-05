import { Link } from '@inertiajs/react';

const C = {
    sidebar:      '#1a1a2e',
    primary:      '#667eea',
    primaryD:     '#764ba2',
    gradient:     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    white:        '#ffffff',
    textMuted:    'rgba(255,255,255,0.5)',
    textLight:    'rgba(255,255,255,0.75)',
    hoverBg:      'rgba(255,255,255,0.08)',
    border:       'rgba(255,255,255,0.1)',
    bg:           '#f0f2f5',
};

function SidebarLink({ href, icon, label, active, badge }) {
    return (
        <Link
            href={href}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: active ? C.gradient : 'transparent',
                color: active ? C.white : C.textLight,
                textDecoration: 'none', fontSize: '14px',
                fontWeight: active ? 600 : 400,
                marginBottom: '4px', transition: 'all 0.2s',
                position: 'relative',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.hoverBg; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
        >
            <span style={{ fontSize: '18px', minWidth: '22px' }}>{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                    {badge}
                </span>
            )}
        </Link>
    );
}

export default function AppLayout({ children, user, navItems, title, subtitle }) {
    const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: '"Inter", system-ui, sans-serif' }}>

            {/* Sidebar */}
            <div style={{ width: '260px', minHeight: '100vh', background: C.sidebar, display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>

                {/* Logo */}
                <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            📊
                        </div>
                        <div>
                            <div style={{ color: C.white, fontWeight: 700, fontSize: '16px' }}>Affiliate OS</div>
                            <div style={{ color: C.textMuted, fontSize: '12px' }}>{subtitle}</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px' }}>
                    {navItems.map((item, i) => (
                        <SidebarLink key={i} {...item} />
                    ))}
                </nav>

                {/* User + Logout */}
                <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: C.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                            {initial}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ color: C.white, fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                            <div style={{ color: C.textMuted, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                        </div>
                    </div>
                    <form method="POST" action="/logout">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', width: '100%' }}
                            onMouseEnter={e => e.currentTarget.style.color = C.white}
                            onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                        >
                            <span>🚪</span> Sair
                        </button>
                    </form>
                </div>
            </div>

            {/* Main */}
            <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
                {title && (
                    <div style={{ marginBottom: '28px' }}>
                        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#1f2937' }}>{title}</h1>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}