import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings2, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/compras',    label: 'Compras',    icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/creador',    label: 'Creador',            icon: Gift },
  { to: '/ventas',     label: 'Ventas',             icon: TrendingUp },
  { to: '/productos',  label: 'Productos',          icon: Settings2 },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0E0E10' }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="sidebar"
        style={{
          width: 220, flexShrink: 0,
          background: '#111114',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
          transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #E8194B 0%, #FF6B8A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
              boxShadow: '0 2px 8px rgba(232,25,75,0.4)',
            }}>A</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
                Aura by Karli
              </p>
              <p style={{ fontSize: 10, color: 'rgba(244,244,245,0.28)', marginTop: 1, letterSpacing: '0.02em' }}>
                Gestión interna
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(244,244,245,0.2)', padding: '6px 8px 8px' }}>
            Módulos
          </p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px', borderRadius: 8,
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                color: isActive ? '#F4F4F5' : 'rgba(244,244,245,0.38)',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                borderLeft: isActive ? '2px solid #E8194B' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.14s ease',
                marginBottom: 1,
              })}
              onMouseEnter={e => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(244,244,245,0.7)'; }}
              onMouseLeave={e => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(244,244,245,0.38)'; }}
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} style={{ color: isActive ? '#FB7185' : 'rgba(244,244,245,0.25)', flexShrink: 0, transition: 'color 0.14s' }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.6)', flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: 'rgba(244,244,245,0.3)', fontWeight: 500 }}>Local · v0.1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 98,
        background: 'rgba(14,14,16,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
      }} className="mobile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#E8194B,#FF6B8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>A</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5' }}>Aura by Karli</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,244,245,0.5)', padding: 4 }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: 220, minWidth: 0, display: 'flex', flexDirection: 'column' }} className="main-content">
        <main style={{ flex: 1, padding: '36px 40px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
          <div className="page-enter" key={location.pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
