import './tokens.css'
import { LoadingSpinner } from './components/LoadingSpinner'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'flex-start' }
const row = { display: 'flex', flexDirection: 'column', gap: 12 }
const grid = { display: 'flex', gap: 48, alignItems: 'center', paddingTop: 12 }
const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }
const darkBox = { display: 'flex', gap: 48, alignItems: 'center', padding: 24, background: '#050506', borderRadius: 8 }

const sizes = ['extraSmall', 'small', 'medium', 'large']

export default function App() {
  return (
    <div style={page}>
      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>LoadingSpinner — color="primary" (4 tamaños)</h2>
        <div style={grid}>
          {sizes.map((s) => (
            <div key={s} style={cell}>
              <LoadingSpinner size={s} color="primary" />
              <span style={{ fontSize: 11, color: '#7B8490' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>LoadingSpinner — color="onColor" sobre superficie oscura</h2>
        <div style={darkBox}>
          {sizes.map((s) => (
            <div key={s} style={cell}>
              <LoadingSpinner size={s} color="onColor" />
              <span style={{ fontSize: 11, color: '#9AA1AA' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
