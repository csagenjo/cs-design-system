import './tokens.css'
import { InlineNotification } from './components/InlineNotification'

const box = { padding: 24, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 500 }
const row = { display: 'flex', flexDirection: 'column', gap: 12 }

const types = ['error', 'success', 'information', 'warning']
const styles = ['default', 'borderless', 'simple']

export default function App() {
  return (
    <div style={box}>
      {styles.map((style) => (
        <div key={style} style={row}>
          <h2 style={{ margin: 0, fontSize: 14 }}>InlineNotification — {style}</h2>
          {types.map((type) => (
            <InlineNotification
              key={type}
              type={type}
              style={style}
              title={type[0].toUpperCase() + type.slice(1)}
              onButtonClick={() => {}}
            />
          ))}
        </div>
      ))}

      <div style={row}>
        <h2 style={{ margin: 0, fontSize: 14 }}>Variantes de visibilidad</h2>
        <InlineNotification type="success" showButton={false} title="Sin botón" message="Guardado correctamente" />
        <InlineNotification type="warning" showTitle={false} message="Sin título, solo mensaje" />
        <InlineNotification type="information" showMessage={false} title="Solo título, sin mensaje" showButton={false} />
      </div>
    </div>
  )
}
