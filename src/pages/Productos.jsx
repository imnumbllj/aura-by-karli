import { useState } from 'react';
import { useProductos } from '../store/useStore';
import { Plus, Search, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

const CATEGORIAS = ['Producto Principal', 'Complemento', 'Empaque', 'Decoración', 'Servicio'];
const TIPOS      = ['Directo', 'Indirecto', 'Servicio'];
const UNIDADES   = ['Unidad', 'Metro', 'CM', 'Pomo', 'Paquete'];

const CATCOLOR = {
  'Producto Principal': { bg: '#ede9fe', color: '#7c3aed' },
  'Complemento':        { bg: '#dbeafe', color: '#2563eb' },
  'Empaque':            { bg: '#ccfbf1', color: '#0d9488' },
  'Decoración':         { bg: '#fce7f3', color: '#be185d' },
  'Servicio':           { bg: '#fef3c7', color: '#b45309' },
};

function NuevoProductoForm({ onClose, agregar, productos }) {
  const nextId = `P${String(Math.max(0, ...productos.map(p => parseInt(p.id.slice(1)) || 0)) + 1).padStart(3, '0')}`;
  const [form, setForm] = useState({ id: nextId, nombre: '', variante: '', categoria: CATEGORIAS[0], tipo: TIPOS[0], unidad: UNIDADES[0] });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const nombreCompleto = form.variante ? `${form.nombre} - ${form.variante}` : form.nombre;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre) return;
    agregar({ ...form, nombreCompleto, activo: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(26,10,18,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #fce4ec' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fce4ec' }}>
              <Settings size={16} className="text-[#c2185b]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a0a12]">Nuevo Producto</h3>
              <p className="text-xs text-gray-400">Agregar al catálogo</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-lg">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre *</label>
              <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} required
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                style={{ border: '1px solid #e8d8e0' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Variante</label>
              <input type="text" value={form.variante} onChange={e => set('variante', e.target.value)} placeholder="Opcional"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                style={{ border: '1px solid #e8d8e0' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['categoria', 'Categoría', CATEGORIAS], ['tipo', 'Tipo', TIPOS], ['unidad', 'Unidad', UNIDADES]].map(([key, lbl, opts]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{lbl}</label>
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                  style={{ border: '1px solid #e8d8e0' }}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {nombreCompleto && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: '#fdf6f9', border: '1px solid #fce4ec' }}>
              <span className="text-gray-400 text-xs">Nombre completo: </span>
              <span className="font-semibold text-[#1a0a12]">{nombreCompleto}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-1" style={{ borderTop: '1px solid #fce4ec' }}>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ border: '1px solid #e5e7eb' }}>
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-[#ad1457] transition-colors"
              style={{ background: '#c2185b' }}>
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Productos() {
  const { productos, agregar, toggleActivo } = useProductos();
  const [search, setSearch] = useState('');
  const [catFiltro, setCatFiltro] = useState('Todos');
  const [showForm, setShowForm] = useState(false);

  const filtered = productos
    .filter(p => p.nombreCompleto.toLowerCase().includes(search.toLowerCase()))
    .filter(p => catFiltro === 'Todos' || p.categoria === catFiltro)
    .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  const activos = productos.filter(p => p.activo).length;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Catálogo</p>
          <h1 className="text-3xl font-bold text-[#1a0a12]">Productos</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#ad1457] transition-colors mt-1"
          style={{ background: '#c2185b' }}>
          <Plus size={15} /> Nuevo Producto
        </button>
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
        <div className="flex flex-wrap gap-1.5 bg-white rounded-xl p-1" style={{ border: '1px solid #e8d8e0' }}>
          {['Todos', ...CATEGORIAS].map(c => (
            <button key={c} onClick={() => setCatFiltro(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={catFiltro === c
                ? { background: '#c2185b', color: '#fff' }
                : { color: '#9ca3af' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex gap-3 mb-4 text-xs text-gray-500">
        <span><strong className="text-[#1a0a12] font-semibold">{activos}</strong> activos</span>
        <span>·</span>
        <span><strong className="text-[#1a0a12] font-semibold">{productos.length - activos}</strong> inactivos</span>
        <span>·</span>
        <span><strong className="text-[#1a0a12] font-semibold">{filtered.length}</strong> mostrados</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #f0e6eb' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fdf6f9', borderBottom: '2px solid #fce4ec' }}>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Producto</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Categoría</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Tipo</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Unidad</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Activo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-14 text-gray-400">No se encontraron productos</td></tr>
            )}
            {filtered.map((p, i) => {
              const cat = CATCOLOR[p.categoria] || { bg: '#f3f4f6', color: '#6b7280' };
              return (
                <tr key={p.id}
                  className={`transition-colors hover:bg-[#fdf6f9] ${!p.activo ? 'opacity-40' : ''}`}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #fce4ec' : 'none' }}>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-gray-800">{p.nombreCompleto}</span>
                    <span className="text-[11px] text-gray-400 ml-2 font-mono">{p.id}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: cat.bg, color: cat.color }}>
                      {p.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-gray-500">{p.tipo}</td>
                  <td className="px-4 py-3.5 text-center text-xs text-gray-500">{p.unidad}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => toggleActivo(p.id)}
                      className="flex items-center justify-center mx-auto transition-colors hover:opacity-80">
                      {p.activo
                        ? <ToggleRight size={24} className="text-[#c2185b]" />
                        : <ToggleLeft size={24} className="text-gray-300" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && <NuevoProductoForm onClose={() => setShowForm(false)} agregar={agregar} productos={productos} />}
    </div>
  );
}
