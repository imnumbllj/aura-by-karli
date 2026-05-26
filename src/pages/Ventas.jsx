import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVentas } from '../store/useStore';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { PageHeader, Btn, Modal, ModalFooter, Label, Input, Table, Th, Td, TRow, t, fadeUp, stagger } from '../components/UI';

function NuevaVentaForm({ onClose, registrar }) {
  const [nombre,   setNombre]   = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio,   setPrecio]   = useState('');

  const total = Number(cantidad) * Number(precio);
  const fmt   = (n) => n ? `$${Number(n).toLocaleString('es-DO')}` : '$0';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;
    registrar({ nombre, cantidad: Number(cantidad), precio: Number(precio), total, fecha: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Registrar Venta" subtitle="Nuevo ingreso al registro" icon={TrendingUp}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <Label>Nombre del regalo</Label>
          <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Aura Pink" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <Label>Cantidad</Label>
            <Input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} />
          </div>
          <div>
            <Label>Precio unitario</Label>
            <Input type="number" min="0" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0" required />
          </div>
        </div>
        <div style={{ background: t.accentDim, borderRadius: 10, padding: '14px 16px', textAlign: 'center', border: `1px solid ${t.accentMid}`, marginBottom: 4 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Total de la venta</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: t.accent, letterSpacing: '-0.8px' }}>{fmt(total)}</p>
        </div>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" variant="primary">Registrar</Btn>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default function Ventas() {
  const { ventas, registrar, eliminar } = useVentas();
  const [showForm,   setShowForm]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const totalGeneral = ventas.reduce((s, v) => s + (v.total || 0), 0);
  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-DO')}`;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 860 }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12 }}>
        <PageHeader eyebrow="Registro de ventas" title="Ventas" />
        <Btn onClick={() => setShowForm(true)} style={{ marginTop: 2, flexShrink: 0 }}>
          <Plus size={13} /> Nueva Venta
        </Btn>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Total ingresos</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: t.accent, letterSpacing: '-0.6px' }}>{fmt(totalGeneral)}</p>
        </div>
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Ventas registradas</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: t.text1, letterSpacing: '-0.6px' }}>{ventas.length}</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Table>
          <thead>
            <tr>
              <Th>Regalo</Th>
              <Th align="center">Cant.</Th>
              <Th align="right">Precio U.</Th>
              <Th align="right">Total</Th>
              <Th align="center"></Th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: t.text3, fontSize: 13 }}>
                No hay ventas registradas aún
              </td></tr>
            )}
            {ventas.map((v) => (
              <TRow key={v.id}>
                <Td style={{ fontWeight: 500, color: t.text1 }}>{v.nombre}</Td>
                <Td align="center" style={{ color: t.text3 }}>{v.cantidad}</Td>
                <Td align="right"  style={{ color: t.text3 }}>{fmt(v.precio)}</Td>
                <Td align="right"  style={{ fontWeight: 700, color: t.text1 }}>{fmt(v.total)}</Td>
                <Td align="center">
                  {confirmDel === v.id ? (
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Btn size="sm" variant="danger" onClick={() => { eliminar(v.id); setConfirmDel(null); }}>Sí</Btn>
                      <Btn size="sm" variant="ghost"  onClick={() => setConfirmDel(null)}>No</Btn>
                    </div>
                  ) : (
                    <motion.button onClick={() => setConfirmDel(v.id)}
                      whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171' }}
                      style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text3, margin: '0 auto' }}>
                      <Trash2 size={13} />
                    </motion.button>
                  )}
                </Td>
              </TRow>
            ))}
          </tbody>
        </Table>
      </motion.div>

      {showForm && <NuevaVentaForm onClose={() => setShowForm(false)} registrar={registrar} />}
    </motion.div>
  );
}
