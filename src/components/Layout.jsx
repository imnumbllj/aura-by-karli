import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/compras', label: 'Compras', icon: ShoppingCart },
  { to: '/creador', label: 'Creador de Regalos', icon: Gift },
  { to: '/ventas', label: 'Ventas', icon: TrendingUp },
  { to: '/productos', label: 'Productos', icon: Settings },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f0f4]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1a0a12 0%, #2d1020 100%)' }}>

        {/* Brand */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black"
              style={{ background: 'linear-gradient(135deg, #c2185b, #e91e8c)' }}>
              A
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight tracking-wide">Aura by Karli</p>
              <p className="text-[11px] leading-tight" style={{ color: 'rgba(248,187,217,0.5)' }}>Negocio de Regalos</p>
            </div>
          </div>
        </div>

        <div className="mx-6 mb-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'rgba(248,187,217,0.35)' }}>
            Módulos
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'rgba(194,24,91,0.25)', boxShadow: 'inset 3px 0 0 #c2185b' }
                : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-[#f48fb1]' : 'text-white/40 group-hover:text-white/60'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5">
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px] font-semibold text-white/50">Modo local</p>
            <p className="text-[10px] text-white/25 mt-0.5">Datos en este navegador</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
