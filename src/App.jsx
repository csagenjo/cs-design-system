import { useState } from 'react'
import './tokens.css'
import { Slider } from './components/Slider'
import { RangeSlider } from './components/RangeSlider'
import { SteppedSlider } from './components/SteppedSlider'

/* Banco de pruebas — sombra del knob de Slider (29/09/2026). */

const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)', margin: '0 0 8px' }

export default function App() {
  const [a, setA] = useState(40)
  const [r, setR] = useState([20, 70])
  const [s, setS] = useState(50)
  return (
    <main style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 520, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <section data-testid="continuous"><p style={label}>Slider</p><Slider value={a} onChange={setA} /></section>
      <section data-testid="range"><p style={label}>RangeSlider</p><RangeSlider value={r} onChange={setR} /></section>
      <section data-testid="stepped"><p style={label}>SteppedSlider</p><SteppedSlider value={s} steps={5} onChange={setS} /></section>
      <section data-testid="disabled"><p style={label}>Slider disabled</p><Slider value={60} disabled onChange={() => {}} /></section>
    </main>
  )
}
