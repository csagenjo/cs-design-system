import { useState } from 'react'
import './tokens.css'
import { CollapsibleIconButton } from './components/CollapsibleIconButton'

/* Banco de pruebas — CollapsibleIconButton instancia Tooltip (01/10/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  const [open, setOpen] = useState({})
  const toggle = k => setOpen(o => ({ ...o, [k]: !o[k] }))
  return (
    <main style={{ padding: 64, display: 'flex', flexDirection: 'column', gap: 48, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      {['default', 'secondary'].map(v => (
        <section key={v}><p style={label}>variant={v}</p>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['small', 'medium', 'large'].map(s => (
              <CollapsibleIconButton key={s} variant={v} size={s} expanded={!!open[v + s]} onToggle={() => toggle(v + s)} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
