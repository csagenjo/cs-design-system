import { useState } from 'react'
import './tokens.css'
import { StepIndicatorLarge } from './organisms/StepIndicatorLarge'
import { StepIndicatorSmall } from './organisms/StepIndicatorSmall'
import { StepNavigator } from './organisms/StepNavigator'
import { SubstepNavigator } from './organisms/SubstepNavigator'

const largeSteps = [
  { state: 'completed', label: 'Datos personales' },
  { state: 'active', number: '2', label: 'Dirección' },
  { state: 'incomplete', number: '3', label: 'Documentación' },
  { state: 'incomplete', number: '4', label: 'Confirmación' },
]

export default function App() {
  const [selectedStep, setSelectedStep] = useState(2)
  const [chapterOpen, setChapterOpen] = useState(true)

  return (
    <div style={{ padding: 40, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h3>StepIndicatorLarge</h3>
        <StepIndicatorLarge steps={largeSteps} />
      </div>

      <div>
        <h3>StepIndicatorSmall</h3>
        <div style={{ border: '1px solid #eee', borderRadius: 8 }}>
          {largeSteps.map((s, i) => (
            <StepIndicatorSmall
              key={i}
              state={s.state}
              number={s.number ?? String(i + 1)}
              step={i + 1}
              total={largeSteps.length}
              label={s.label}
              selected={selectedStep === i + 1}
              onClick={() => setSelectedStep(i + 1)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>StepNavigator + SubstepNavigator</h3>
        <div style={{ border: '1px solid #eee', borderRadius: 8, maxWidth: 320 }}>
          <StepNavigator state="completed" number="1" title="Datos personales" showTopConnector={false} />
          <StepNavigator
            variation="chapter"
            state="active"
            number="2"
            title="Documentación"
            expanded={chapterOpen}
            onToggleExpand={() => setChapterOpen((o) => !o)}
          />
          {chapterOpen && (
            <>
              <SubstepNavigator state="completed" label="DNI / NIE" />
              <SubstepNavigator state="active" label="Justificante de domicilio" />
            </>
          )}
          <StepNavigator state="incomplete" number="3" title="Confirmación" showBottomConnector={false} />
        </div>
      </div>
    </div>
  )
}
