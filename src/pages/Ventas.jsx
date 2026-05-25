import { useState } from 'react';
import { useVentas } from '../store/useStore';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

function NuevaVentaForm({ onClose, registrar }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState('');

  const total = Number(cantidad) * Number(precio);
  const fmt = (n) => n ? `$${Number(n).toLocaleString('es-DO')}` : '$0';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;
    const hoy = new Date().toISOString().split('T')[0];
    registrar({ nombre, cantidad: Number(cantidad), precio: Number(precio), total, fecha: hoy });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(26,10,18,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #fce4ec' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fce4ec' }}>
              <TrendingUp size={16} className="text-[#c2185b]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a0a12]">Registrar Venta</h3>
              <p className="text-xs text-gray-400">Nuevo ingreso al registro</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-lg">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre del regalo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Aura Pink" required
              className="w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
              style={{ border: '1px solid #e8d8e0' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cantidad</label>
              <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                style={{ border: '1px solid #e8d8e0' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Precio unitario</label>
              <input type="number" min="0" value={precio} onChange={e => setPrecio(e.target.value)}
                placeholder="0" required
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                style={{ border: '1px solid #e8d8e0' }} />
            </div>
          </div>

          <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #fce4ec, #fdf6f9)', border: '1px solid #f8bbd9' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total de la venta</p>
            <p className="text-3xl font-black text-[#c2185b]">{fmt(total)}</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ border: '1px solid #e5e7eb' }}>
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-[#ad1457] transition-colors"
              style={{ background: '#c2185b' }}>
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
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Registro de ventas</p>
          <h1 className="text-3xl font-bold text-[#1a0a12]">Ventas</h1>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#ad1457] transition-colors mt-1"
          style={{ background: '#c2185b' }}>
          <Plus size={15} /> Nueva Venta
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #fce4ec, #fdf6f9)', border: '1px solid #f8bbd9' }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total ingresos</p>
          <p className="text-3xl font-black text-[#c2185b]">{fmt(totalGeneral)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #f0e6eb' }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ventas registradas</p>
          <p className="text-3xl font-black text-[#1a0a12]">{ventas.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #f0e6eb' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fdf6f9', borderBottom: '2px solid #fce4ec' }}>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Regalo</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Cant.</th>
              <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Precio U.</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
              <th className="w-12 px-3 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-gray-400">No hay ventas registradas aún</td>
              </tr>
            )}
            {ventas.map((v, i) => (
              <tr key={v.id} className="hover:bg-[#fdf6f9] transition-colors"
                style={{ borderBottom: i < ventas.length - 1 ? '1px solid #fce4ec' : 'none' }}>
                <td className="px-5 py-3.5 font-medium text-gray-800">{v.nombre}</td>
                <td className="px-4 py-3.5 text-center text-gray-500">{v.cantidad}</td>
                <td className="px-4 py-3.5 text-right text-gray-500">{fmt(v.precio)}</td>
                <td className="px-5 py-3.5 text-right font-bold text-[#1a0a12]">{fmt(v.total)}</td>
                <td className="px-3 py-3.5 text-center">
                  {confirmDel === v.id ? (
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => { eliminar(v.id); setConfirmDel(null); }}
                        className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg font-semibold">Sí</button>
                      <button onClick={() => setConfirmDel(null)}
                        className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-semibold">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDel(v.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors mx-auto">
                      <Trash2 size={13} />
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
