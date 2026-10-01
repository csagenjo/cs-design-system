import './tokens.css'
import { IconButton } from './components/IconButton'

/* Banco de pruebas — IconButton: borde por dentro, tamaño = Figma (01/10/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 32, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      {['default', 'accent'].map(t => ['primary', 'secondary', 'tertiary'].map(v => (
        <section key={t + v}><p style={label}>{t} · {v}</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            {['small', 'medium', 'large'].map(s => (
              <IconButton key={s} type={t} variant={v} size={s} icon="Search" ariaLabel="Buscar" data-testid={`${t}-${v}-${s}`} />
            ))}
            {['small', 'medium', 'large'].map(s => (
              <IconButton key={s + 'l'} type={t} variant={v} size={s} icon="Search" label="Buscar" />
            ))}
          </div>
        </section>
      )))}
    </main>
  )
}
