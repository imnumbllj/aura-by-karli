import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventario } from '../store/useStore';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { PageHeader, t, fadeUp, stagger } from '../components/UI';
import comprasData from '../data/compras.json';
import ventasData from '../data/ventas.json';

function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.14)' }}
      style={{
        background: t.surface, borderRadius: 12,
        border: `1px solid ${t.border}`, padding: 20,
        cursor: 'default', transition: 'border-color 0.15s',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: accent + '1A', border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: t.text1, letterSpacing: '-0.6px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: t.text3, marginTop: 5, fontWeight: 500 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: t.text3, marginTop: 2, opacity: 0.7 }}>{sub}</p>}
    </motion.div>
  );
}

export default function Dashboard() {
  const { inventario } = useInventario();

  const stats = useMemo(() => {
    const entries = Object.entries(inventario);
    return {
      totalProductos: entries.length,
      bajoStock:      entries.filter(([, v]) => v.stockActual <= 5).length,
      totalInvertido: comprasData.reduce((s, c) => s + (c['Costo T'] || 0), 0),
      totalVentas:    ventasData.reduce((s, v) => s + (v.total || 0), 0),
    };
  }, [inventario]);

  const alertas = useMemo(() =>
    Object.entries(inventario)
      .filter(([, v]) => v.stockActual <= 5)
      .sort((a, b) => a[1].stockActual - b[1].stockActual)
      .slice(0, 8),
  [inventario]);

  const fmt = (n) => `$${Number(n).toLocaleString('es-DO')}`;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <PageHeader eyebrow="Panel principal" title="Dashboard" />
      </motion.div>

      {/* Stats grid — 2 cols mobile, 4 cols desktop */}
      <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}
        className="stats-grid">
        <StatCard icon={Package}       label="Productos"       value={stats.totalProductos}      accent="#E8194B" />
        <StatCard icon={AlertTriangle} label="Bajo stock"      value={stats.bajoStock}           accent="#F59E0B" sub="≤ 5 unidades" />
        <StatCard icon={DollarSign}    label="Total invertido" value={fmt(stats.totalInvertido)} accent="#10B981" />
        <StatCard icon={TrendingUp}    label="Total ventas"    value={fmt(stats.totalVentas)}    accent="#8B5CF6" />
      </div>

      {alertas.length > 0 && (
        <motion.div variants={fadeUp}
          style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>Bajo stock</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FCD34D', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '2px 10px', borderRadius: 99 }}>
              {alertas.length}
            </span>
          </div>
          <div style={{ padding: 12 }} className="alert-grid">
            {alertas.map(([nombre, data]) => (
              <div key={nombre} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 9,
                background: data.stockActual === 0 ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)',
                border: `1px solid ${data.stockActual === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
              }}>
                <span style={{ fontSize: 12, color: t.text2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                  {nombre}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0, color: data.stockActual === 0 ? '#F87171' : '#FCD34D' }}>
                  {data.stockActual}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <style>{`
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .alert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .alert-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </motion.div>
  );
}
