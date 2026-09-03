import './tokens.css'
import { ProgressBar } from './components/ProgressBar'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'flex-start' }
const row = { display: 'flex', flexDirection: 'column', gap: 20, width: 380 }
const colored = { background: '#4BA9C0', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 20, width: 380 }

const values = [0, 20, 50, 80, 100]

export default function App() {
  return (
    <div style={page}>
      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>ProgressBar — variant="default" (sobre bg/page)</h2>
        {values.map((v) => (
          <ProgressBar key={v} value={v} label="Label" helperText={`${v}%`} />
        ))}
      </div>

      <div style={colored}>
        <h2 style={{ margin: 0, fontSize: 14, color: '#fff' }}>ProgressBar — variant="onColor" (sobre superficie teal)</h2>
        {values.map((v) => (
          <ProgressBar key={v} value={v} variant="onColor" label="Label" helperText={`${v}%`} />
        ))}
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>Variantes de visibilidad</h2>
        <ProgressBar value={65} showHelperText={false} label="Solo label" />
        <ProgressBar value={65} showLabel={false} helperText="Solo helper text" />
      </div>
    </div>
  )
}
