// ── Shared design tokens & primitives ──

export const t = {
  bg:        '#F4F4F5',
  surface:   '#FFFFFF',
  border:    '#E4E4E7',
  borderSub: '#F0F0F2',
  text1:     '#09090B',
  text2:     '#52525B',
  text3:     '#A1A1AA',
  accent:    '#C2185B',
  accentBg:  '#FFF1F5',
  accentMid: '#FCE4EC',
};

export function PageHeader({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: t.accent, marginBottom: 4 }}>
          {eyebrow}
        </p>
      )}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text1, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
        {title}
      </h1>
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, ...style }}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, type = 'button', variant = 'primary', size = 'md', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
    border: 'none', outline: 'none', transition: 'all 0.12s',
    borderRadius: 8, letterSpacing: '-0.1px',
  };
  const sizes = {
    sm: { fontSize: 12, padding: '5px 12px', height: 28 },
    md: { fontSize: 13, padding: '7px 14px', height: 34 },
  };
  const variants = {
    primary:  { background: t.accent,   color: '#fff', border: `1px solid ${t.accent}` },
    ghost:    { background: 'transparent', color: t.text2, border: `1px solid ${t.border}` },
    danger:   { background: '#FEF2F2',  color: '#DC2626', border: '1px solid #FECACA' },
  };
  return (
    <button type={type} onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function Input({ style = {}, ...props }) {
  return (
    <input
      style={{
        width: '100%', height: 34, borderRadius: 8, padding: '0 12px',
        border: `1px solid ${t.border}`, background: t.surface,
        fontSize: 13, color: t.text1, outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.12s',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = t.accent}
      onBlur={e => e.target.style.borderColor = t.border}
      {...props}
    />
  );
}

export function Select({ children, style = {}, ...props }) {
  return (
    <select
      style={{
        width: '100%', height: 34, borderRadius: 8, padding: '0 10px',
        border: `1px solid ${t.border}`, background: t.surface,
        fontSize: 13, color: t.text1, outline: 'none', fontFamily: 'inherit',
        cursor: 'pointer',
        ...style,
      }}
      {...props}>
      {children}
    </select>
  );
}

export function Label({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
      {children}
    </p>
  );
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray:   { bg: '#F4F4F5', text: '#71717A' },
    rose:   { bg: '#FFF1F5', text: '#C2185B' },
    green:  { bg: '#F0FDF4', text: '#16A34A' },
    amber:  { bg: '#FFFBEB', text: '#D97706' },
    red:    { bg: '#FEF2F2', text: '#DC2626' },
    violet: { bg: '#F5F3FF', text: '#7C3AED' },
    blue:   { bg: '#EFF6FF', text: '#2563EB' },
    teal:   { bg: '#F0FDFA', text: '#0D9488' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
      letterSpacing: '0.01em',
    }}>
      {children}
    </span>
  );
}

export function Table({ children }) {
  return (
    <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, align = 'left' }) {
  return (
    <th style={{
      padding: '10px 16px', textAlign: align,
      fontSize: 11, fontWeight: 600, color: t.text3,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      background: '#FAFAFA', borderBottom: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  );
}

export function Td({ children, align = 'left', style = {} }) {
  return (
    <td style={{ padding: '11px 16px', textAlign: align, color: t.text2, verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  );
}

export function Modal({ onClose, title, subtitle, icon: Icon, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: t.surface, borderRadius: 16, width: '100%', maxWidth: 520,
        border: `1px solid ${t.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {Icon && (
              <div style={{ width: 34, height: 34, borderRadius: 9, background: t.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color: t.accent }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.text1, letterSpacing: '-0.2px' }}>{title}</p>
              {subtitle && <p style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: `1px solid ${t.border}`,
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.text3, fontSize: 16, lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: `1px solid ${t.border}`, marginTop: 16 }}>
      {children}
    </div>
  );
}
