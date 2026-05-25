import { useState } from 'react';
import { useVentas } from '../store/useStore';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

function NuevaVentaForm({ onClose, registrar }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState('');

  const total = Number(cantidad) * Number(precio);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;
    const hoy = new Date().toISOString().split('T')[0];
    registrar({ nombre, cantidad: Number(cantidad), precio: Number(precio), total, fecha: hoy });
    onClose();
  };

  const fmt = (n) => n ? `$${Number(n).toLocaleString('es-DO')}` : '-';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-4 border-b border-[#fce4ec] flex items-center justify-between">
          <h3 className="font-bold text-[#1a0a12] text-lg">Registrar Venta</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nombre del regalo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Aura Pink" required
              className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Cantidad</label>
              <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)}
                className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Precio unitario</label>
              <input type="number" min="0" value={precio} onChange={e => setPrecio(e.target.value)}
                placeholder="0" required
                className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
            </div>
          </div>
          <div className="bg-[#fce4ec]/50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total venta</p>
            <p className="text-2xl font-bold text-[#c2185b]">{fmt(total)}</p>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#c2185b] text-white hover:bg-[#ad1457]">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Ventas() {
  const { ventas, registrar, eliminar } = useVentas();
  const [showForm, setShowForm] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const totalGeneral = ventas.reduce((s, v) => s + (v.total || 0), 0);
  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a0a12]">Ventas</h2>
          <p className="text-sm text-gray-500 mt-0.5">{ventas.length} ventas · Total: <span className="font-semibold text-[#c2185b]">{fmt(totalGeneral)}</span></p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#c2185b] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#ad1457] shadow-sm">
          <Plus size={16} /> Nueva Venta
        </button>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-[#fce4ec] to-[#fdf6f9] rounded-2xl border border-[#f8bbd9] p-5 mb-6 flex items-center gap-4">
        <div className="bg-[#c2185b] p-3 rounded-xl">
          <TrendingUp size={22} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Ingresos totales registrados</p>
          <p className="text-3xl font-extrabold text-[#1a0a12]">{fmt(totalGeneral)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#fce4ec] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fce4ec]/50">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-[#1a0a12]">Regalo</th>
              <th className="text-center px-3 py-3 font-semibold text-[#1a0a12]">Cant.</th>
              <th className="text-right px-3 py-3 font-semibold text-[#1a0a12]">Precio U.</th>
              <th className="text-right px-5 py-3 font-semibold text-[#1a0a12]">Total</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No hay ventas registradas</td></tr>
            )}
            {ventas.map((v, i) => (
              <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fdf6f9]'}>
                <td className="px-5 py-3 font-medium text-gray-800">{v.nombre}</td>
                <td className="px-3 py-3 text-center text-gray-600">{v.cantidad}</td>
                <td className="px-3 py-3 text-right text-gray-600">{fmt(v.precio)}</td>
                <td className="px-5 py-3 text-right font-bold text-[#1a0a12]">{fmt(v.total)}</td>
                <td className="px-3 py-3 text-center">
                  {confirmDel === v.id ? (
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => { eliminar(v.id); setConfirmDel(null); }}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg">Sí</button>
                      <button onClick={() => setConfirmDel(null)}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDel(v.id)} className="text-gray-300 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <NuevaVentaForm onClose={() => setShowForm(false)} registrar={registrar} />}
    </div>
  );
}
