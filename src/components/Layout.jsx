import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings2 } from 'lucide-react';

const NAV = [
  { to: '/',           label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/inventario', label: 'Inventario',          icon: Package },
  { to: '/compras',    label: 'Compras',             icon: ShoppingCart },
  { to: '/creador',    label: 'Creador de Regalos',  icon: Gift },
  { to: '/ventas',     label: 'Ventas',              icon: TrendingUp },
  { to: '/productos',  label: 'Productos',           icon: Settings2 },
];

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F4F5' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: '#0C0A0B',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>

        {/* Brand */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              background: 'linear-gradient(135deg, #C2185B 0%, #E91E8C 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
            }}>A</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
                Aura by Karli
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                Gestión interna
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', padding: '8px 8px 6px' }}>
            Módulos
          </p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px', borderRadius: 7,
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                color: isActive ? '#FAFAFA' : 'rgba(255,255,255,0.4)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.12s',
                borderLeft: isActive ? '2px solid #C2185B' : '2px solid transparent',
              })}>
              {({ isActive }) => (
                <>
                  <Icon size={15} style={{ color: isActive ? '#F48FB1' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 8,
            padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
              Datos locales · v0.1
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, padding: '32px 36px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
