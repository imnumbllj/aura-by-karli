import { useMemo } from 'react';
import { useInventario } from '../store/useStore';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import comprasData from '../data/compras.json';
import ventasData from '../data/ventas.json';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#fce4ec]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-[#1a0a12]">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
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
      .slice(0, 6);
  }, [inventario]);

  const fmt = (n) => `$${Number(n).toLocaleString('es-DO')}`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a0a12]">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del negocio</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Productos en stock" value={stats.totalProductos} sub="tipos distintos" color="bg-[#c2185b]" />
        <StatCard icon={AlertTriangle} label="Bajo stock" value={stats.bajoStock} sub="5 unidades o menos" color="bg-amber-500" />
        <StatCard icon={DollarSign} label="Total invertido" value={fmt(stats.totalInvertido)} sub="todas las compras" color="bg-emerald-600" />
        <StatCard icon={TrendingUp} label="Total ventas" value={fmt(stats.totalVentas)} sub="todos los regalos" color="bg-violet-600" />
      </div>

      {bajoStockItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#fce4ec] p-5">
          <h3 className="font-semibold text-[#1a0a12] mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Productos con bajo stock
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bajoStockItems.map(([nombre, data]) => (
              <div key={nombre} className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                <span className="text-sm font-medium text-gray-800 truncate mr-2">{nombre}</span>
                <span className={`text-sm font-bold shrink-0 ${data.stockActual === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {data.stockActual} uds
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
