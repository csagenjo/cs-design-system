import './tokens.css'
import { TopNavigation } from './organisms/TopNavigation'
import { IconButton } from './components/IconButton'
import { Button } from './components/Button'
import { LinkList } from './components/LinkList'

/* Banco de pruebas — spacing fijo + layout responsive (01/10/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  return (
    <main style={{ background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <TopNavigation menuItems={[{ id: 'a', label: 'Inicio', selected: true }, { id: 'b', label: 'Cuentas' }]} />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <section><p style={label}>IconButton large · Button lg</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <IconButton size="large" icon="Search" ariaLabel="Buscar" data-testid="ib-large" />
            <Button size="lg" data-testid="btn-lg">Guardar</Button>
          </div>
        </section>
        <section><p style={label}>LinkList gap lg (spacing-xl)</p>
          <LinkList gap="lg" items={[{ label: 'Uno', href: '#' }, { label: 'Dos', href: '#' }]} />
        </section>
      </div>
    </main>
  )
}
