import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductos } from '../store/useStore';
import { Plus, Search, Settings2, ChevronDown } from 'lucide-react';
import { PageHeader, Btn, Modal, ModalFooter, Label, Input, Select, Badge, t, fadeUp, stagger } from '../components/UI';
import { CATEGORIAS, UNIDADES } from './Compras';

const TIPOS = ['Directo', 'Indirecto', 'Servicio'];

const CAT_ORDER = [
  'Bebida & Licor',
  'Comestible',
  'Peluche & Juguete',
  'Cosmético & Fragancia',
  'Decoración',
  'Empaque',
  'Otros',
];

const CAT_COLOR = {
  'Peluche & Juguete':     'violet',
  'Bebida & Licor':        'amber',
  'Cosmético & Fragancia': 'rose',
  'Comestible':            'teal',
  'Decoración':            'blue',
  'Empaque':               'gray',
  'Otros':                 'gray',
};

const CAT_ACCENT = {
  'Bebida & Licor':        '#F59E0B',
  'Comestible':            '#14B8A6',
  'Peluche & Juguete':     '#8B5CF6',
  'Cosmético & Fragancia': '#FB7185',
  'Decoración':            '#3B82F6',
  'Empaque':               '#6B7280',
  'Otros':                 '#6B7280',
};

