import './tokens.css'
import { Tooltip } from './components/Tooltip'
import { IconButton } from './components/IconButton'
import { Button } from './components/Button'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'flex-start' }
const row = { display: 'flex', flexDirection: 'column', gap: 12 }
const grid = { display: 'flex', gap: 48, flexWrap: 'wrap', paddingTop: 24 }
const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }

const placements = ['top', 'bottom', 'left', 'right']

export default function App() {
  return (
    <div style={page}>
      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>Tooltip — 4 placements (icon button trigger)</h2>
        <div style={grid}>
          {placements.map((p) => (
            <div key={p} style={cell}>
              <Tooltip label={`Placement ${p}`} placement={p}>
                <IconButton icon="info" ariaLabel={`Info (${p})`} type="default" variant="tertiary" size="medium" />
              </Tooltip>
              <span style={{ fontSize: 11, color: '#7B8490' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>Tooltip — trigger de texto (Button)</h2>
        <div style={{ paddingTop: 24 }}>
          <Tooltip label="Esta acción es permanente" placement="top">
            <Button variant="negative">Eliminar cuenta</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
