import './tokens.css'
import { ProgressBar } from './components/ProgressBar'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const row = { display: 'flex', flexDirection: 'column', gap: 20, width: 380 }
const grid = { display: 'flex', flexWrap: 'wrap', gap: 24 }

const surfaces = [
  { name: 'primary (teal)', bg: 'var(--ds-bg-primary)' },
  { name: '❌ secondary (rosa) — no soportado, indicator se funde', bg: 'var(--ds-bg-secondary)' },
  { name: 'tertiary (purple)', bg: 'var(--ds-bg-tertiary)' },
  { name: 'error', bg: 'var(--ds-bg-error)' },
  { name: 'success', bg: 'var(--ds-bg-success)' },
  { name: 'info', bg: 'var(--ds-bg-info)' },
  { name: '⚠️ inverse — track/indicator OK, texto ilegible', bg: 'var(--ds-bg-inverse)' },
]

const values = [20, 50, 80]

export default function App() {
  return (
    <div style={page}>
      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>ProgressBar — variant="default" (sobre bg/page)</h2>
        {values.map((v) => (
          <ProgressBar key={v} value={v} label="Label" helperText={`${v}%`} />
        ))}
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>ProgressBar — variant="onColor" sobre distintas superficies de color</h2>
        <div style={grid}>
          {surfaces.map((s) => (
            <div
              key={s.name}
              style={{ background: s.bg, padding: 20, borderRadius: 8, width: 260, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{s.name}</span>
              {values.map((v) => (
                <ProgressBar key={v} value={v} variant="onColor" label="Label" helperText={`${v}%`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
