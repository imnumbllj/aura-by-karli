// ── Design System — Dark Mode ──

const S = {
  bg:         '#0E0E10',
  surface:    '#18181B',
  surface2:   '#1F1F23',
  surface3:   '#26262C',
  border:     'rgba(255,255,255,0.07)',
  border2:    'rgba(255,255,255,0.12)',
  text1:      '#F4F4F5',
  text2:      'rgba(244,244,245,0.6)',
  text3:      'rgba(244,244,245,0.28)',
  accent:     '#E8194B',
  accentDim:  'rgba(232,25,75,0.12)',
  accentMid:  'rgba(232,25,75,0.22)',
};
export { S as t };

// ── PageHeader ──
export function PageHeader({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {eyebrow && (
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.accent, marginBottom: 6, opacity: 0.9 }}>
          {eyebrow}
        </p>
      )}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: S.text1, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
        {title}
      </h1>
    </div>
  );
}

// ── Card ──
export function Card({ children, style = {}, padding = 20 }) {
  return (
    <div style={{
      background: S.surface,
      borderRadius: 12,
      border: `1px solid ${S.border}`,
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── SectionTitle ──
export function SectionTitle({ children }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 600, color: S.text3, letterSpacing: '0.01em', marginBottom: 14 }}>
      {children}
    </p>
  );
}

// ── Button ──
export function Btn({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, style = {} }) {
  const sizes = {
    sm: { fontSize: 12, padding: '5px 11px', height: 28, gap: 5 },
    md: { fontSize: 13, padding: '7px 14px', height: 34, gap: 6 },
  };
  const variants = {
    primary: {
      background: S.accent,
      color: '#fff',
      border: `1px solid rgba(255,255,255,0.1)`,
      boxShadow: '0 1px 2px rgba(232,25,75,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    ghost: {
      background: S.surface2,
      color: S.text2,
      border: `1px solid ${S.border2}`,
    },
    danger: {
      background: 'rgba(220,38,38,0.12)',
      color: '#F87171',
      border: '1px solid rgba(220,38,38,0.2)',
    },
  };
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn-press"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: s.gap,
        height: s.height, padding: s.padding,
        fontSize: s.fontSize, fontWeight: 500, letterSpacing: '-0.1px',
        borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', transition: 'all 0.15s ease',
        opacity: disabled ? 0.45 : 1,
        ...v, ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {children}
    </button>
  );
}

// ── Label ──
export function Label({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
      {children}
    </p>
  );
}

// ── Input ──
export function Input({ style = {}, ...props }) {
  return (
    <input
      style={{ width: '100%', height: 34, padding: '0 12px', ...style }}
      {...props}
    />
  );
}

// ── Select ──
export function Select({ children, style = {}, ...props }) {
  return (
    <select style={{ width: '100%', height: 34, padding: '0 10px', cursor: 'pointer', ...style }} {...props}>
      {children}
    </select>
  );
}

// ── Badge ──
const BADGE_COLORS = {
  gray:   { bg: 'rgba(255,255,255,0.06)',  text: 'rgba(244,244,245,0.5)',  border: 'rgba(255,255,255,0.08)' },
  rose:   { bg: 'rgba(232,25,75,0.12)',    text: '#FB7185',                border: 'rgba(232,25,75,0.2)' },
  green:  { bg: 'rgba(34,197,94,0.1)',     text: '#4ADE80',                border: 'rgba(34,197,94,0.15)' },
  amber:  { bg: 'rgba(245,158,11,0.1)',    text: '#FCD34D',                border: 'rgba(245,158,11,0.15)' },
  red:    { bg: 'rgba(239,68,68,0.1)',     text: '#F87171',                border: 'rgba(239,68,68,0.15)' },
  violet: { bg: 'rgba(139,92,246,0.1)',    text: '#A78BFA',                border: 'rgba(139,92,246,0.15)' },
  blue:   { bg: 'rgba(59,130,246,0.1)',    text: '#60A5FA',                border: 'rgba(59,130,246,0.15)' },
  teal:   { bg: 'rgba(20,184,166,0.1)',    text: '#2DD4BF',                border: 'rgba(20,184,166,0.15)' },
};
export function Badge({ children, color = 'gray' }) {
  const c = BADGE_COLORS[color] || BADGE_COLORS.gray;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

// ── Table ──
export function Table({ children }) {
  return (
    <div style={{ background: S.surface, borderRadius: 12, border: `1px solid ${S.border}`, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  );
}
export function Th({ children, align = 'left', style = {} }) {
  return (
    <th style={{
      padding: '10px 16px', textAlign: align,
      fontSize: 11, fontWeight: 600, color: S.text3,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      background: S.surface2, borderBottom: `1px solid ${S.border}`,
      whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </th>
  );
}
export function Td({ children, align = 'left', style = {} }) {
  return (
    <td style={{ padding: '11px 16px', textAlign: align, color: S.text2, verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  );
}
export function TRow({ children, style = {} }) {
  return (
    <tr
      style={{ borderTop: `1px solid ${S.border}`, transition: 'background 0.12s ease', cursor: 'default', ...style }}
      onMouseEnter={e => e.currentTarget.style.background = S.surface2}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </tr>
  );
}

// ── Modal ──
export function Modal({ onClose, title, subtitle, icon: Icon, children, maxWidth = 520 }) {
  return (
    <div
      className="overlay-enter"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: 24, paddingBottom: 24, paddingRight: 24, paddingLeft: 244,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter"
        style={{
          background: S.surface,
          borderRadius: 14,
          border: `1px solid ${S.border2}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          width: '100%', maxWidth,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {Icon && (
              <div style={{ width: 32, height: 32, borderRadius: 8, background: S.accentDim, border: `1px solid ${S.accentMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} style={{ color: S.accent }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: S.text1, letterSpacing: '-0.2px' }}>{title}</p>
              {subtitle && <p style={{ fontSize: 11, color: S.text3, marginTop: 1 }}>{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 7, background: S.surface2, border: `1px solid ${S.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: S.text3, fontSize: 16, transition: 'all 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = S.surface3}
            onMouseLeave={e => e.currentTarget.style.background = S.surface2}
          >×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
export function ModalFooter({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: `1px solid ${S.border}`, marginTop: 16 }}>
      {children}
    </div>
  );
}

// ── Divider ──
export function Divider({ style = {} }) {
  return <div style={{ height: 1, background: S.border, ...style }} />;
}

// ── Empty state ──
export function Empty({ message = 'No hay datos' }) {
  return (
    <div style={{ padding: '52px 0', textAlign: 'center', color: S.text3, fontSize: 13 }}>
      {message}
    </div>
  );
}
