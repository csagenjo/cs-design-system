import { useState, useEffect } from 'react'
import './tokens.css'
import { Button } from './components/Button'
import { IconButton } from './components/IconButton'
import { Checkbox } from './components/Checkbox'

/* Banco de pruebas — foco por dentro + color de foco del sistema (01/10/2026).
   Cada control va dentro de un contenedor con overflow:hidden y SIN margen:
   el anillo no debe cortarse. */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }
const clip = { overflow: 'hidden', display: 'inline-flex' }
const btns = [
  { variant: 'default' }, { variant: 'default', outline: true }, { variant: 'accent' },
  { variant: 'accent', outline: true }, { variant: 'ghost' }, { variant: 'negative' },
]

export default function App() {
  const [dark, setDark] = useState(false)
  // El modo se aplica en <html>: los tokens de componente se resuelven en :root.
  useEffect(() => { document.documentElement.dataset.mode = dark ? 'dark' : 'light' }, [dark])
  return (
    <main style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <label style={label}><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} /> dark</label>
      <section><p style={label}>Button (overflow:hidden)</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {btns.map((b, i) => <span key={i} style={clip}><Button {...b} size="lg" data-testid={`b${i}`}>Guardar</Button></span>)}
        </div>
      </section>
      <section><p style={label}>IconButton (overflow:hidden)</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {['primary', 'secondary', 'tertiary'].map(v => <span key={v} style={clip}><IconButton variant={v} size="large" icon="Search" ariaLabel="Buscar" data-testid={`i-${v}`} /></span>)}
          <span style={clip}><IconButton variant="secondary" size="large" icon="Search" label="Buscar" data-testid="i-label" /></span>
        </div>
      </section>
      <section><p style={label}>Checkbox (hereda el color de foco)</p>
        <Checkbox label="Acepto" />
      </section>
    </main>
  )
}
