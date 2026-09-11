import { useState } from 'react'
import './tokens.css'
import { InputTelephone } from './components/InputTelephone'
import { CountryPicker } from './organisms/CountryPicker'
import { CountryFlag } from './components/CountryFlag'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const list = { width: 380, display: 'flex', flexDirection: 'column', gap: 24 }

const countries = [
  { value: 'es', label: 'SP | Spain (+34)', flag: 'spain' },
  { value: 'fr', label: 'FR | France (+33)', flag: 'france' },
  { value: 'gb', label: 'UK | United Kingdom (+44)', flag: 'united-kingdom' },
  { value: 'de', label: 'DE | Germany (+49)', flag: 'germany' },
  { value: 'it', label: 'IT | Italy (+39)', flag: 'italy' },
  { value: 'jp', label: 'JP | Japan (+81)', flag: 'japan' },
  { value: 'br', label: 'BR | Brazil (+55)', flag: 'brazil' },
]

const flagCodes = ['spain', 'france', 'united-kingdom', 'germany', 'italy', 'japan', 'brazil', 'saudi-arabia', 'sri-lanka', 'united-states-of-america']

export default function App() {
  const [value, setValue] = useState('es')
  const [open, setOpen] = useState(false)
  const country = countries.find(c => c.value === value)

  return (
    <div style={page}>
      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Country Picker + InputTelephone</h2>
        <div style={{ position: 'relative' }}>
          <InputTelephone
            label="Teléfono"
            flag={country ? <CountryFlag country={country.flag} size={20} /> : undefined}
            countryCode={country ? country.label.match(/\(([^)]+)\)/)?.[1] : '+34'}
            onCountryClick={() => setOpen(o => !o)}
            placeholder="600 000 000"
          />
          <CountryPicker
            open={open}
            countries={countries}
            value={value}
            onChange={setValue}
            onClose={() => setOpen(false)}
          />
        </div>
        <p style={{ fontSize: 12, color: '#666' }}>Seleccionado: {value}</p>
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>CountryFlag — muestra de banderas</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {flagCodes.map(code => (
            <div key={code} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <CountryFlag country={code} size={32} />
              <span style={{ fontSize: 10 }}>{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
