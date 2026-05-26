import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventario, useCompras, useVentas } from '../store/useStore';
import {
  Package, TrendingUp, AlertTriangle, DollarSign,
  ShoppingCart, BarChart2, ArrowUpRight,
} from 'lucide-react';
import { PageHeader, t, fadeUp, stagger } from '../components/UI';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

/* ─── Tokens ─── */
const PALETTE = ['#E8194B', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6'];

const fmt  = (n) => `$${Number(n).toLocaleString('es-DO', { maximumFractionDigits: 0 })}`;
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.14)' }}
      style={{
        background: t.surface, borderRadius: 12,
        border: `1px solid ${t.border}`, padding: '18px 20px',
        cursor: 'default', transition: 'border-color 0.15s',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: accent + '1A', border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
      }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: t.text1, letterSpacing: '-0.6px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: t.text3, marginTop: 5, fontWeight: 500 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: t.text3, marginTop: 2, opacity: 0.6 }}>{sub}</p>}
    </motion.div>
  );
}

function SectionCard({ title, children, style }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: t.surface, borderRadius: 12,
        border: `1px solid ${t.border}`, overflow: 'hidden', ...style,
      }}
    >
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>{title}</p>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </motion.div>
  );
}

/* Custom tooltip for recharts */
function CustomTooltip({ active, payload, label, isCurrency }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1F1F23', border: `1px solid ${t.border}`, borderRadius: 8,
      padding: '8px 12px', fontSize: 12,
    }}>
      {label && <p style={{ color: t.text3, marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || t.text1, fontWeight: 600 }}>
          {isCurrency ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

/* Horizontal bar row */
function HBar({ label, value, max, color, fmtFn }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: t.text2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{label}</span>
        <span style={{ fontSize: 12, color: t.text1, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{fmtFn ? fmtFn(value) : value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', borderRadius: 99, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function Dashboard() {
  const { inventario } = useInventario();
  const { compras }    = useCompras();
  const { ventas }     = useVentas();

  /* KPIs */
  const kpis = useMemo(() => {
    const invEntries   = Object.entries(inventario);
    const totalInv     = compras.reduce((s, c) => s + (c['Costo T'] || 0), 0);
    const totalVentas  = ventas.reduce((s, v) => s + (v.total || 0), 0);
    const ordenes      = [...new Set(compras.map(c => c.ID))].length;
    const enStock      = invEntries.filter(([, v]) => v.stockActual > 0).length;
    const sinStock     = invEntries.filter(([, v]) => v.stockActual === 0).length;
    const bajoStock    = invEntries.filter(([, v]) => v.stockActual > 0 && v.stockActual <= 5).length;
    const ganancia     = totalVentas - totalInv;
    return { totalInv, totalVentas, ordenes, enStock, sinStock, bajoStock, ganancia, totalProductos: invEntries.length };
  }, [inventario, compras, ventas]);

  /* Categorías — inversión por categoría */
  const categoriaData = useMemo(() => {
    const map = {};
    compras.forEach(c => {
      const cat = c.Categoria || 'Sin categoría';
      map[cat] = (map[cat] || 0) + (c['Costo T'] || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [compras]);

  /* Compras por fecha — últimas 10 fechas */
  const comprasPorFecha = useMemo(() => {
    const map = {};
    compras.forEach(c => {
      if (c.Fecha) map[c.Fecha] = (map[c.Fecha] || 0) + (c['Costo T'] || 0);
    });
    return Object.entries(map)
      .map(([fecha, total]) => ({ fecha: fecha.slice(5), total }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(-10);
  }, [compras]);

  /* Top productos por inversión */
  const topProductos = useMemo(() => {
    const map = {};
    compras.forEach(c => {
      if (c.Producto) map[c.Producto] = (map[c.Producto] || 0) + (c['Costo T'] || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [compras]);

  /* Top ventas */
  const topVentas = useMemo(() => {
    const map = {};
    ventas.forEach(v => {
      const key = v.nombre || v.regalo || 'Sin nombre';
      if (!map[key]) map[key] = { total: 0, qty: 0 };
      map[key].total += v.total || 0;
      map[key].qty   += v.cantidad || 1;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [ventas]);

  /* Alertas bajo stock */
  const alertas = useMemo(() =>
    Object.entries(inventario)
      .filter(([, v]) => v.stockActual <= 5)
      .sort((a, b) => a[1].stockActual - b[1].stockActual)
      .slice(0, 12),
  [inventario]);

  const maxProd  = topProductos[0]?.value  || 1;
  const maxVenta = topVentas[0]?.total     || 1;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <PageHeader eyebrow="Panel principal" title="Dashboard" />
      </motion.div>

      {/* ── KPI cards ── */}
      <div className="dash-stats" style={{ marginBottom: 20 }}>
        <StatCard icon={DollarSign}    label="Total invertido"  value={fmt(kpis.totalInv)}    accent="#10B981" />
        <StatCard icon={TrendingUp}    label="Total en ventas"  value={fmt(kpis.totalVentas)}  accent="#8B5CF6" sub={`Ganancia aprox. ${fmt(kpis.ganancia)}`} />
        <StatCard icon={ShoppingCart}  label="Órdenes de compra" value={kpis.ordenes}          accent="#3B82F6" />
        <StatCard icon={BarChart2}     label="Ventas registradas" value={ventas.length}        accent="#E8194B" />
        <StatCard icon={Package}       label="Productos en stock" value={kpis.enStock}         accent="#14B8A6" sub={`${kpis.totalProductos} en total`} />
        <StatCard icon={AlertTriangle} label="Bajo stock"        value={kpis.bajoStock}        accent="#F59E0B" sub={kpis.sinStock > 0 ? `${kpis.sinStock} sin stock` : undefined} />
      </div>

      {/* ── Charts row 1: Pie + Bar ── */}
      <div className="dash-row2" style={{ marginBottom: 16 }}>

        <SectionCard title="Inversión por categoría">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={categoriaData}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={72}
                  dataKey="value" paddingAngle={2}
                >
                  {categoriaData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isCurrency />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, minWidth: 120 }}>
              {categoriaData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: t.text2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: t.text1, fontWeight: 600, flexShrink: 0 }}>{fmtK(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Compras por fecha">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={comprasPorFecha} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: 'rgba(244,244,245,0.28)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(244,244,245,0.28)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip isCurrency />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="total" fill="#E8194B" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* ── Charts row 2: Top productos + Top ventas ── */}
      <div className="dash-row2" style={{ marginBottom: 16 }}>

        <SectionCard title="Top productos por inversión">
          {topProductos.map((d, i) => (
            <HBar key={d.name} label={d.name} value={d.value} max={maxProd} color={PALETTE[i % PALETTE.length]} fmtFn={fmtK} />
          ))}
        </SectionCard>

        <SectionCard title="Top ventas por regalo">
          {topVentas.map((d, i) => (
            <HBar key={d.name} label={d.name} value={d.total} max={maxVenta} color={PALETTE[(i + 2) % PALETTE.length]} fmtFn={fmtK} />
          ))}
        </SectionCard>

      </div>

      {/* ── Bajo stock ── */}
      {alertas.length > 0 && (
        <motion.div
          variants={fadeUp}
          style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}
        >
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>Alertas de stock</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FCD34D', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '2px 10px', borderRadius: 99 }}>
              {alertas.length} productos
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
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .dash-row2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .alert-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        @media (min-width: 640px) {
          .dash-stats { grid-template-columns: repeat(3, 1fr); }
          .alert-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .dash-stats { grid-template-columns: repeat(6, 1fr); }
          .dash-row2  { grid-template-columns: repeat(2, 1fr); }
          .alert-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </motion.div>
  );
}
