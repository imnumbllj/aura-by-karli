import { useState, useMemo } from 'react';
import { useProductos, useInventario } from '../store/useStore';
import { Plus, Trash2, Gift, Sparkles } from 'lucide-react';

export default function CreadorRegalos() {
  const { productos } = useProductos();
  const { inventario } = useInventario();

  const [nombreRegalo, setNombreRegalo] = useState('');
  const [ganancia, setGanancia] = useState(35);
  const [manoDeObra, setManoDeObra] = useState(500);
  const [items, setItems] = useState([{ producto: '', cantidad: 1 }]);

  const addItem = () => setItems(p => [...p, { producto: '', cantidad: 1 }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(p => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const calculos = useMemo(() => {
    let costoMateriales = 0;
    const detalle = items.map(it => {
      if (!it.producto || !it.cantidad) return { ...it, costoU: 0, costoT: 0 };
      const inv = inventario[it.producto];
      const costoU = inv?.costoPromedio || 0;
      const costoT = costoU * Number(it.cantidad);
      costoMateriales += costoT;
      return { ...it, costoU, costoT };
    });
    const costoTotal = costoMateriales + Number(manoDeObra);
    const precioVenta = costoTotal / (1 - Number(ganancia) / 100);
    const gananciaAbsoluta = precioVenta - costoTotal;
    return { detalle, costoMateriales, costoTotal, precioVenta, gananciaAbsoluta };
  }, [items, inventario, ganancia, manoDeObra]);

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const productosActivos = productos.filter(p => p.activo).sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2185b] mb-1">Calculadora de precios</p>
        <h1 className="text-3xl font-bold text-[#1a0a12]">Creador de Regalos</h1>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Config card */}
        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #f0e6eb' }}>
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Configuración del regalo</h2>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre del regalo</label>
            <input type="text" value={nombreRegalo} onChange={e => setNombreRegalo(e.target.value)}
              placeholder="Ej: Aura Pink, Rey de Corazones..."
              className="w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
              style={{ border: '1px solid #e8d8e0' }} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                % Ganancia — <span className="text-[#c2185b] font-bold">{ganancia}%</span>
              </label>
              <input type="range" min="10" max="70" step="5" value={ganancia}
                onChange={e => setGanancia(e.target.value)}
                className="w-full accent-[#c2185b] mt-1" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>10%</span><span>70%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mano de obra ($)</label>
              <input type="number" min="0" value={manoDeObra} onChange={e => setManoDeObra(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                style={{ border: '1px solid #e8d8e0' }} />
            </div>
          </div>
        </div>

        {/* Productos card */}
        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #f0e6eb' }}>
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Productos del regalo</h2>

          <div className="grid grid-cols-[1fr_72px_90px_82px_36px] gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            <span>Producto</span><span>Cant.</span><span>Costo U.</span><span>Costo T.</span><span></span>
          </div>

          <div className="space-y-2.5">
            {calculos.detalle.map((it, i) => (
              <div key={i} className="grid grid-cols-[1fr_72px_90px_82px_36px] gap-2 items-center">
                <select value={it.producto} onChange={e => updateItem(i, 'producto', e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                  style={{ border: '1px solid #e8d8e0' }}>
                  <option value="">Seleccionar...</option>
                  {productosActivos.map(p => <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>)}
                </select>
                <input type="number" min="1" value={it.cantidad} onChange={e => updateItem(i, 'cantidad', e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#c2185b]/20"
                  style={{ border: '1px solid #e8d8e0' }} />
                <div className="rounded-xl px-3 py-2.5 text-sm text-right text-gray-500" style={{ background: '#f9f5f7' }}>
                  {it.costoU > 0 ? fmt(it.costoU) : '—'}
                </div>
                <div className="rounded-xl px-3 py-2.5 text-sm text-right font-semibold text-gray-700" style={{ background: '#f9f5f7' }}>
                  {it.costoT > 0 ? fmt(it.costoT) : '—'}
                </div>
                <button type="button" onClick={() => removeItem(i)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addItem}
            className="flex items-center gap-1.5 text-sm font-medium text-[#c2185b] hover:text-[#ad1457] mt-4 transition-colors">
            <Plus size={14} /> Agregar producto
          </button>
        </div>

        {/* Result card */}
        <div className="rounded-2xl p-6 text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #c2185b 0%, #7b0d3e 100%)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Gift size={16} />
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">Resultado</p>
              <p className="font-bold text-base leading-tight">{nombreRegalo || 'Sin nombre'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Materiales',    value: fmt(calculos.costoMateriales) },
              { label: 'Mano de obra',  value: fmt(manoDeObra) },
              { label: 'Costo total',   value: fmt(calculos.costoTotal) },
              { label: `Ganancia (${ganancia}%)`, value: fmt(calculos.gananciaAbsoluta) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <p className="text-[10px] text-white/60 uppercase tracking-wide mb-1 font-semibold">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-2">Precio de venta sugerido</p>
            <p className="text-5xl font-black tracking-tight">{fmt(calculos.precioVenta)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
