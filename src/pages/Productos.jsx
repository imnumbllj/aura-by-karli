import { useState } from 'react';
import { useProductos } from '../store/useStore';
import { Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const CATEGORIAS = ['Producto Principal', 'Complemento', 'Empaque', 'Decoración', 'Servicio'];
const TIPOS = ['Directo', 'Indirecto', 'Servicio'];
const UNIDADES = ['Unidad', 'Metro', 'CM', 'Pomo', 'Paquete'];

const CATCOLOR = {
  'Producto Principal': 'bg-violet-100 text-violet-700',
  'Complemento': 'bg-blue-100 text-blue-700',
  'Empaque': 'bg-teal-100 text-teal-700',
  'Decoración': 'bg-pink-100 text-pink-700',
  'Servicio': 'bg-amber-100 text-amber-700',
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-[#fce4ec] flex items-center justify-between">
          <h3 className="font-bold text-[#1a0a12] text-lg">Nuevo Producto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} required
                className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Variante</label>
              <input type="text" value={form.variante} onChange={e => set('variante', e.target.value)} placeholder="Opcional"
                className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['categoria', 'Categoría', CATEGORIAS], ['tipo', 'Tipo', TIPOS], ['unidad', 'Unidad', UNIDADES]].map(([key, lbl, opts]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{lbl}</label>
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] bg-white">
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {nombreCompleto && (
            <div className="bg-[#fce4ec]/40 rounded-xl px-4 py-2.5 text-sm text-gray-600">
              Nombre completo: <span className="font-semibold text-[#1a0a12]">{nombreCompleto}</span>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-1 border-t border-[#fce4ec]">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#c2185b] text-white hover:bg-[#ad1457]">
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a0a12]">Productos</h2>
          <p className="text-sm text-gray-500 mt-0.5">{productos.filter(p => p.activo).length} activos · {productos.length} total</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#c2185b] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#ad1457] shadow-sm">
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#fce4ec] bg-white text-sm focus:outline-none focus:border-[#c2185b]"
            placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Todos', ...CATEGORIAS].map(c => (
            <button key={c} onClick={() => setCatFiltro(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                catFiltro === c ? 'bg-[#c2185b] text-white' : 'bg-white text-gray-600 border border-[#fce4ec] hover:border-[#c2185b]'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#fce4ec] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fce4ec]/50">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-[#1a0a12]">Producto</th>
              <th className="text-center px-3 py-3 font-semibold text-[#1a0a12]">Categoría</th>
              <th className="text-center px-3 py-3 font-semibold text-[#1a0a12]">Tipo</th>
              <th className="text-center px-3 py-3 font-semibold text-[#1a0a12]">Unidad</th>
              <th className="text-center px-3 py-3 font-semibold text-[#1a0a12]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No se encontraron productos</td></tr>
            )}
            {filtered.map((p, i) => (
              <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#fdf6f9]'} ${!p.activo ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3">
                  <span className="font-medium text-gray-800">{p.nombreCompleto}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.id}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATCOLOR[p.categoria] || 'bg-gray-100 text-gray-600'}`}>
                    {p.categoria}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-gray-500 text-xs">{p.tipo}</td>
                <td className="px-3 py-3 text-center text-gray-500 text-xs">{p.unidad}</td>
                <td className="px-3 py-3 text-center">
                  <button onClick={() => toggleActivo(p.id)} className="flex items-center justify-center mx-auto text-gray-400 hover:text-[#c2185b] transition-colors">
                    {p.activo
                      ? <ToggleRight size={22} className="text-[#c2185b]" />
                      : <ToggleLeft size={22} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <NuevoProductoForm onClose={() => setShowForm(false)} agregar={agregar} productos={productos} />}
    </div>
  );
}
