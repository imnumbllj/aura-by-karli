import { useState, useMemo } from 'react';
import { useCompras, useProductos } from '../store/useStore';
import { Plus, Trash2, Search, ChevronDown, ShoppingCart, Edit2, Sparkles } from 'lucide-react';
import { PageHeader, Btn, Modal, ModalFooter, Label, Input, Select, Badge, t } from '../components/UI';

// ── Constants ──────────────────────────────────────────────────────────────────

export const CATEGORIAS = [
  'Peluche & Juguete',
  'Bebida & Licor',
  'Cosmético & Fragancia',
  'Comestible',
  'Decoración',
  'Empaque',
  'Otros',
];

export const UNIDADES = ['Unidad', 'Metro', 'Paquete', 'Rollo'];

const UNIDAD_ABBR = { Unidad: 'u.', Metro: 'm', Paquete: 'paq.', Rollo: 'rollo' };

const CAT_COLOR = {
  'Peluche & Juguete':     'violet',
  'Bebida & Licor':        'amber',
  'Cosmético & Fragancia': 'rose',
  'Comestible':            'teal',
  'Decoración':            'blue',
  'Empaque':               'gray',
  'Otros':                 'gray',
  // legacy fallbacks
  'Producto Principal': 'violet',
  'Complemento':        'blue',
  'Servicio':           'amber',
};

function costoUnitario(cantidad, costoTotal, unidad) {
  const qty  = Number(cantidad);
  const cost = Number(costoTotal);
  if (!qty || !cost) return null;
  const val  = (cost / qty).toLocaleString('es-DO', { maximumFractionDigits: 2 });
  return `$${val} / ${UNIDAD_ABBR[unidad] || unidad}`;
}

// ── Product autocomplete combobox ──────────────────────────────────────────────

