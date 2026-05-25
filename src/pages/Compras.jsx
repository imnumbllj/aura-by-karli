import { useState } from 'react';
import { useCompras, useProductos } from '../store/useStore';
import { Plus, Trash2, Search, ChevronDown, ShoppingCart } from 'lucide-react';

function NuevaCompraForm({ onClose, productos, registrar }) {
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoy);
  const [items, setItems] = useState([{ producto: '', cantidad: '', costoTotal: '' }]);

  const addItem = () => setItems(p => [...p, { producto: '', cantidad: '', costoTotal: '' }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) => setItems(p => p.map((it, idx) => idx === i ? { ...it, [f]: v } : it));

  const subtotal = items.reduce((s, it) => s + (Number(it.costoTotal) || 0), 0);
  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = items.filter(it => it.producto && it.cantidad && it.costoTotal);
    if (!valid.length) return;
    const enriched = valid.map(it => {
      const p = productos.find(pr => pr.nombreCompleto === it.producto) || {};
      return { producto: it.producto, categoria: p.categoria || '', tipo: p.tipo || '', unidad: p.unidad || '', cantidad: Number(it.cantidad), costoTotal: Number(it.costoTotal) };
    });
    registrar(enriched, fecha);
    onClose();
  };

  const prodOrdenados = productos.filter(p => p.activo).sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(26,10,18,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #fce4ec' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fce4ec' }}>
              <ShoppingCart size={16} className="text-[#c2185b]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a0a12]">Nueva Compra</h3>
              <p className="text-xs text-gray-400">Registra los productos adquiridos</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fecha de compra</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
              className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20 w-full max-w-xs"
              style={{ borderColor: '#e8d8e0' }} />
          </div>

          {/* Items */}
          <div>
            <div className="grid grid-cols-[1fr_78px_100px_36px] gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              <span>Producto</span><span>Cant.</span><span>Costo total</span><span></span>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_78px_100px_36px] gap-2 items-center">
                  <select value={it.producto} onChange={e => updateItem(i, 'producto', e.target.value)}
                    className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20 bg-white text-gray-800"
                    style={{ borderColor: '#e8d8e0' }}>
                    <option value="">Seleccionar...</option>
                    {prodOrdenados.map(p => <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>)}
                  </select>
                  <input type="number" min="0" placeholder="0" value={it.cantidad} onChange={e => updateItem(i, 'cantidad', e.target.value)}
                    className="border rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                    style={{ borderColor: '#e8d8e0' }} />
                  <input type="number" min="0" placeholder="0" value={it.costoTotal} onChange={e => updateItem(i, 'costoTotal', e.target.value)}
                    className="border rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                    style={{ borderColor: '#e8d8e0' }} />
                  <button type="button" onClick={() => removeItem(i)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem}
              className="flex items-center gap-1.5 text-sm font-medium text-[#c2185b] hover:text-[#ad1457] mt-3 transition-colors">
              <Plus size={14} /> Agregar producto
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #fce4ec' }}>
            <div>
              <p className="text-xs text-gray-400">Total de la compra</p>
              <p className="text-lg font-bold text-[#1a0a12]">{fmt(subtotal)}</p>
            </div>
            <div className="flex gap-2.5">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                style={{ border: '1px solid #e5e7eb' }}>
                Cancelar
              </button>
              <button type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:bg-[#ad1457]"
                style={{ background: '#c2185b' }}>
                Registrar compra
              </button>
            </div>
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

  const totalInvertido = compras.reduce((s, c) => s + (c['Costo T'] || 0), 0);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Registro de compras</p>
          <h1 className="text-3xl font-bold text-[#1a0a12]">Compras</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#ad1457] transition-colors mt-1"
          style={{ background: '#c2185b' }}>
          <Plus size={15} /> Nueva Compra
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm" style={{ border: '1px solid #f0e6eb' }}>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Total invertido</p>
          <p className="text-2xl font-bold text-[#1a0a12]">{fmt(totalInvertido)}</p>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm" style={{ border: '1px solid #f0e6eb' }}>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Órdenes de compra</p>
          <p className="text-2xl font-bold text-[#1a0a12]">{Object.keys(grouped).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
          style={{ border: '1px solid #e8d8e0' }}
          placeholder="Buscar por producto o ID de compra..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Accordion list */}
      <div className="space-y-2">
        {groups.length === 0 && (
          <div className="text-center py-14 text-gray-400 bg-white rounded-2xl" style={{ border: '1px solid #f0e6eb' }}>
            No se encontraron compras
          </div>
        )}
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #f0e6eb' }}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#fdf6f9]"
              onClick={() => setExpandedId(expandedId === g.id ? null : g.id)}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg text-[#c2185b]" style={{ background: '#fce4ec' }}>
                  {g.id}
                </span>
                <span className="text-sm text-gray-500">{g.fecha}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">
                  {g.items.length} producto{g.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1a0a12]">{fmt(g.total)}</span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${expandedId === g.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expandedId === g.id && (
              <div style={{ borderTop: '1px solid #fce4ec' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#fdf6f9', borderBottom: '1px solid #fce4ec' }}>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cant.</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">C. Unitario</th>
                      <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">C. Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((item, i) => (
                      <tr key={i} className="hover:bg-[#fdf6f9] transition-colors"
                        style={{ borderBottom: i < g.items.length - 1 ? '1px solid #fce4ec' : 'none' }}>
                        <td className="px-5 py-3 text-gray-700">{item.Producto}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{item.Cantidad}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{fmt(item['Costo U'])}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-800">{fmt(item['Costo T'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">Mostrando últimas 50 órdenes</p>

      {showForm && <NuevaCompraForm onClose={() => setShowForm(false)} productos={productos} registrar={registrar} />}
    </div>
  );
}
