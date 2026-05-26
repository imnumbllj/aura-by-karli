import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Gift, TrendingUp, Settings2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/compras',    label: 'Compras',    icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/creador',    label: 'Creador',    icon: Gift },
  { to: '/ventas',     label: 'Ventas',     icon: TrendingUp },
  { to: '/productos',  label: 'Productos',  icon: Settings2 },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div className="flex min-h-screen bg-[#0E0E10]">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 w-[220px] z-[100]',
        'bg-[#111114] border-r border-white/[0.06]',
        'flex flex-col',
        'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        {/* Brand */}
        <div className="px-4 pt-[18px] pb-[14px] border-b border-white/[0.05]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[30px] h-[30px] rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-extrabold text-white tracking-[-0.5px] shadow-[0_2px_8px_rgba(232,25,75,0.4)]"
              style={{ background: 'linear-gradient(135deg,#E8194B 0%,#FF6B8A 100%)' }}>
              A
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#F4F4F5] tracking-[-0.2px] leading-[1.2]">Aura by Karli</p>
              <p className="text-[10px] text-white/[0.28] mt-[1px] tracking-[0.02em]">Gestión interna</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-[10px] flex flex-col gap-[1px] overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-[0.09em] uppercase text-white/20 px-2 pt-[6px] pb-[8px]">
            Módulos
          </p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-[9px] px-[10px] py-[7px] rounded-lg',
                'text-[13px] no-underline transition-all duration-[140ms]',
                'border-l-2',
                isActive
                  ? 'font-medium text-[#F4F4F5] bg-white/[0.07] border-[#E8194B]'
                  : 'font-normal text-white/[0.38] border-transparent hover:text-white/70 hover:bg-white/[0.03]',
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={15}
                    className={cn(
                      'flex-shrink-0 transition-colors duration-[140ms]',
                      isActive ? 'text-[#FB7185]' : 'text-white/25',
                    )}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-[14px] pt-[10px] border-t border-white/[0.05]">
          <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center gap-[6px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#4ADE80] flex-shrink-0 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              <p className="text-[11px] text-white/30 font-medium">Local · v0.1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-bar hidden fixed top-0 left-0 right-0 z-[98] bg-[rgba(14,14,16,0.9)] backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-xs font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#E8194B,#FF6B8A)' }}>
            A
          </div>
          <span className="text-[13px] font-semibold text-[#F4F4F5]">Aura by Karli</span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="bg-transparent border-none cursor-pointer text-white/50 p-1"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-[220px] min-w-0 flex flex-col pt-[52px] lg:pt-0">
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-9 max-w-[1100px] w-full mx-auto">
          <div className="page-enter" key={location.pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
