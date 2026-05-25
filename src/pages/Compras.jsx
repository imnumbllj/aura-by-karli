import { useState } from 'react';
import { useCompras, useProductos } from '../store/useStore';
import { Plus, Trash2, Search, ChevronDown } from 'lucide-react';

function NuevaCompraForm({ onClose, productos, registrar }) {
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoy);
  const [items, setItems] = useState([{ producto: '', cantidad: '', costoTotal: '' }]);

  const addItem = () => setItems(p => [...p, { producto: '', cantidad: '', costoTotal: '' }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(p => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = items.filter(it => it.producto && it.cantidad && it.costoTotal);
    if (!valid.length) return;
    const enriched = valid.map(it => {
      const p = productos.find(pr => pr.nombreCompleto === it.producto) || {};
      return {
        producto: it.producto,
        categoria: p.categoria || '',
        tipo: p.tipo || '',
        unidad: p.unidad || '',
        cantidad: Number(it.cantidad),
        costoTotal: Number(it.costoTotal),
      };
    });
    registrar(enriched, fecha);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
        <div className="px-6 py-4 border-b border-[#fce4ec] flex items-center justify-between">
          <h3 className="font-bold text-[#1a0a12] text-lg">Nueva Compra</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
              className="border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] w-full max-w-xs" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
              <span>Producto</span><span>Cant.</span><span>Costo total</span><span></span>
            </div>
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                <select
                  value={it.producto}
                  onChange={e => updateItem(i, 'producto', e.target.value)}
                  className="border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {productos.filter(p => p.activo).sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto)).map(p => (
                    <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>
                  ))}
                </select>
                <input type="number" min="0" placeholder="0"
                  value={it.cantidad} onChange={e => updateItem(i, 'cantidad', e.target.value)}
                  className="border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] text-right" />
                <input type="number" min="0" placeholder="0"
                  value={it.costoTotal} onChange={e => updateItem(i, 'costoTotal', e.target.value)}
                  className="border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] text-right" />
                <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 flex items-center justify-center">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem}
              className="flex items-center gap-2 text-sm text-[#c2185b] hover:text-[#ad1457] font-medium mt-1">
              <Plus size={15} /> Agregar producto
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#fce4ec]">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#c2185b] text-white hover:bg-[#ad1457]">
              Registrar compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Compras() {
  const { compras, registrar } = useCompras();
  const { productos } = useProductos();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

  const grouped = compras
    .filter(c => c.Producto?.toLowerCase().includes(search.toLowerCase()) || c.ID?.toLowerCase().includes(search.toLowerCase()))
    .reduce((acc, c) => {
      if (!acc[c.ID]) acc[c.ID] = { id: c.ID, fecha: c.Fecha, items: [], total: 0 };
      acc[c.ID].items.push(c);
      acc[c.ID].total += c['Costo T'] || 0;
      return acc;
    }, {});

  const groups = Object.values(grouped).sort((a, b) => (b.fecha > a.fecha ? 1 : -1)).slice(0, 50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a0a12]">Compras</h2>
          <p className="text-sm text-gray-500 mt-0.5">{compras.length} registros en total</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#c2185b] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#ad1457] shadow-sm">
          <Plus size={16} /> Nueva Compra
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#fce4ec] bg-white text-sm focus:outline-none focus:border-[#c2185b]"
          placeholder="Buscar por producto o ID de compra..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-2xl border border-[#fce4ec] shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#fdf6f9] transition-colors"
              onClick={() => setExpandedId(expandedId === g.id ? null : g.id)}
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#c2185b] text-sm font-mono">{g.id}</span>
                <span className="text-sm text-gray-500">{g.fecha}</span>
                <span className="text-xs text-gray-400">{g.items.length} producto{g.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1a0a12]">{fmt(g.total)}</span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${expandedId === g.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedId === g.id && (
              <div className="border-t border-[#fce4ec]">
                <table className="w-full text-sm">
                  <thead className="bg-[#fce4ec]/40">
                    <tr>
                      <th className="text-left px-5 py-2.5 font-semibold text-gray-600">Producto</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Cant.</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Costo U.</th>
                      <th className="text-right px-5 py-2.5 font-semibold text-gray-600">Costo T.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#fdf6f9]'}>
                        <td className="px-5 py-2.5 text-gray-800">{item.Producto}</td>
                        <td className="px-3 py-2.5 text-center text-gray-600">{item.Cantidad}</td>
                        <td className="px-3 py-2.5 text-right text-gray-600">{fmt(item['Costo U'])}</td>
                        <td className="px-5 py-2.5 text-right font-medium text-gray-800">{fmt(item['Costo T'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-12 text-gray-400">No se encontraron compras</div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">Mostrando últimas 50 compras</p>

      {showForm && (
        <NuevaCompraForm onClose={() => setShowForm(false)} productos={productos} registrar={registrar} />
      )}
    </div>
  );
}
