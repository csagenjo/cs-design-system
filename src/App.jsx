import './tokens.css'
import { AccordionGroup } from './organisms/AccordionGroup'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const list = { width: 420, display: 'flex', flexDirection: 'column' }

const items = [
  { title: 'Primer título', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { title: 'Segundo título', content: 'Otro contenido de ejemplo para el segundo item de la lista.' },
  { title: 'Tercer título', content: 'Este es el último item — su propio borde inferior cierra la lista, sin ningún prop especial.' },
]

export default function App() {
  return (
    <div style={page}>
      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>AccordionGroup — single (por defecto)</h2>
        <AccordionGroup items={items} defaultOpenIndex={0} />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>AccordionGroup — multiple</h2>
        <AccordionGroup items={items} multiple defaultOpenIndex={0} />
      </div>
    </div>
  )
}
