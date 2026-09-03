import { useState } from 'react'
import './tokens.css'
import { SegmentedControl } from './components/SegmentedControl'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const row = { display: 'flex', flexDirection: 'column', gap: 12 }

export default function App() {
  const [small, setSmall] = useState(1)
  const [medium, setMedium] = useState(0)
  const [large, setLarge] = useState(2)
  const [many, setMany] = useState(3)

  return (
    <div style={page}>
      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>SegmentedControl — size="small"</h2>
        <SegmentedControl segments={['Día', 'Semana', 'Mes']} selectedIndex={small} onChange={setSmall} size="small" />
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>size="medium"</h2>
        <SegmentedControl segments={['Uno', 'Dos', 'Tres']} selectedIndex={medium} onChange={setMedium} size="medium" />
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>size="large"</h2>
        <SegmentedControl segments={['A', 'B', 'C']} selectedIndex={large} onChange={setLarge} size="large" />
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>Sin límite de 5 (composición real, no enumerado en Figma)</h2>
        <SegmentedControl
          segments={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']}
          selectedIndex={many}
          onChange={setMany}
          size="small"
        />
      </div>
    </div>
  )
}
