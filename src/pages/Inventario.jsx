import { useState } from 'react';
import { useInventario } from '../store/useStore';
import { Search } from 'lucide-react';

const BADGE = {
  0: 'bg-red-100 text-red-700',
  low: 'bg-amber-100 text-amber-700',
  ok: 'bg-emerald-100 text-emerald-700',
};

function stockBadge(n) {
  if (n === 0) return { label: 'Sin stock', cls: BADGE[0] };
  if (n <= 5) return { label: 'Bajo', cls: BADGE.low };
  return { label: 'OK', cls: BADGE.ok };
}

export default function Inventario() {
  const { inventario } = useInventario();
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const items = Object.entries(inventario)
    .filter(([nombre]) => nombre.toLowerCase().includes(search.toLowerCase()))
    .filter(([, d]) => {
      if (filtro === 'bajo') return d.stockActual <= 5 && d.stockActual > 0;
      if (filtro === 'sinstock') return d.stockActual === 0;
      return true;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  const fmt = (n) => `$${Number(n).toLocaleString('es-DO')}`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a0a12]">Inventario</h2>
        <p className="text-sm text-gray-500 mt-0.5">Stock actual y costo promedio por producto</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#fce4ec] bg-white text-sm focus:outline-none focus:border-[#c2185b] focus:ring-1 focus:ring-[#c2185b]/20"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[['todos', 'Todos'], ['bajo', 'Bajo stock'], ['sinstock', 'Sin stock']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFiltro(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filtro === v ? 'bg-[#c2185b] text-white' : 'bg-white text-gray-600 border border-[#fce4ec] hover:border-[#c2185b]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#fce4ec] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fce4ec]/50">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-[#1a0a12]">Producto</th>
              <th className="text-right px-5 py-3 font-semibold text-[#1a0a12]">Stock</th>
              <th className="text-right px-5 py-3 font-semibold text-[#1a0a12]">Total comprado</th>
              <th className="text-right px-5 py-3 font-semibold text-[#1a0a12]">Costo prom.</th>
              <th className="text-center px-5 py-3 font-semibold text-[#1a0a12]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No se encontraron productos</td></tr>
            )}
            {items.map(([nombre, data], i) => {
              const badge = stockBadge(data.stockActual);
              return (
                <tr key={nombre} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fdf6f9]'}>
                  <td className="px-5 py-3 font-medium text-gray-800">{nombre}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#1a0a12]">{data.stockActual}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{data.totalComprado}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{fmt(data.costoPromedio)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">{items.length} productos mostrados</p>
    </div>
  );
}
