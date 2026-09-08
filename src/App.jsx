import { useState } from 'react'
import './tokens.css'
import { Accordion } from './components/Accordion'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const list = { width: 420, display: 'flex', flexDirection: 'column' }

const items = [
  { title: 'Primer título', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.' },
  { title: 'Segundo título', content: 'Otro contenido de ejemplo para el segundo item de la lista.' },
  { title: 'Tercer título (último)', content: 'Este es el último item — debería cerrar con su propio borde inferior.' },
]

export default function App() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div style={page}>
      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Accordion — lista real (isLast en el último)</h2>
        {items.map((item, i) => (
          <Accordion
            key={i}
            title={item.title}
            expanded={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            isLast={i === items.length - 1}
          >
            {item.content}
          </Accordion>
        ))}
      </div>
    </div>
  )
}
