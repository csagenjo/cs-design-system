import { useState, useEffect } from 'react'
import './tokens.css'
import { Button } from './components/Button'
import { IconButton } from './components/IconButton'
import { Checkbox } from './components/Checkbox'

/* Banco de pruebas — foco POR FUERA + color de foco del sistema (08/10/2026).
   Recorre con Tab. Cada control va dentro de un contenedor con overflow:hidden
   y SIN margen: el anillo cabe en el área de foco del propio componente.
   Fila "loading": el átomo LoadingSpinner en el sitio del icono izquierdo. */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }
const clip = { overflow: 'hidden', display: 'inline-flex' }
const row = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }
const btns = [
  { variant: 'default' }, { variant: 'default', outline: true }, { variant: 'accent' },
  { variant: 'accent', outline: true }, { variant: 'ghost' }, { variant: 'negative' },
]
const sizes = ['sm', 'md', 'lg']

export default function App() {
  const [dark, setDark] = useState(false)
  // El modo se aplica en <html>: los tokens de componente se resuelven en :root.
  useEffect(() => { document.documentElement.dataset.mode = dark ? 'dark' : 'light' }, [dark])
  return (
    <main style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <label style={label}><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} /> dark</label>

      {sizes.map(s => (
        <section key={s}><p style={label}>Button size="{s}" (overflow:hidden, sin margen)</p>
          <div style={row}>
            {btns.map((b, i) => <span key={i} style={clip}><Button {...b} size={s} iconLeft="Save">Guardar</Button></span>)}
          </div>
        </section>
      ))}

      <section><p style={label}>Button loading (LoadingSpinner color="current")</p>
        <div style={row}>
          {btns.map((b, i) => <span key={i} style={clip}><Button {...b} size="md" loading>Guardando</Button></span>)}
        </div>
        <div style={{ ...row, marginTop: 8 }}>
          {sizes.map(s => <span key={s} style={clip}><Button variant="accent" size={s} loading>Guardando</Button></span>)}
        </div>
      </section>

      <section><p style={label}>IconButton (overflow:hidden, sin margen)</p>
        <div style={row}>
          {['primary', 'secondary', 'tertiary'].map(v => <span key={v} style={clip}><IconButton variant={v} size="large" icon="Search" ariaLabel="Buscar" /></span>)}
          {['primary', 'secondary', 'tertiary'].map(v => <span key={'a' + v} style={clip}><IconButton type="accent" variant={v} size="large" icon="Search" ariaLabel="Buscar" /></span>)}
          <span style={clip}><IconButton variant="secondary" size="large" icon="Search" label="Buscar" /></span>
        </div>
      </section>

      <section><p style={label}>Checkbox (hereda el color de foco)</p>
        <Checkbox label="Acepto" />
      </section>
    </main>
  )
}
