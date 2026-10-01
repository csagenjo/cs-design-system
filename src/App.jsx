import './tokens.css'
import { Button } from './components/Button'
import { DialogSimple } from './components/DialogSimple'
import { LoadingSpinner } from './components/LoadingSpinner'

/* Banco de pruebas — Button: alto por token, label = Figma, Loading con LoadingSpinner (01/10/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }
const variants = [
  { variant: 'default' }, { variant: 'default', outline: true },
  { variant: 'accent' }, { variant: 'accent', outline: true },
  { variant: 'ghost' }, { variant: 'negative' },
]

export default function App() {
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 32, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      {['sm', 'md', 'lg'].map(size => (
        <section key={size}><p style={label}>size={size}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {variants.map((v, i) => <Button key={i} {...v} size={size} data-testid={`btn-${size}-${i}`}>Guardar</Button>)}
            {variants.map((v, i) => <Button key={'l' + i} {...v} size={size} loading data-testid={`load-${size}-${i}`}>Guardando</Button>)}
          </div>
        </section>
      ))}
      <section><p style={label}>LoadingSpinner (4 tamaños × primary / onColor)</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {['extraSmall', 'small', 'medium', 'large'].map(s => <LoadingSpinner key={s} size={s} />)}
          <div style={{ background: 'var(--ds-bg-primary)', padding: 8, display: 'flex', gap: 16 }}>
            {['extraSmall', 'small', 'medium', 'large'].map(s => <LoadingSpinner key={s} size={s} color="onColor" />)}
          </div>
        </div>
      </section>
      <section style={{ position: 'relative' }}><p style={label}>DialogSimple default (Button sm)</p>
        <DialogSimple title="Título" description="Descripción" primaryButtonLabel="Aceptar" secondaryButtonLabel="Cancelar" />
      </section>
    </main>
  )
}
