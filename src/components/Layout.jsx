import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings2, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/compras',    label: 'Compras',    icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/creador',    label: 'Creador',    icon: Gift },
  { to: '/ventas',     label: 'Ventas',     icon: TrendingUp },
  { to: '/productos',  label: 'Productos',  icon: Settings2 },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <style>{`
        .abk-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0; width: 220px; z-index: 100;
          background: #111114; border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1);
        }
        .abk-topbar { display: none; }
        .abk-content { margin-left: 220px; }
        .abk-main { padding: 36px 40px; max-width: 1120px; width: 100%; }

        @media (max-width: 1023px) {
          .abk-sidebar { transform: translateX(-220px); }
          .abk-sidebar.is-open { transform: translateX(0); }
          .abk-topbar { display: flex; }
          .abk-content { margin-left: 0; padding-top: 52px; }
          .abk-main { padding: 20px 16px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#0E0E10' }}>

        {/* Backdrop */}
        {open && (
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          }} />
        )}

        {/* Sidebar */}
        <aside className={`abk-sidebar${open ? ' is-open' : ''}`}>

          <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg,#E8194B 0%,#FF6B8A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: '#fff',
                boxShadow: '0 2px 8px rgba(232,25,75,0.35)', flexShrink: 0,
              }}>A</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5', letterSpacing: '-0.2px', lineHeight: 1.2 }}>Aura by Karli</p>
                <p style={{ fontSize: 10, color: 'rgba(244,244,245,0.28)', marginTop: 1 }}>Gestión interna</p>
              </div>
            </div>
          </div>

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
                  color: isActive ? '#F4F4F5' : 'rgba(244,244,245,0.4)',
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#E8194B' : 'transparent'}`,
                  textDecoration: 'none', transition: 'all 0.14s ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} style={{ color: isActive ? '#FB7185' : 'rgba(244,244,245,0.25)', flexShrink: 0 }} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.5)', flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: 'rgba(244,244,245,0.3)', fontWeight: 500 }}>Local · v0.1</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="abk-topbar" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80,
          background: 'rgba(14,14,16,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 16px', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#E8194B,#FF6B8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>A</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5' }}>Aura by Karli</span>
          </div>
          <button onClick={() => setOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,244,245,0.5)', padding: 4, display: 'flex' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Content */}
        <div className="abk-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <main className="abk-main">
            <div className="page-enter" key={location.pathname}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
