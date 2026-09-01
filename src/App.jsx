import { useState } from 'react'
import './tokens.css'
import { Collapsible } from './components/Collapsible'
import { CollapsibleIconButton } from './components/CollapsibleIconButton'

const box = { padding: 24, display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 900 }
const row = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }
const label = { fontSize: 12, color: '#7B8490', width: 90 }

const sizes = ['sm', 'md', 'lg']
const iconSizes = ['small', 'medium', 'large']

export default function App() {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(true)
  const [openIcon1, setOpenIcon1] = useState(false)
  const [openIcon2, setOpenIcon2] = useState(true)

  return (
    <div style={box}>
      <h2>Collapsible — Default</h2>
      <div style={row}>
        <span style={label}>collapsed</span>
        {sizes.map((size) => (
          <Collapsible key={size} size={size} expanded={false} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>expanded</span>
        {sizes.map((size) => (
          <Collapsible key={size} size={size} expanded={true} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>interactive</span>
        <Collapsible expanded={open1} onToggle={() => setOpen1(!open1)} />
      </div>

      <h2>Collapsible — Secondary</h2>
      <div style={row}>
        <span style={label}>collapsed</span>
        {sizes.map((size) => (
          <Collapsible key={size} variant="secondary" size={size} expanded={false} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>expanded</span>
        {sizes.map((size) => (
          <Collapsible key={size} variant="secondary" size={size} expanded={true} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>interactive</span>
        <Collapsible variant="secondary" expanded={open2} onToggle={() => setOpen2(!open2)} />
      </div>

      <h2>CollapsibleIconButton — Default</h2>
      <div style={row}>
        <span style={label}>collapsed</span>
        {iconSizes.map((size) => (
          <CollapsibleIconButton key={size} size={size} expanded={false} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>expanded</span>
        {iconSizes.map((size) => (
          <CollapsibleIconButton key={size} size={size} expanded={true} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>interactive</span>
        <CollapsibleIconButton expanded={openIcon1} onToggle={() => setOpenIcon1(!openIcon1)} />
      </div>

      <h2>CollapsibleIconButton — Secondary</h2>
      <div style={row}>
        <span style={label}>collapsed</span>
        {iconSizes.map((size) => (
          <CollapsibleIconButton key={size} variant="secondary" size={size} expanded={false} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>expanded</span>
        {iconSizes.map((size) => (
          <CollapsibleIconButton key={size} variant="secondary" size={size} expanded={true} />
        ))}
      </div>
      <div style={row}>
        <span style={label}>interactive</span>
        <CollapsibleIconButton variant="secondary" expanded={openIcon2} onToggle={() => setOpenIcon2(!openIcon2)} />
      </div>
    </div>
  )
}