/* ─── Add/Edit product modal ─── */
function ProductoModal({ onClose, agregar, productos, prefillNombre, prefillCat }) {
  const nextId = `P${String(Math.max(0, ...productos.map(p => parseInt(p.id.slice(1)) || 0)) + 1).padStart(3, '0')}`;
  const [form, setForm] = useState({
    id:        nextId,
    nombre:    prefillNombre || '',
    variante:  '',
    categoria: prefillCat   || CATEGORIAS[0],
    tipo:      TIPOS[0],
    unidad:    UNIDADES[0],
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const nombreCompleto = form.variante ? `${form.nombre} - ${form.variante}` : form.nombre;

  return (
    <Modal onClose={onClose} title="Nuevo Producto" subtitle="Agregar al catálogo" icon={Settings2}>
      <form onSubmit={e => { e.preventDefault(); if (!form.nombre) return; agregar({ ...form, nombreCompleto, activo: true }); onClose(); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <Label>Nombre *</Label>
            <Input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej. Vino" required />
          </div>
          <div>
            <Label>Variante</Label>
            <Input value={form.variante} onChange={e => set('variante', e.target.value)} placeholder="Ej. Rosado" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          {[['categoria', 'Categoría', CATEGORIAS], ['tipo', 'Tipo', TIPOS], ['unidad', 'Unidad', UNIDADES]].map(([key, lbl, opts]) => (
            <div key={key}>
              <Label>{lbl}</Label>
              <Select value={form[key]} onChange={e => set(key, e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </Select>
            </div>
          ))}
        </div>
        {nombreCompleto && (
          <div style={{ background: t.surface2, borderRadius: 8, padding: '9px 12px', border: `1px solid ${t.border}`, marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: t.text3 }}>Nombre completo: </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>{nombreCompleto}</span>
          </div>
        )}
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" variant="primary">Agregar</Btn>
        </ModalFooter>
      </form>
    </Modal>
  );
}

/* ─── Variant pill ─── */
function VariantPill({ p, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onToggle(p.id)}
      title={p.activo ? 'Click para desactivar' : 'Click para activar'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
        background: p.activo ? 'rgba(232,25,75,0.1)'    : 'rgba(255,255,255,0.04)',
        color:      p.activo ? '#FB7185'                 : t.text3,
        borderWidth: 1, borderStyle: 'solid',
        borderColor: p.activo ? 'rgba(232,25,75,0.25)'  : 'rgba(255,255,255,0.07)',
        transition: 'all 0.14s',
        opacity: p.activo ? 1 : 0.55,
      }}
    >
      <span style={{
        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
        background: p.activo ? '#FB7185' : t.text3,
      }} />
      {p.variante || p.nombre}
    </motion.button>
  );
}

/* ─── Category section ─── */
function CategorySection({ categoria, grupos, toggleActivo, onAddVariant }) {
  const [open, setOpen] = useState(true);
  const accent  = CAT_ACCENT[categoria] || '#6B7280';
  const total   = grupos.reduce((s, g) => s + g.length, 0);
  const activos = grupos.reduce((s, g) => s + g.filter(p => p.activo).length, 0);

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Category header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 9,
          background: `${accent}10`, border: `1px solid ${accent}22`,
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: open ? 4 : 0,
          transition: 'all 0.14s',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 2, background: accent, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1, textAlign: 'left' }}>
          {categoria}
        </span>
        <span style={{ fontSize: 11, color: t.text3, fontWeight: 500 }}>{activos}/{total} activos</span>
        <ChevronDown size={13} style={{ color: t.text3, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: t.surface, borderRadius: 10,
              border: `1px solid ${t.border}`, overflow: 'hidden',
            }}>
              {grupos.map((grupo, gi) => {
                const base    = grupo[0];
                const esUnico = grupo.length === 1 && !base.variante;
                return (
                  <div
                    key={base.nombre}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 16px',
                      borderBottom: gi < grupos.length - 1 ? `1px solid ${t.border}` : 'none',
                    }}
                  >
                    {/* Name + variants */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: t.text1, marginBottom: esUnico ? 0 : 6 }}>
                        {base.nombre}
                        {esUnico && (
                          <span style={{ fontSize: 11, color: t.text3, fontWeight: 400, marginLeft: 6 }}>
                            {base.tipo} · {base.unidad}
                          </span>
                        )}
                      </p>
                      {!esUnico && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {grupo.map(p => <VariantPill key={p.id} p={p} onToggle={toggleActivo} />)}
                        </div>
                      )}
                    </div>

                    {/* Tipo + Unidad (only when not shown inline) */}
                    {!esUnico && (
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <p style={{ fontSize: 11, color: t.text3 }}>{base.tipo}</p>
                        <p style={{ fontSize: 11, color: t.text3 }}>{base.unidad}</p>
                      </div>
                    )}

                    {/* Single-item toggle */}
                    {esUnico && (
                      <button
                        onClick={() => toggleActivo(base.id)}
                        style={{
                          padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                          background: base.activo ? 'rgba(232,25,75,0.1)' : 'rgba(255,255,255,0.04)',
                          color:      base.activo ? '#FB7185'              : t.text3,
                          borderWidth: 1, borderStyle: 'solid',
                          borderColor: base.activo ? 'rgba(232,25,75,0.25)' : 'rgba(255,255,255,0.07)',
                        }}
                      >
                        {base.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    )}

                    {/* Add variant button */}
                    <button
                      onClick={() => onAddVariant(base.nombre, base.categoria)}
                      title={`Agregar variante de ${base.nombre}`}
                      style={{
                        width: 26, height: 26, borderRadius: 7, border: `1px solid ${t.border}`,
                        background: 'transparent', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: t.text3, flexShrink: 0,
                        fontSize: 16, lineHeight: 1,
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main page ─── */
export default function Productos() {
  const { productos, agregar, toggleActivo } = useProductos();
  const [search,    setSearch]    = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [addVariant, setAddVariant] = useState(null); // { nombre, categoria }

  /* Build grouped structure: Map<categoria, Map<nombre, producto[]>> */
  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = productos.filter(p =>
      p.nombreCompleto.toLowerCase().includes(q) ||
      p.nombre.toLowerCase().includes(q) ||
      p.variante.toLowerCase().includes(q)
    );

    const result = new Map();
    CAT_ORDER.forEach(cat => {
      const inCat = filtered.filter(p => p.categoria === cat);
      if (inCat.length === 0) return;
      const byName = new Map();
      inCat
        .sort((a, b) => a.nombre.localeCompare(b.nombre) || a.variante.localeCompare(b.variante))
        .forEach(p => {
          if (!byName.has(p.nombre)) byName.set(p.nombre, []);
          byName.get(p.nombre).push(p);
        });
      result.set(cat, [...byName.values()]);
    });
    // Any category not in CAT_ORDER
    const extra = filtered.filter(p => !CAT_ORDER.includes(p.categoria));
    if (extra.length > 0) {
      const byName = new Map();
      extra.sort((a, b) => a.nombre.localeCompare(b.nombre)).forEach(p => {
        if (!byName.has(p.nombre)) byName.set(p.nombre, []);
        byName.get(p.nombre).push(p);
      });
      result.set('Otros', [...byName.values()]);
    }
    return result;
  }, [productos, search]);

  const activos = productos.filter(p => p.activo).length;
  const totalGrupos = [...grouped.values()].reduce((s, g) => s + g.length, 0);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 860 }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
        <PageHeader eyebrow="Catálogo" title="Productos" />
        <Btn onClick={() => setShowForm(true)} style={{ marginTop: 2, flexShrink: 0 }}>
          <Plus size={13} /> Nuevo Producto
        </Btn>
      </motion.div>

      {/* Search + stats */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.text3, pointerEvents: 'none' }} />
          <input
            style={{ width: '100%', height: 34, borderRadius: 8, paddingLeft: 30, paddingRight: 12, border: `1px solid ${t.border}`, background: t.surface, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: t.text1 }}
            placeholder="Buscar producto o variante..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, fontSize: 12, color: t.text3, alignItems: 'center' }}>
          <span><strong style={{ color: t.text2 }}>{productos.length}</strong> SKUs</span>
          <span>·</span>
          <span><strong style={{ color: t.text2 }}>{totalGrupos}</strong> productos</span>
          <span>·</span>
          <span><strong style={{ color: t.text2 }}>{activos}</strong> activos</span>
        </div>
      </motion.div>

      {/* Grouped categories */}
      <motion.div variants={fadeUp}>
        {[...grouped.entries()].map(([cat, grupos]) => (
          <CategorySection
            key={cat}
            categoria={cat}
            grupos={grupos}
            toggleActivo={toggleActivo}
            onAddVariant={(nombre, categoria) => setAddVariant({ nombre, categoria })}
          />
        ))}
        {grouped.size === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: t.text3, fontSize: 13 }}>
            No se encontraron productos
          </div>
        )}
      </motion.div>

      {showForm && (
        <ProductoModal
          onClose={() => setShowForm(false)}
          agregar={agregar}
          productos={productos}
        />
      )}

      {addVariant && (
        <ProductoModal
          onClose={() => setAddVariant(null)}
          agregar={agregar}
          productos={productos}
          prefillNombre={addVariant.nombre}
          prefillCat={addVariant.categoria}
        />
      )}
    </motion.div>
  );
}
