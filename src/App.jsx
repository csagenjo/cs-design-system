import { useState } from 'react'
import './tokens.css'
import { Tabs } from './organisms/Tabs'
import { TabItem } from './components/TabItem'
import { Headline } from './components/Headline'
import { InlineNotification } from './components/InlineNotification'

/* Banco de pruebas — Tabs v2 (29/09/2026): Size S/M/L × Type × Variant Line/Contained. */

const items = [
  { id: 't1', label: 'Tab 1' }, { id: 't2', label: 'Tab 2' }, { id: 't3', label: 'Tab 3' },
  { id: 't4', label: 'Tab 4' }, { id: 't5', label: 'Tab 5' },
]
const many = Array.from({ length: 12 }, (_, i) => ({ id: 'm' + i, label: 'Pestaña ' + (i + 1) }))

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  const [sel, setSel] = useState('t1')
  const [card, setCard] = useState('t1')
  return (
    <main style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32, background: 'var(--ds-bg-page)', minHeight: '100vh' }}>
      {['s', 'm', 'l'].map((size) => (
        <section key={size} data-testid={'line-' + size}>
          <p style={label}>Line · size={size} · fixed</p>
          <Tabs size={size} items={items} selectedId={sel} onChange={setSel} />
        </section>
      ))}

      <section data-testid="scroll" style={{ maxWidth: 420 }}>
        <p style={label}>Line · m · scrollable (12 items)</p>
        <Tabs size="m" type="scrollable" items={many} selectedId="m0" onChange={() => {}} />
      </section>

      <section data-testid="standalone">
        <p style={label}>TabItem suelto</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <TabItem size="s" selected>S seleccionado</TabItem>
          <TabItem size="m" variant="contained">M contained</TabItem>
          <TabItem size="l" variant="contained" selected>L contained sel.</TabItem>
        </div>
      </section>

      {/* Composición tipo "tarjeta con pestañas" (captura de Carol) */}
      <section data-testid="card" style={{ background: 'var(--ds-bg-default)', borderRadius: 8, padding: 16, maxWidth: 820, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
        <Headline level={2} color="primary">H2 Headline text</Headline>
        <p style={{ ...label, fontFamily: 'inherit', margin: '4px 0 16px' }}>Helper text</p>
        <Tabs size="m" type="scrollable" variant="contained" items={items} selectedId={card} onChange={setCard} />
        <div data-testid="panel" style={{ border: '1px solid var(--ds-borderColor-subtle)', padding: 16, minHeight: 120, background: 'var(--ds-bg-default)', color: 'var(--ds-fg-default)' }}>
          Contenido de {card}
        </div>
        <div style={{ marginTop: 16 }}><InlineNotification showTitle={false} showButton={false} message="This is an example of an inline message for notification" /></div>
      </section>
    </main>
  )
}
