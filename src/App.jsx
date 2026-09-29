import './tokens.css'
import { Headline } from './components/Headline'
import { SectionHeader } from './components/SectionHeader'
import { Text } from './components/Text'
import { Button } from './components/Button'
import { InputText } from './components/InputText'
import { Dialog } from './components/Dialog'
import { List } from './components/List'
import { InlineNotification } from './components/InlineNotification'
import { AccordionGroup } from './organisms/AccordionGroup'

/* Banco de pruebas — Device responsive (29/09/2026).
   Mobile-first: <768 Mobile · 768–1023 Tablet · ≥1024 Desktop (tokens.css). */

const mono = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-subtle, #7B8490)' }

function Readout() {
  // lee los valores computados reales para verificar por dato, no por vista
  const cs = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const v = (n) => (cs ? cs.getPropertyValue(n).trim() : '')
  return (
    <p style={mono} data-testid="readout">
      width={typeof window !== 'undefined' ? window.innerWidth : ''} · h1 {v('--ds-fontSize-headline-2xl')}/{v('--ds-lineHeight-headline-2xl')} · spacing xl/2xl/3xl {v('--ds-spacing-xl')}/{v('--ds-spacing-2xl')}/{v('--ds-spacing-3xl')}
    </p>
  )
}

export default function App() {
  return (
    <main style={{ padding: 'var(--ds-spacing-3xl)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-2xl)', background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <Readout />

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-md)' }}>
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <Headline key={l} level={l}>h{l} Título de página responsive</Headline>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-xl)', maxWidth: 560 }}>
        <SectionHeader size="md">Section header md</SectionHeader>
        <Text size={16}>Texto de lectura 16/24 — constante en los tres devices, solo headline, subheadline, title lg/xl y body lg cambian de tamaño.</Text>
        <InputText label="Nombre" placeholder="Escribe aquí" helperText="Helper text" />
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-xl)' }}>
          <Button variant="accent">Guardar</Button>
          <Button variant="default" outline>Cancelar</Button>
        </div>
      </section>

      <section data-testid="grid" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-xl)', maxWidth: 480 }}>
        <AccordionGroup items={[
          { title: 'Accordion colapsado', content: 'Contenido' },
          { title: 'Último item', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
        ]} defaultOpenIndex={1} />
        <List variant="unordered" items={['Primer ítem', 'Segundo ítem', 'Tercer ítem']} />
        <List variant="checkmark" items={['Primer ítem', 'Segundo ítem']} />
        <InlineNotification message="Mensaje de una línea" />
      </section>

      <Dialog header="primary" title="Dialog title" onClose={() => {}} onBack={() => {}}>
        <Text size={16}>El título del header usa title/lg: 22 mobile · 24 tablet/desktop.</Text>
      </Dialog>
    </main>
  )
}
