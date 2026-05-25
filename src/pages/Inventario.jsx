import { useState } from 'react';
import { useInventario } from '../store/useStore';
import { Search, Package } from 'lucide-react';

function stockBadge(n) {
  if (n === 0) return { label: 'Sin stock', bg: '#fee2e2', color: '#dc2626' };
  if (n <= 5)  return { label: 'Bajo',      bg: '#fef3c7', color: '#d97706' };
  return               { label: 'OK',        bg: '#d1fae5', color: '#059669' };
}

const FILTROS = [
  { v: 'todos',    l: 'Todos' },
  { v: 'bajo',     l: 'Bajo stock' },
  { v: 'sinstock', l: 'Sin stock' },
];

export default function Inventario() {
  const { inventario } = useInventario();
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const allItems = Object.entries(inventario);
  const items = allItems
    .filter(([n]) => n.toLowerCase().includes(search.toLowerCase()))
    .filter(([, d]) => {
      if (filtro === 'bajo')     return d.stockActual > 0 && d.stockActual <= 5;
      if (filtro === 'sinstock') return d.stockActual === 0;
      return true;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  const sinStock  = allItems.filter(([, d]) => d.stockActual === 0).length;
  const bajoStock = allItems.filter(([, d]) => d.stockActual > 0 && d.stockActual <= 5).length;

  const fmt = (n) => `$${Number(n).toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Control de stock</p>
        <h1 className="text-3xl font-bold text-[#1a0a12]">Inventario</h1>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-6">
        <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2.5" style={{ border: '1px solid #f0e6eb' }}>
          <Package size={14} className="text-[#c2185b]" />
          <span className="text-sm font-semibold text-[#1a0a12]">{allItems.length}</span>
          <span className="text-xs text-gray-400">productos</span>
        </div>
        {bajoStock > 0 && (
          <div className="bg-amber-50 rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: '1px solid #fde68a' }}>
            <span className="text-sm font-semibold text-amber-700">{bajoStock}</span>
            <span className="text-xs text-amber-600">bajo stock</span>
          </div>
        )}
        {sinStock > 0 && (
          <div className="bg-red-50 rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: '1px solid #fecaca' }}>
            <span className="text-sm font-semibold text-red-600">{sinStock}</span>
            <span className="text-xs text-red-500">sin stock</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
            style={{ border: '1px solid #e8d8e0' }}
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 bg-white rounded-xl p-1" style={{ border: '1px solid #e8d8e0' }}>
          {FILTROS.map(({ v, l }) => (
            <button key={v} onClick={() => setFiltro(v)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filtro === v
                ? { background: '#c2185b', color: '#fff' }
                : { color: '#9ca3af' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #f0e6eb' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fdf6f9', borderBottom: '2px solid #fce4ec' }}>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Producto</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Stock actual</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Total comprado</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Costo prom.</th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-gray-400 text-sm">
                  No se encontraron productos
                </td>
              </tr>
            )}
            {items.map(([nombre, data], i) => {
              const badge = stockBadge(data.stockActual);
              return (
                <tr key={nombre}
                  className="transition-colors hover:bg-[#fdf6f9]"
                  style={{ borderBottom: i < items.length - 1 ? '1px solid #fce4ec' : 'none' }}>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{nombre}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-bold text-[#1a0a12] text-base">{data.stockActual}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-500">{data.totalComprado}</td>
                  <td className="px-5 py-3.5 text-right text-gray-500">{fmt(data.costoPromedio)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">{items.length} de {allItems.length} productos</p>
    </div>
  );
}
