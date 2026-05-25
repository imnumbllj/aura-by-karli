import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/compras', label: 'Compras', icon: ShoppingCart },
  { to: '/creador', label: 'Creador', icon: Gift },
  { to: '/ventas', label: 'Ventas', icon: TrendingUp },
  { to: '/productos', label: 'Productos', icon: Settings },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1a0a12] text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs font-semibold tracking-widest text-[#f8bbd9]/60 uppercase mb-1">Gestión Interna</p>
          <h1 className="text-lg font-bold text-white leading-tight">Aura by Karli</h1>
          <p className="text-[11px] text-[#f8bbd9]/50 mt-0.5">Negocio de Regalos</p>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#c2185b] text-white shadow-md'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] text-white/25 text-center">v0.1 · Solo local</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#fdf6f9]">
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
