import { useState } from 'react'
import './tokens.css'
import { Slider } from './components/Slider'
import { RangeSlider } from './components/RangeSlider'
import { SteppedSlider } from './components/SteppedSlider'
import { Icon } from './components/Icon'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const list = { width: 420, display: 'flex', flexDirection: 'column', gap: 24 }

export default function App() {
  const [v1, setV1] = useState(50)
  const [v2, setV2] = useState(50)
  const [v3, setV3] = useState(0)
  const [v4, setV4] = useState(50)
  const [range1, setRange1] = useState([20, 70])
  const [range2, setRange2] = useState([20, 70])
  const [step1, setStep1] = useState(50)
  const [step2, setStep2] = useState(50)

  return (
    <div style={page}>
      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Slider — continuous, primary</h2>
        <Slider value={v1} onChange={setV1} ariaLabel="Volumen" />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Slider — continuous, secondary, con iconos</h2>
        <Slider
          value={v2}
          onChange={setV2}
          ariaLabel="Volumen"
          variant="secondary"
          iconLeft={<Icon name="volume-x" size="sm" />}
          iconRight={<Icon name="volume-2" size="sm" />}
        />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Slider — en 0%</h2>
        <Slider value={v3} onChange={setV3} ariaLabel="Volumen" iconLeft={<Icon name="volume-x" size="sm" />} iconRight={<Icon name="volume-2" size="sm" />} />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Slider — disabled</h2>
        <Slider value={v4} onChange={setV4} ariaLabel="Volumen" disabled />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>RangeSlider — primary</h2>
        <RangeSlider value={range1} onChange={setRange1} />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>RangeSlider — secondary, disabled</h2>
        <RangeSlider value={range2} onChange={setRange2} variant="secondary" disabled />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>SteppedSlider — 5 pasos, primary</h2>
        <SteppedSlider value={step1} steps={5} onChange={setStep1} ariaLabel="Nivel" />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>SteppedSlider — 4 pasos, secondary</h2>
        <SteppedSlider value={step2} steps={4} onChange={setStep2} ariaLabel="Nivel" variant="secondary" />
      </div>
    </div>
  )
}
