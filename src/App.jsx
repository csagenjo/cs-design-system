import { useState } from 'react'
import './tokens.css'
import { Button } from './components/Button'
import { IconButton } from './components/IconButton'
import { Tooltip } from './components/Tooltip'
import { PopoverSheet } from './components/PopoverSheet'

/* Banco de pruebas — rest-spread de Button/IconButton (30/09/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 40, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <section><p style={label}>Tooltip + IconButton</p>
        <Tooltip label="Buscar" id="tt-icon"><IconButton icon="Search" ariaLabel="Buscar" data-testid="icon-tt" /></Tooltip>
      </section>
      <section><p style={label}>Tooltip + Button</p>
        <Tooltip label="Guarda los cambios" id="tt-btn"><Button data-testid="btn-tt">Guardar</Button></Tooltip>
      </section>
      <section><p style={label}>PopoverSheet + Button</p>
        <PopoverSheet
          trigger={<Button data-testid="btn-pop" onClick={() => setOpen(true)}>Abrir</Button>}
          open={open} onClose={() => setOpen(false)} ariaLabel="Detalle" id="pop-1">
          <p style={{ margin: 0 }}>Contenido</p>
        </PopoverSheet>
      </section>
      <section><p style={label}>Button iconOnly (ariaLabel) · Button con aria-label vía rest</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <Button iconOnly iconLeft="Search" ariaLabel="Buscar" data-testid="btn-icon-only" />
          <Button aria-label="Enviar formulario" data-testid="btn-rest-label">Enviar</Button>
          <Button disabled data-testid="btn-disabled" title="No disponible">Deshabilitado</Button>
        </div>
      </section>
    </main>
  )
}