function ProductoCombobox({ value, onTyping, onSelect, onRequestAdd, productos }) {
  const [open, setOpen] = useState(false);

  const matches = value.trim().length > 0
    ? productos.filter(p => p.activo && p.nombreCompleto.toLowerCase().includes(value.toLowerCase())).slice(0, 7)
    : productos.filter(p => p.activo).slice(0, 6);

  const exactMatch = productos.some(p => p.nombreCompleto.toLowerCase() === value.toLowerCase());
  const showAdd    = value.trim().length > 1 && !exactMatch;

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={e => { onTyping(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        placeholder="Buscar o escribir producto..."
        style={{
          width: '100%', height: 34, padding: '0 12px',
          background: t.surface2, color: t.text1,
          border: `1px solid ${t.border2}`, borderRadius: 8,
          fontSize: 13, outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocusCapture={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentDim}`; }}
        onBlurCapture={e => { e.target.style.borderColor = t.border2; e.target.style.boxShadow = 'none'; }}
      />
      {open && (matches.length > 0 || showAdd) && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 500,
          background: '#1C1C1F', border: `1px solid ${t.border2}`,
          borderRadius: 9, boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          {matches.map(p => (
            <button key={p.id} type="button"
              onMouseDown={() => { onSelect(p.nombreCompleto, p); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '9px 13px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <span style={{ fontSize: 13, color: t.text1 }}>{p.nombreCompleto}</span>
              <Badge color={CAT_COLOR[p.categoria] || 'gray'}>{p.categoria}</Badge>
            </button>
          ))}
          {showAdd && (
            <button type="button"
              onMouseDown={() => { onRequestAdd(value); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 13px', background: 'none', border: 'none',
                borderTop: matches.length > 0 ? `1px solid ${t.border}` : 'none',
                cursor: 'pointer', fontFamily: 'inherit', color: t.accent, fontSize: 13,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,25,75,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Plus size={12} />
              Agregar <strong>"{value}"</strong> al catálogo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Form (new + edit) ─────────────────────────────────────────────────────────

const EMPTY_ITEM = () => ({
  producto: '', categoria: CATEGORIAS[0], unidad: 'Unidad',
  cantidad: '', costoTotal: '', esNuevo: false,
});

function CompraForm({ onClose, productos, onRegistrar, onEditar, orderEdit }) {
  const hoy    = new Date().toISOString().split('T')[0];
  const isEdit = !!orderEdit;

  const [fecha, setFecha] = useState(orderEdit?.fecha || hoy);
  const [items, setItems] = useState(() =>
    orderEdit
      ? orderEdit.items.map(it => ({
          producto:  it.Producto,
          categoria: it.Categoria || CATEGORIAS[0],
          unidad:    it.Unidad    || 'Unidad',
          cantidad:  String(it.Cantidad),
          costoTotal: String(it['Costo T']),
          esNuevo: false,
        }))
      : [EMPTY_ITEM()]
  );

  const addItem    = () => setItems(p => [...p, EMPTY_ITEM()]);
  const removeItem = (i) => setItems(p => p.filter((_, x) => x !== i));

  const updateProducto = (i, nombre, productData) => {
    setItems(p => p.map((it, x) => {
      if (x !== i) return it;
      if (productData) {
        return { ...it, producto: nombre, categoria: productData.categoria || it.categoria, unidad: productData.unidad || it.unidad, esNuevo: false };
      }
      return { ...it, producto: nombre, esNuevo: false };
    }));
  };

  const markNuevo = (i, nombre) => {
    setItems(p => p.map((it, x) => x === i ? { ...it, producto: nombre, esNuevo: true } : it));
  };

  const update = (i, field, value) => {
    setItems(p => p.map((it, x) => x === i ? { ...it, [field]: value } : it));
  };

  const subtotal   = items.reduce((s, it) => s + (Number(it.costoTotal) || 0), 0);
  const fmt        = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;
  const prodsSorted = [...productos].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
  const nuevosCount = items.filter(it => it.esNuevo && it.producto.trim()).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = items.filter(it => it.producto.trim() && it.cantidad && it.costoTotal);
    if (!valid.length) return;
    const enriched = valid.map(it => ({
      producto:   it.producto.trim(),
      categoria:  it.categoria,
      unidad:     it.unidad,
      cantidad:   Number(it.cantidad),
      costoTotal: Number(it.costoTotal),
      esNuevo:    it.esNuevo,
    }));
    if (isEdit) onEditar(orderEdit.id, enriched, fecha);
    else        onRegistrar(enriched, fecha);
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      title={isEdit ? `Editando ${orderEdit.id}` : 'Nueva Compra'}
      subtitle={isEdit ? `Orden del ${orderEdit.fecha}` : 'Registra los productos adquiridos'}
      icon={ShoppingCart}
      maxWidth={700}
    >
      <form onSubmit={handleSubmit}>

        {/* Date */}
        <div style={{ marginBottom: 20 }}>
          <Label>Fecha de compra</Label>
          <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: 180 }} />
        </div>

        {/* Column headers for item details row */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 90px 65px 115px 1fr', gap: 8, paddingLeft: 2, marginBottom: 6 }}>
          {['Categoría', 'Unidad', 'Cant.', 'Costo total', ''].map(h => (
            <p key={h} style={{ fontSize: 10, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</p>
          ))}
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.025)', borderRadius: 9,
              padding: '11px 12px 10px', border: `1px solid ${it.esNuevo ? 'rgba(232,25,75,0.25)' : t.border}`,
              display: 'flex', flexDirection: 'column', gap: 8,
              transition: 'border-color 0.15s',
            }}>
              {/* Row 1: product combobox + delete */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <ProductoCombobox
                    value={it.producto}
                    onTyping={v => updateProducto(i, v, null)}
                    onSelect={(nombre, p) => updateProducto(i, nombre, p)}
                    onRequestAdd={nombre => markNuevo(i, nombre)}
                    productos={prodsSorted}
                  />
                  {it.esNuevo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                      <Sparkles size={10} style={{ color: t.accent }} />
                      <p style={{ fontSize: 10, color: t.accent, opacity: 0.9 }}>
                        Nuevo producto — se agregará al catálogo al registrar
                      </p>
                    </div>
                  )}
                </div>
                <button type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  style={{
                    width: 32, height: 34, borderRadius: 8, border: `1px solid ${t.border}`,
                    background: 'transparent', cursor: items.length > 1 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.text3, opacity: items.length > 1 ? 1 : 0.25, flexShrink: 0,
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { if (items.length > 1) { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.text3; e.currentTarget.style.borderColor = t.border; }}>
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Row 2: category, unit, qty, total, unit cost */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 90px 65px 115px 1fr', gap: 8, alignItems: 'center' }}>
                <Select value={it.categoria} onChange={e => update(i, 'categoria', e.target.value)}>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </Select>
                <Select value={it.unidad} onChange={e => update(i, 'unidad', e.target.value)}>
                  {UNIDADES.map(u => <option key={u}>{u}</option>)}
                </Select>
                <Input
                  type="number" min="0.01" step="any" placeholder="0"
                  value={it.cantidad}
                  onChange={e => update(i, 'cantidad', e.target.value)}
                  style={{ textAlign: 'right' }}
                />
                <Input
                  type="number" min="0" placeholder="$0"
                  value={it.costoTotal}
                  onChange={e => update(i, 'costoTotal', e.target.value)}
                  style={{ textAlign: 'right' }}
                />
                <div style={{ paddingLeft: 4 }}>
                  {costoUnitario(it.cantidad, it.costoTotal, it.unidad) && (
                    <span style={{
                      fontSize: 11, color: t.text3, fontWeight: 500,
                      background: 'rgba(255,255,255,0.04)', padding: '3px 8px',
                      borderRadius: 6, whiteSpace: 'nowrap',
                    }}>
                      → {costoUnitario(it.cantidad, it.costoTotal, it.unidad)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
            fontWeight: 500, color: t.accent, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginBottom: 4,
          }}>
          <Plus size={13} /> Agregar otro producto
        </button>

        <ModalFooter>
          <div style={{ marginRight: 'auto' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.text1, letterSpacing: '-0.4px' }}>{fmt(subtotal)}</p>
          </div>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" variant="primary">
            {isEdit
              ? 'Guardar cambios'
              : nuevosCount > 0
                ? `Registrar + agregar ${nuevosCount} al catálogo`
                : 'Registrar compra'}
          </Btn>
        </ModalFooter>
      </form>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Compras() {
  const { compras, registrar, eliminar, editar } = useCompras();
  const { productos, agregarBatch }              = useProductos();

  const [search,     setSearch]     = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editOrder,  setEditOrder]  = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    return compras
      .filter(c => !q || c.Producto?.toLowerCase().includes(q) || c.ID?.toLowerCase().includes(q))
      .reduce((acc, c) => {
        if (!acc[c.ID]) acc[c.ID] = { id: c.ID, fecha: c.Fecha, items: [], total: 0 };
        acc[c.ID].items.push(c);
        acc[c.ID].total += c['Costo T'] || 0;
        return acc;
      }, {});
  }, [compras, search]);

  const groups       = Object.values(grouped).sort((a, b) => b.fecha > a.fecha ? 1 : -1).slice(0, 50);
  const totalInv     = compras.reduce((s, c) => s + (c['Costo T'] || 0), 0);
  const totalOrdenes = useMemo(() => {
    return [...new Set(compras.map(c => c.ID))].length;
  }, [compras]);

  // Builds product catalog entries for newly-typed products before saving
  const buildNuevos = (items) => {
    const nuevos = items.filter(it => it.esNuevo && it.producto.trim());
    if (!nuevos.length) return;
    let maxId = Math.max(0, ...productos.map(p => parseInt(p.id.slice(1)) || 0));
    const batch = nuevos.map(it => {
      maxId++;
      return {
        id:            `P${String(maxId).padStart(3, '0')}`,
        nombre:        it.producto.trim(),
        variante:      '',
        nombreCompleto: it.producto.trim(),
        categoria:     it.categoria,
        tipo:          'Directo',
        unidad:        it.unidad,
        activo:        true,
      };
    });
    agregarBatch(batch);
  };

  const handleRegistrar = (items, fecha) => {
    buildNuevos(items);
    registrar(items, fecha);
  };

  const handleEditar = (orderId, items, fecha) => {
    buildNuevos(items);
    editar(orderId, items, fecha);
  };

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
          placeholder="Buscar por producto o ID de orden..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Order list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {groups.length === 0 && (
          <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '48px 0', textAlign: 'center', color: t.text3, fontSize: 13 }}>
            No se encontraron compras
          </div>
        )}

        {groups.map(g => (
          <div key={g.id} style={{
            background: t.surface, borderRadius: 12,
            border: `1px solid ${confirmDel === g.id ? 'rgba(239,68,68,0.35)' : t.border}`,
            overflow: 'hidden', transition: 'border-color 0.15s',
          }}>

            {/* Delete confirmation banner */}
            {confirmDel === g.id ? (
              <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239,68,68,0.07)' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#F87171' }}>¿Eliminar orden {g.id}?</p>
                  <p style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>
                    Se revertirá el inventario de {g.items.length} producto{g.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => setConfirmDel(null)}>Cancelar</Btn>
                  <Btn size="sm" variant="danger" onClick={() => { eliminar(g.id); setConfirmDel(null); }}>
                    Sí, eliminar
                  </Btn>
                </div>
              </div>
            ) : (
              /* Normal header row */
              <div style={{ display: 'flex', alignItems: 'center', padding: '11px 14px', gap: 10 }}>
                {/* Expand toggle — takes most of the row */}
                <button type="button"
                  onClick={() => setExpandedId(expandedId === g.id ? null : g.id)}
                  style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', background: t.accentDim, color: t.accent, padding: '3px 8px', borderRadius: 6, flexShrink: 0, letterSpacing: '0.02em' }}>
                    {g.id}
                  </span>
                  <span style={{ fontSize: 12, color: t.text3, flexShrink: 0 }}>{g.fecha}</span>
                  <span style={{ fontSize: 12, color: t.text3 }}>{g.items.length} ítem{g.items.length !== 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text1, marginLeft: 'auto', flexShrink: 0 }}>{fmt(g.total)}</span>
                  <ChevronDown size={13} style={{ color: t.text3, transform: expandedId === g.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button type="button"
                    onClick={() => { setEditOrder(g); }}
                    title="Editar orden"
                    style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3, transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = t.text1; e.currentTarget.style.borderColor = t.border2; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.text3; e.currentTarget.style.borderColor = t.border; }}>
                    <Edit2 size={12} />
                  </button>
                  <button type="button"
                    onClick={() => setConfirmDel(g.id)}
                    title="Eliminar orden"
                    style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3, transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.text3; e.currentTarget.style.borderColor = t.border; }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Expanded items table */}
            {expandedId === g.id && confirmDel !== g.id && (
              <div style={{ borderTop: `1px solid ${t.border}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${t.border}` }}>
                      {[['Producto','left'],['Categoría','left'],['Unidad','center'],['Cant.','center'],['C/u','right'],['Total','right']].map(([h, a]) => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: a, fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((item, i) => (
                      <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${t.border}` : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 14px', color: t.text2, fontWeight: 500 }}>{item.Producto}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <Badge color={CAT_COLOR[item.Categoria] || 'gray'}>{item.Categoria}</Badge>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, color: t.text3 }}>{item.Unidad || '—'}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: t.text3 }}>{item.Cantidad}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: t.text3 }}>{fmt(item['Costo U'])}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: t.text1 }}>{fmt(item['Costo T'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: t.text3, textAlign: 'right', marginTop: 10 }}>
        Mostrando {groups.length} de {totalOrdenes} órdenes
      </p>

      {/* Form modal */}
      {(showForm || editOrder) && (
        <CompraForm
          onClose={() => { setShowForm(false); setEditOrder(null); }}
          productos={productos}
          onRegistrar={handleRegistrar}
          onEditar={handleEditar}
          orderEdit={editOrder}
        />
      )}
    </div>
  );
}
