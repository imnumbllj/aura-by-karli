import { useState, useMemo } from 'react';
import { useProductos, useInventario } from '../store/useStore';
import { Plus, Trash2, Gift } from 'lucide-react';
import { PageHeader, Label, Input, Select, Btn, t } from '../components/UI';

export default function CreadorRegalos() {
  const { productos } = useProductos();
  const { inventario } = useInventario();

  const [nombre,      setNombre]      = useState('');
  const [ganancia,    setGanancia]    = useState(35);
  const [manoDeObra,  setManoDeObra]  = useState(500);
  const [items,       setItems]       = useState([{ producto: '', cantidad: 1 }]);

  const addItem    = () => setItems(p => [...p, { producto: '', cantidad: 1 }]);
  const removeItem = (i) => setItems(p => p.filter((_, x) => x !== i));
  const update     = (i, f, v) => setItems(p => p.map((it, x) => x === i ? { ...it, [f]: v } : it));

  const calc = useMemo(() => {
    let materiales = 0;
    const detalle = items.map(it => {
      if (!it.producto || !it.cantidad) return { ...it, costoU: 0, costoT: 0 };
      const costoU = inventario[it.producto]?.costoPromedio || 0;
      const costoT = costoU * Number(it.cantidad);
      materiales += costoT;
      return { ...it, costoU, costoT };
    });
    const costoTotal  = materiales + Number(manoDeObra);
    const precioVenta = costoTotal / (1 - Number(ganancia) / 100);
    return { detalle, materiales, costoTotal, precioVenta, gananciaAbs: precioVenta - costoTotal };
  }, [items, inventario, ganancia, manoDeObra]);

  const fmt  = (n) => `$${Number(n || 0).toLocaleString('es-DO', { maximumFractionDigits: 0 })}`;
  const prods = productos.filter(p => p.activo).sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader eyebrow="Calculadora de precios" title="Creador de Regalos" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Config */}
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: t.text2, marginBottom: 16, letterSpacing: '-0.1px' }}>Configuración</p>

          <div style={{ marginBottom: 16 }}>
            <Label>Nombre del regalo</Label>
            <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Aura Pink, Rey de Corazones..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <Label>% Ganancia — <span style={{ color: t.accent, fontWeight: 700 }}>{ganancia}%</span></Label>
              <input type="range" min="10" max="70" step="5" value={ganancia}
                onChange={e => setGanancia(e.target.value)}
                style={{ width: '100%', cursor: 'pointer', marginTop: 6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ fontSize: 10, color: t.text3 }}>10%</span>
                <span style={{ fontSize: 10, color: t.text3 }}>70%</span>
              </div>
            </div>
            <div>
              <Label>Mano de obra ($)</Label>
              <Input type="number" min="0" value={manoDeObra} onChange={e => setManoDeObra(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: t.text2, marginBottom: 16 }}>Productos</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 68px 90px 80px 32px', gap: 8, marginBottom: 10 }}>
            {['Producto', 'Cant.', 'Costo U.', 'Costo T.', ''].map(h => (
              <p key={h} style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {calc.detalle.map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 68px 90px 80px 32px', gap: 8, alignItems: 'center' }}>
                <Select value={it.producto} onChange={e => update(i, 'producto', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {prods.map(p => <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>)}
                </Select>
                <Input type="number" min="1" value={it.cantidad} onChange={e => update(i, 'cantidad', e.target.value)} style={{ textAlign: 'right' }} />
                <div style={{ height: 34, borderRadius: 8, background: t.surface2, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12, fontSize: 13, color: t.text3 }}>
                  {it.costoU > 0 ? fmt(it.costoU) : '—'}
                </div>
                <div style={{ height: 34, borderRadius: 8, background: t.surface2, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12, fontSize: 13, fontWeight: 600, color: t.text1 }}>
                  {it.costoT > 0 ? fmt(it.costoT) : '—'}
                </div>
                <button type="button" onClick={() => removeItem(i)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3, fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.text3; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 13, fontWeight: 500, color: t.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
            <Plus size={13} /> Agregar producto
          </button>
        </div>

        {/* Result */}
        <div style={{ background: '#111114', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: t.accentDim, border: `1px solid ${t.accentMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={14} style={{ color: t.accent }} />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resultado</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.text1, letterSpacing: '-0.2px' }}>{nombre || 'Sin nombre'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Materiales',           value: fmt(calc.materiales) },
              { label: 'Mano de obra',          value: fmt(manoDeObra) },
              { label: 'Costo total',           value: fmt(calc.costoTotal) },
              { label: `Ganancia ${ganancia}%`, value: fmt(calc.gananciaAbs) },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: t.text1 }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{ background: t.accentDim, borderRadius: 10, padding: '18px 20px', textAlign: 'center', border: `1px solid ${t.accentMid}` }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Precio de venta sugerido</p>
            <p style={{ fontSize: 40, fontWeight: 800, color: t.text1, letterSpacing: '-1.5px', lineHeight: 1 }}>{fmt(calc.precioVenta)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
