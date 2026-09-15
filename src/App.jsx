import { useState } from 'react'
import './tokens.css'
import { PopoverSheet } from './components/PopoverSheet'
import { Button } from './components/Button'
import { Combobox } from './organisms/Combobox'
import { CountryPicker } from './organisms/CountryPicker'
import { InputTelephone } from './components/InputTelephone'
import { CountryFlag } from './components/CountryFlag'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 64, alignItems: 'flex-start' }

const PLACEMENTS = ['top', 'bottom', 'left', 'right']
const POINTERS = ['left', 'center', 'right']

function Cell({ placement, pointer }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ margin: 60 }}>
      <PopoverSheet
        trigger={<Button size="sm" onClick={() => setOpen(o => !o)}>{placement[0]}/{pointer[0]}</Button>}
        open={open}
        placement={placement}
        pointer={pointer}
        ariaLabel={`Ejemplo ${placement} ${pointer}`}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0, fontSize: 13 }}>Placement: <b>{placement}</b></p>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}>Pointer: <b>{pointer}</b></p>
      </PopoverSheet>
    </div>
  )
}

const countries = [
  { value: 'es', label: 'SP | Spain (+34)', flag: 'spain' },
  { value: 'fr', label: 'FR | France (+33)', flag: 'france' },
  { value: 'gb', label: 'UK | United Kingdom (+44)', flag: 'united-kingdom' },
]

export default function App() {
  const [noCloseOpen, setNoCloseOpen] = useState(false)
  const [comboValue, setComboValue] = useState('')
  const [countryValue, setCountryValue] = useState('es')
  const [countryOpen, setCountryOpen] = useState(false)
  const country = countries.find(c => c.value === countryValue)

  return (
    <div style={page}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: 14 }}>PopoverSheet — 12 combinaciones (placement × pointer)</h2>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#666' }}>
          Trigger deliberadamente estrecho (2 letras) para verificar que la flecha "center" apunta a su centro real, no al de la tarjeta (200px). Escape y click-fuera cierran cualquiera.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {PLACEMENTS.map(placement => (
            POINTERS.map(pointer => (
              <Cell key={`${placement}-${pointer}`} placement={placement} pointer={pointer} />
            ))
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>showCloseButton=false (aun así cierra con Escape / click-fuera)</h2>
        <PopoverSheet
          trigger={<Button size="sm" onClick={() => setNoCloseOpen(o => !o)}>Toggle</Button>}
          open={noCloseOpen}
          placement="bottom"
          pointer="left"
          showCloseButton={false}
          ariaLabel="Ejemplo sin botón de cierre"
          onClose={() => setNoCloseOpen(false)}
        >
          <p style={{ margin: 0, fontSize: 13 }}>Sin botón de cierre — el consumidor decide cómo cerrarlo.</p>
        </PopoverSheet>
      </div>

      <div style={{ width: 320 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Sanity check — Combobox / CountryPicker tras migrar a _popoverDismiss</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Combobox
            label="País (Combobox)"
            ariaLabel="País"
            options={[{ value: 'es', label: 'España' }, { value: 'fr', label: 'Francia' }, { value: 'de', label: 'Alemania' }]}
            value={comboValue}
            onChange={setComboValue}
          />
          <div style={{ position: 'relative' }}>
            <InputTelephone
              label="Teléfono (CountryPicker)"
              flag={country ? <CountryFlag country={country.flag} size={20} /> : undefined}
              countryCode={country ? country.label.match(/\(([^)]+)\)/)?.[1] : '+34'}
              onCountryClick={() => setCountryOpen(o => !o)}
              placeholder="600 000 000"
            />
            <CountryPicker
              open={countryOpen}
              countries={countries}
              value={countryValue}
              onChange={setCountryValue}
              onClose={() => setCountryOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
