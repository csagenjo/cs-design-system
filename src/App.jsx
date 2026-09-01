import './tokens.css'
import { IconButton } from './components/IconButton'

const box = { padding: 24, display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 900 }
const row = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }
const label = { fontSize: 12, color: '#7B8490', width: 90 }

const sizes = ['small', 'medium', 'large']
const variants = ['primary', 'secondary', 'tertiary']

export default function App() {
  return (
    <div style={box}>
      <h2>IconButton — Default</h2>
      {variants.map((variant) => (
        <div key={variant} style={row}>
          <span style={label}>{variant}</span>
          {sizes.map((size) => (
            <IconButton key={size} type="default" variant={variant} size={size} icon="search" ariaLabel="Buscar" />
          ))}
          <IconButton type="default" variant={variant} size="medium" icon="search" ariaLabel="Buscar" disabled />
        </div>
      ))}

      <h2>IconButton — Accent</h2>
      {variants.map((variant) => (
        <div key={variant} style={row}>
          <span style={label}>{variant}</span>
          {sizes.map((size) => (
            <IconButton key={size} type="accent" variant={variant} size={size} icon="plus" ariaLabel="Añadir" />
          ))}
          <IconButton type="accent" variant={variant} size="medium" icon="plus" ariaLabel="Añadir" disabled />
        </div>
      ))}

      <h2>IconButton — con Label</h2>
      <div style={row}>
        <IconButton icon="chevron-down" label="Expandir" onClick={() => {}} />
        <IconButton type="accent" variant="primary" icon="chevron-up" label="Colapsar" onClick={() => {}} />
        <IconButton variant="tertiary" icon="filter" label="Filtrar" onClick={() => {}} />
      </div>
    </div>
  )
}
