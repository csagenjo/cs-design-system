import { useState } from 'react'
import './tokens.css'
import { Combobox } from './organisms/Combobox'
import { Icon } from './components/Icon'

const page = { padding: 80, display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }
const list = { width: 360, display: 'flex', flexDirection: 'column', gap: 24 }

const countries = [
  { value: 'es', label: 'España', description: 'Europa' },
  { value: 'fr', label: 'Francia', description: 'Europa' },
  { value: 'de', label: 'Alemania', description: 'Europa' },
  { value: 'it', label: 'Italia', description: 'Europa' },
  { value: 'pt', label: 'Portugal', description: 'Europa' },
  { value: 'ar', label: 'Argentina', description: 'América' },
  { value: 'ap', label: 'Aruba', description: 'América' },
]

export default function App() {
  const [v1, setV1] = useState('')
  const [v2, setV2] = useState('es')
  const [tags, setTags] = useState(['fr'])
  const [v3, setV3] = useState('')

  return (
    <div style={page}>
      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Combobox — single, vacío</h2>
        <Combobox
          label="País"
          ariaLabel="País"
          placeholder="Busca un país..."
          options={countries}
          value={v1}
          onChange={setV1}
          iconLeft={<Icon name="search" size="sm" />}
          helperText="Escribe para filtrar"
        />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Combobox — single, con valor</h2>
        <Combobox
          label="País"
          ariaLabel="País"
          options={countries}
          value={v2}
          onChange={setV2}
        />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Combobox — multiple (chips)</h2>
        <Combobox
          label="Países"
          ariaLabel="Países"
          multiple
          options={countries}
          selectedValues={tags}
          onSelectedValuesChange={setTags}
        />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Combobox — error</h2>
        <Combobox
          label="País"
          ariaLabel="País"
          options={countries}
          value={v3}
          onChange={setV3}
          state="error"
          errorMessage="Este campo es obligatorio"
        />
      </div>

      <div style={list}>
        <h2 style={{ margin: '0 0 12px', fontSize: 14 }}>Combobox — disabled</h2>
        <Combobox
          label="País"
          ariaLabel="País"
          options={countries}
          value="es"
          state="disabled"
        />
      </div>
    </div>
  )
}
