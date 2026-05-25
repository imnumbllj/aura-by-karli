import { useState, useMemo } from 'react';
import { useProductos, useInventario } from '../store/useStore';
import { Plus, Trash2, Gift } from 'lucide-react';

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a0a12]">Creador de Regalos</h2>
        <p className="text-sm text-gray-500 mt-0.5">Calcula el precio de venta basado en costos reales del inventario</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#fce4ec] shadow-sm p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nombre del regalo</label>
          <input
            type="text"
            value={nombreRegalo}
            onChange={e => setNombreRegalo(e.target.value)}
            placeholder="Ej: Aura Pink, Rey de Corazones..."
            className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]"
          />
        </div>

        {/* Parámetros */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">% Ganancia</label>
            <div className="flex items-center gap-2">
              <input type="range" min="10" max="70" step="5" value={ganancia}
                onChange={e => setGanancia(e.target.value)}
                className="flex-1 accent-[#c2185b]" />
              <span className="text-sm font-bold text-[#c2185b] w-10 text-right">{ganancia}%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Mano de obra ($)</label>
            <input type="number" min="0" value={manoDeObra} onChange={e => setManoDeObra(e.target.value)}
              className="w-full border border-[#fce4ec] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c2185b]" />
          </div>
        </div>

        {/* Productos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Productos del regalo</label>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_70px_100px_80px_32px] gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
              <span>Producto</span><span>Cant.</span><span>Costo U.</span><span>Costo T.</span><span></span>
            </div>
            {calculos.detalle.map((it, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_100px_80px_32px] gap-2 items-center">
                <select
                  value={it.producto}
                  onChange={e => updateItem(i, 'producto', e.target.value)}
                  className="border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {productosActivos.map(p => (
                    <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>
                  ))}
                </select>
                <input type="number" min="1" value={it.cantidad}
                  onChange={e => updateItem(i, 'cantidad', e.target.value)}
                  className="border border-[#fce4ec] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c2185b] text-right" />
                <div className="text-sm text-gray-500 text-right bg-gray-50 rounded-xl px-3 py-2.5">{fmt(it.costoU)}</div>
                <div className="text-sm font-medium text-gray-800 text-right bg-gray-50 rounded-xl px-3 py-2.5">{fmt(it.costoT)}</div>
                <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 flex items-center justify-center">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addItem}
            className="flex items-center gap-2 text-sm text-[#c2185b] hover:text-[#ad1457] font-medium mt-3">
            <Plus size={15} /> Agregar producto
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-br from-[#c2185b] to-[#880e4f] rounded-2xl shadow-lg p-6 mt-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={18} />
          <h3 className="font-bold text-lg">{nombreRegalo || 'Mi Regalo'}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Costo materiales</p>
            <p className="text-xl font-bold">{fmt(calculos.costoMateriales)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">+ Mano de obra</p>
            <p className="text-xl font-bold">{fmt(manoDeObra)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Costo total</p>
            <p className="text-xl font-bold">{fmt(calculos.costoTotal)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Ganancia ({ganancia}%)</p>
            <p className="text-xl font-bold">{fmt(calculos.gananciaAbsoluta)}</p>
          </div>
        </div>
        <div className="bg-white/15 rounded-xl p-4 text-center border border-white/20">
          <p className="text-sm text-white/80 mb-1">Precio de venta sugerido</p>
          <p className="text-4xl font-extrabold tracking-tight">{fmt(calculos.precioVenta)}</p>
        </div>
      </div>
    </div>
  );
}
