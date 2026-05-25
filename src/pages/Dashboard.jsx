import { useMemo } from 'react';
import { useInventario } from '../store/useStore';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { PageHeader, t } from '../components/UI';
import comprasData from '../data/compras.json';
import ventasData from '../data/ventas.json';

function StatCard({ icon: Icon, label, value, accent = t.accent }) {
  return (
    <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: accent + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: t.text1, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: t.text3, marginTop: 5, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { inventario } = useInventario();

  const stats = useMemo(() => {
    const entries = Object.entries(inventario);
    return {
      totalProductos:  entries.length,
      bajoStock:       entries.filter(([, v]) => v.stockActual <= 5).length,
      totalInvertido:  comprasData.reduce((s, c) => s + (c['Costo T'] || 0), 0),
      totalVentas:     ventasData.reduce((s, v) => s + (v.total || 0), 0),
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
    <div style={{ maxWidth: 900 }}>
      <PageHeader eyebrow="Panel principal" title="Dashboard" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        <StatCard icon={Package}       label="Productos en stock"   value={stats.totalProductos} accent="#C2185B" />
        <StatCard icon={AlertTriangle} label="Bajo stock"           value={stats.bajoStock}      accent="#D97706" />
        <StatCard icon={DollarSign}    label="Total invertido"      value={fmt(stats.totalInvertido)} accent="#059669" />
        <StatCard icon={TrendingUp}    label="Total ventas"         value={fmt(stats.totalVentas)}    accent="#7C3AED" />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: '#D97706' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>Productos con bajo stock</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706', background: '#FFFBEB', padding: '3px 10px', borderRadius: 99, border: '1px solid #FDE68A' }}>
              {alertas.length} alertas
            </span>
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {alertas.map(([nombre, data]) => (
              <div key={nombre} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 9,
                background: data.stockActual === 0 ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${data.stockActual === 0 ? '#FECACA' : '#FDE68A'}`,
              }}>
                <span style={{ fontSize: 12, color: t.text2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                  {nombre}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: data.stockActual === 0 ? '#DC2626' : '#D97706' }}>
                  {data.stockActual}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
