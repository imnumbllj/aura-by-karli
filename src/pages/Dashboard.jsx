import { useMemo } from 'react';
import { useInventario } from '../store/useStore';
import { Package, TrendingUp, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';
import comprasData from '../data/compras.json';
import ventasData from '../data/ventas.json';

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #f0e6eb' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + '18' }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1a0a12] leading-none mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-gray-300 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { inventario } = useInventario();

  const stats = useMemo(() => {
    const stockItems = Object.entries(inventario);
    const totalProductos = stockItems.length;
    const bajoStock = stockItems.filter(([, v]) => v.stockActual <= 5).length;
    const totalInvertido = comprasData.reduce((s, c) => s + (c['Costo T'] || 0), 0);
    const totalVentas = ventasData.reduce((s, v) => s + (v.total || 0), 0);
    return { totalProductos, bajoStock, totalInvertido, totalVentas };
  }, [inventario]);

  const bajoStockItems = useMemo(() => {
    return Object.entries(inventario)
      .filter(([, v]) => v.stockActual <= 5)
      .sort((a, b) => a[1].stockActual - b[1].stockActual)
      .slice(0, 8);
  }, [inventario]);

  const fmt = (n) => `$${Number(n).toLocaleString('es-DO')}`;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Panel principal</p>
        <h1 className="text-3xl font-bold text-[#1a0a12]">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package}       label="Productos"      value={stats.totalProductos} sub={`${stats.totalProductos} tipos en inventario`} accent="#c2185b" />
        <StatCard icon={AlertTriangle} label="Bajo stock"     value={stats.bajoStock}      sub="5 unidades o menos"   accent="#f59e0b" />
        <StatCard icon={DollarSign}    label="Total invertido" value={fmt(stats.totalInvertido)} sub="en compras"      accent="#10b981" />
        <StatCard icon={TrendingUp}    label="Total ventas"   value={fmt(stats.totalVentas)} sub="en regalos"          accent="#8b5cf6" />
      </div>

      {/* Bajo stock */}
      {bajoStockItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #f0e6eb' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #fce4ec' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={14} className="text-amber-500" />
              </div>
              <h2 className="font-semibold text-[#1a0a12] text-sm">Productos con bajo stock</h2>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              {bajoStockItems.length} alertas
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {bajoStockItems.map(([nombre, data]) => (
              <div key={nombre} className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: data.stockActual === 0 ? '#fff5f5' : '#fffbeb', border: `1px solid ${data.stockActual === 0 ? '#fecaca' : '#fde68a'}` }}>
                <span className="text-xs font-medium text-gray-700 truncate mr-2 leading-snug">{nombre}</span>
                <span className={`text-sm font-bold shrink-0 ${data.stockActual === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                  {data.stockActual}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
