import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProductos } from '../store/useStore';
import { Plus, Search, ToggleLeft, ToggleRight, Settings2 } from 'lucide-react';
import { PageHeader, Btn, Modal, ModalFooter, Label, Input, Select, Badge, Table, Th, Td, TRow, t, fadeUp, stagger } from '../components/UI';
import { CATEGORIAS, UNIDADES } from './Compras';

const TIPOS = ['Directo', 'Indirecto', 'Servicio'];
const CAT_COLOR = {
  'Peluche & Juguete':     'violet',
  'Bebida & Licor':        'amber',
  'Cosmético & Fragancia': 'rose',
  'Comestible':            'teal',
  'Decoración':            'blue',
  'Empaque':               'gray',
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
    <Modal onClose={onClose} title="Nuevo Producto" subtitle="Agregar al catálogo" icon={Settings2}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <Label>Nombre *</Label>
            <Input value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
          </div>
          <div>
            <Label>Variante</Label>
            <Input value={form.variante} onChange={e => set('variante', e.target.value)} placeholder="Opcional" />
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

export default function Productos() {
  const { productos, agregar, toggleActivo } = useProductos();
  const [search,    setSearch]    = useState('');
  const [catFiltro, setCatFiltro] = useState('Todos');
  const [showForm,  setShowForm]  = useState(false);

  const filtered = productos
    .filter(p => p.nombreCompleto.toLowerCase().includes(search.toLowerCase()))
    .filter(p => catFiltro === 'Todos' || p.categoria === catFiltro)
    .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  const activos = productos.filter(p => p.activo).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 900 }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12 }}>
        <PageHeader eyebrow="Catálogo" title="Productos" />
        <Btn onClick={() => setShowForm(true)} style={{ marginTop: 2, flexShrink: 0 }}>
          <Plus size={13} /> Nuevo Producto
        </Btn>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.text3, pointerEvents: 'none' }} />
          <input
            style={{ width: '100%', height: 34, borderRadius: 8, paddingLeft: 30, paddingRight: 12, border: `1px solid ${t.border}`, background: t.surface, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: t.text1 }}
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', background: t.surface, borderRadius: 8, border: `1px solid ${t.border}`, padding: 3, gap: 2, flexWrap: 'wrap' }}>
          {['Todos', ...CATEGORIAS].map(c => (
            <button key={c} onClick={() => setCatFiltro(c)} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
              background: catFiltro === c ? t.accent : 'transparent',
              color:      catFiltro === c ? '#fff'    : t.text3,
            }}>{c}</button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 8, marginBottom: 12, fontSize: 12, color: t.text3 }}>
        <span><strong style={{ color: t.text2 }}>{activos}</strong> activos</span>
        <span>·</span>
        <span><strong style={{ color: t.text2 }}>{productos.length - activos}</strong> inactivos</span>
        <span>·</span>
        <span><strong style={{ color: t.text2 }}>{filtered.length}</strong> mostrados</span>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Table>
          <thead>
            <tr>
              <Th>Producto</Th>
              <Th align="center">Categoría</Th>
              <Th align="center">Tipo</Th>
              <Th align="center">Unidad</Th>
              <Th align="center">Activo</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: t.text3, fontSize: 13 }}>
                No se encontraron productos
              </td></tr>
            )}
            {filtered.map((p) => (
              <TRow key={p.id} style={{ opacity: p.activo ? 1 : 0.45 }}>
                <Td style={{ fontWeight: 500, color: t.text1 }}>
                  {p.nombreCompleto}
                  <span style={{ fontSize: 11, color: t.text3, marginLeft: 8, fontFamily: 'monospace' }}>{p.id}</span>
                </Td>
                <Td align="center">
                  <Badge color={CAT_COLOR[p.categoria] || 'gray'}>{p.categoria}</Badge>
                </Td>
                <Td align="center" style={{ fontSize: 12, color: t.text3 }}>{p.tipo}</Td>
                <Td align="center" style={{ fontSize: 12, color: t.text3 }}>{p.unidad}</Td>
                <Td align="center">
                  <button onClick={() => toggleActivo(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                    {p.activo
                      ? <ToggleRight size={22} style={{ color: t.accent }} />
                      : <ToggleLeft  size={22} style={{ color: t.text3 }} />}
                  </button>
                </Td>
              </TRow>
            ))}
          </tbody>
        </Table>
      </motion.div>

      {showForm && <NuevoProductoForm onClose={() => setShowForm(false)} agregar={agregar} productos={productos} />}
    </motion.div>
  );
}
