import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInventario } from '../store/useStore';
import { Search, Pencil, Trash2, Package } from 'lucide-react';
import { PageHeader, Badge, Table, Th, Td, TRow, Btn, Modal, ModalFooter, Label, Input, t, fadeUp, stagger } from '../components/UI';

function stockBadge(n) {
  if (n === 0) return <Badge color="red">Sin stock</Badge>;
  if (n <= 5)  return <Badge color="amber">Bajo</Badge>;
  return             <Badge color="green">OK</Badge>;
}

const FILTROS = [
  { v: 'todos',    l: 'Todos' },
  { v: 'bajo',     l: 'Bajo stock' },
  { v: 'sinstock', l: 'Sin stock' },
];

function EditarModal({ nombre, data, onClose, onGuardar }) {
  const [stock,  setStock]  = useState(String(data.stockActual));
  const [costo,  setCosto]  = useState(String(Math.round(data.costoPromedio)));
  const [total,  setTotal]  = useState(String(data.totalComprado));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(nombre, {
      stockActual:   Number(stock)  || 0,
      costoPromedio: Number(costo)  || 0,
      totalComprado: Number(total)  || 0,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Editar registro" subtitle={nombre} icon={Package}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 4 }}>
          <div>
            <Label>Stock actual</Label>
            <Input type="number" min="0" step="any" value={stock} onChange={e => setStock(e.target.value)} />
          </div>
          <div>
            <Label>Costo promedio ($)</Label>
            <Input type="number" min="0" step="any" value={costo} onChange={e => setCosto(e.target.value)} />
          </div>
          <div>
            <Label>Total comprado</Label>
            <Input type="number" min="0" step="any" value={total} onChange={e => setTotal(e.target.value)} />
          </div>
        </div>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" variant="primary">Guardar</Btn>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default function Inventario() {
  const { inventario, editarItem, eliminarItem } = useInventario();
  const [search,     setSearch]     = useState('');
  const [filtro,     setFiltro]     = useState('todos');
  const [editando,   setEditando]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const all = Object.entries(inventario);
  const items = all
    .filter(([n]) => n.toLowerCase().includes(search.toLowerCase()))
    .filter(([, d]) => {
      if (filtro === 'bajo')     return d.stockActual > 0 && d.stockActual <= 5;
      if (filtro === 'sinstock') return d.stockActual === 0;
      return true;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  const sinStock  = all.filter(([, d]) => d.stockActual === 0).length;
  const bajoStock = all.filter(([, d]) => d.stockActual > 0 && d.stockActual <= 5).length;
  const fmt = (n) => `$${Number(n).toLocaleString('es-DO', { maximumFractionDigits: 0 })}`;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 900 }}>
      <motion.div variants={fadeUp}>
        <PageHeader eyebrow="Control de stock" title="Inventario" />
      </motion.div>

      {/* Pills */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: `${all.length} productos`, bg: t.surface, border: t.border, text: t.text2 },
          bajoStock > 0 && { label: `${bajoStock} bajo stock`, bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#FCD34D' },
          sinStock  > 0 && { label: `${sinStock} sin stock`,   bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)',  text: '#F87171' },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ padding: '5px 14px', borderRadius: 8, background: item.bg, border: `1px solid ${item.border}`, fontSize: 12, fontWeight: 600, color: item.text }}>
            {item.label}
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.text3, pointerEvents: 'none' }} />
          <input
            style={{ width: '100%', height: 34, borderRadius: 8, paddingLeft: 32, paddingRight: 12, border: `1px solid ${t.border}`, background: t.surface, fontSize: 13, color: t.text1, outline: 'none', fontFamily: 'inherit' }}
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', background: t.surface, borderRadius: 8, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
          {FILTROS.map(({ v, l }) => (
            <button key={v} onClick={() => setFiltro(v)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: filtro === v ? t.accent : 'transparent',
              color:      filtro === v ? '#fff'    : t.text3,
              transition: 'all 0.12s',
            }}>{l}</button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp}>
        <Table>
          <thead>
            <tr>
              <Th>Producto</Th>
              <Th align="right">Stock</Th>
              <Th align="right">Total comprado</Th>
              <Th align="right">Costo prom.</Th>
              <Th align="center">Estado</Th>
              <Th align="center"></Th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: t.text3, fontSize: 13 }}>
                No se encontraron productos
              </td></tr>
            )}
            {items.map(([nombre, data]) => (
              <TRow key={nombre}>
                <Td style={{ fontWeight: 500, color: t.text1 }}>{nombre}</Td>
                <Td align="right" style={{ fontWeight: 700, fontSize: 15, color: t.text1 }}>{data.stockActual}</Td>
                <Td align="right" style={{ color: t.text3 }}>{data.totalComprado}</Td>
                <Td align="right" style={{ color: t.text2 }}>{fmt(data.costoPromedio)}</Td>
                <Td align="center">{stockBadge(data.stockActual)}</Td>
                <Td align="center">
                  {confirmDel === nombre ? (
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Btn size="sm" variant="danger" onClick={() => { eliminarItem(nombre); setConfirmDel(null); }}>Sí</Btn>
                      <Btn size="sm" variant="ghost"  onClick={() => setConfirmDel(null)}>No</Btn>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', color: t.text1 }}
                        onClick={() => setEditando(nombre)}
                        style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3 }}
                      >
                        <Pencil size={12} />
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171' }}
                        onClick={() => setConfirmDel(nombre)}
                        style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3 }}
                      >
                        <Trash2 size={12} />
                      </motion.button>
                    </div>
                  )}
                </Td>
              </TRow>
            ))}
          </tbody>
        </Table>
        <p style={{ fontSize: 11, color: t.text3, textAlign: 'right', marginTop: 10 }}>
          {items.length} de {all.length} productos
        </p>
      </motion.div>

      {editando && (
        <EditarModal
          nombre={editando}
          data={inventario[editando]}
          onClose={() => setEditando(null)}
          onGuardar={editarItem}
        />
      )}
    </motion.div>
  );
}
