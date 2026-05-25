import { useState } from 'react';
import { useCompras, useProductos } from '../store/useStore';
import { Plus, Trash2, Search, ChevronDown, ShoppingCart } from 'lucide-react';
import { PageHeader, Btn, Modal, ModalFooter, Label, Input, Select, t } from '../components/UI';

function NuevaCompraForm({ onClose, productos, registrar }) {
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha,  setFecha]  = useState(hoy);
  const [items,  setItems]  = useState([{ producto: '', cantidad: '', costoTotal: '' }]);

  const addItem    = () => setItems(p => [...p, { producto: '', cantidad: '', costoTotal: '' }]);
  const removeItem = (i) => setItems(p => p.filter((_, x) => x !== i));
  const update     = (i, f, v) => setItems(p => p.map((it, x) => x === i ? { ...it, [f]: v } : it));

  const subtotal = items.reduce((s, it) => s + (Number(it.costoTotal) || 0), 0);
  const fmt      = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

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

  const prods = productos.filter(p => p.activo).sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <Modal onClose={onClose} title="Nueva Compra" subtitle="Registra los productos adquiridos" icon={ShoppingCart}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <Label>Fecha de compra</Label>
          <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: 180 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 100px 32px', gap: 8, marginBottom: 8 }}>
          {['Producto', 'Cant.', 'Costo total', ''].map(h => (
            <p key={h} style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</p>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 100px 32px', gap: 8, alignItems: 'center' }}>
              <Select value={it.producto} onChange={e => update(i, 'producto', e.target.value)}>
                <option value="">Seleccionar...</option>
                {prods.map(p => <option key={p.id} value={p.nombreCompleto}>{p.nombreCompleto}</option>)}
              </Select>
              <Input type="number" min="0" placeholder="0" value={it.cantidad} onChange={e => update(i, 'cantidad', e.target.value)} style={{ textAlign: 'right' }} />
              <Input type="number" min="0" placeholder="0" value={it.costoTotal} onChange={e => update(i, 'costoTotal', e.target.value)} style={{ textAlign: 'right' }} />
              <button type="button" onClick={() => removeItem(i)}
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.text3; }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: t.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
          <Plus size={13} /> Agregar producto
        </button>

        <ModalFooter>
          <div style={{ marginRight: 'auto', textAlign: 'left' }}>
            <p style={{ fontSize: 11, color: t.text3, fontWeight: 500 }}>Total</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: t.text1, letterSpacing: '-0.3px' }}>{fmt(subtotal)}</p>
          </div>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" variant="primary">Registrar compra</Btn>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default function Compras() {
  const { compras, registrar } = useCompras();
  const { productos }          = useProductos();
  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);
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

  const groups       = Object.values(grouped).sort((a, b) => b.fecha > a.fecha ? 1 : -1).slice(0, 50);
  const totalInv     = compras.reduce((s, c) => s + (c['Costo T'] || 0), 0);
  const totalOrdenes = Object.keys(grouped).length;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <PageHeader eyebrow="Registro de compras" title="Compras" />
        <Btn onClick={() => setShowForm(true)} style={{ marginTop: 2 }}>
          <Plus size={13} /> Nueva Compra
        </Btn>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total invertido',   value: fmt(totalInv) },
          { label: 'Órdenes de compra', value: totalOrdenes  },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '16px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: t.text1, letterSpacing: '-0.4px' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: t.text3 }} />
        <input
          style={{ width: '100%', height: 34, borderRadius: 8, paddingLeft: 32, paddingRight: 12, border: `1px solid ${t.border}`, background: t.surface, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: t.text1 }}
          placeholder="Buscar por producto o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {groups.length === 0 && (
          <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '48px 0', textAlign: 'center', color: t.text3, fontSize: 13 }}>
            No se encontraron compras
          </div>
        )}
        {groups.map(g => (
          <div key={g.id} style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
            <button
              onClick={() => setExpandedId(expandedId === g.id ? null : g.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', background: t.accentDim, color: t.accent, padding: '3px 8px', borderRadius: 6 }}>
                  {g.id}
                </span>
                <span style={{ fontSize: 12, color: t.text3 }}>{g.fecha}</span>
                <span style={{ fontSize: 12, color: t.text3 }}>{g.items.length} producto{g.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text1 }}>{fmt(g.total)}</span>
                <ChevronDown size={14} style={{ color: t.text3, transform: expandedId === g.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </button>

            {expandedId === g.id && (
              <div style={{ borderTop: `1px solid ${t.border}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${t.border}` }}>
                      {[['Producto', 'left'], ['Cant.', 'center'], ['C. Unitario', 'right'], ['C. Total', 'right']].map(([h, a]) => (
                        <th key={h} style={{ padding: '9px 16px', textAlign: a, fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((item, i) => (
                      <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${t.border}` : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 16px', color: t.text2 }}>{item.Producto}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center', color: t.text3 }}>{item.Cantidad}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: t.text3 }}>{fmt(item['Costo U'])}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: t.text1 }}>{fmt(item['Costo T'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: t.text3, textAlign: 'right', marginTop: 10 }}>Últimas 50 órdenes</p>

      {showForm && <NuevaCompraForm onClose={() => setShowForm(false)} productos={productos} registrar={registrar} />}
    </div>
  );
}
