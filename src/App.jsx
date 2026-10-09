import { useState, useEffect } from 'react'
import './tokens.css'
import { InputText } from './components/InputText'
import { InputDate } from './components/InputDate'
import { InputDropdown } from './components/InputDropdown'
import { InputStepper } from './components/InputStepper'
import { InputTelephone } from './components/InputTelephone'
import { InputAmount } from './components/InputAmount'
import { InputCombobox } from './components/InputCombobox'

/* Banco de pruebas — tokens InputCommon + átomo Icon en todos los inputs (09/10/2026).
   Cada fila: Default · Error · Disabled. Toggle dark arriba. */

const states = ['default', 'error', 'disabled']
const label = { fontFamily: 'monospace', fontSize: 12, color: 'var(--ds-fg-default)' }

export default function App() {
  const [dark, setDark] = useState(false)
  useEffect(() => { document.documentElement.dataset.mode = dark ? 'dark' : 'light' }, [dark])
  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--ds-bg-default)', minHeight: '100vh' }}>
      <label style={label}><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} /> dark</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 16 }}>
        {states.map(s => <InputText key={'t' + s} label="Texto" state={s} iconLeft="search" iconRight="eye" iconRightPrimary defaultValue="Valor" errorMessage="Error" />)}
        {states.map(s => <InputDate key={'d' + s} label="Fecha" state={s} defaultValue="30/11/2025" errorMessage="Error" />)}
        {states.map(s => <InputDropdown key={'r' + s} label="Lista" state={s} options={[{ value: 'a', label: 'Opción A' }]} errorMessage="Error" />)}
        {states.map(s => <InputStepper key={'s' + s} label="Cantidad" state={s} defaultValue={3} errorMessage="Error" />)}
        {states.map(s => <InputTelephone key={'p' + s} label="Teléfono" state={s} defaultValue="600 000 000" errorMessage="Error" />)}
        {states.map(s => <InputAmount key={'a' + s} label="Importe" state={s} defaultValue="12,50" errorMessage="Error" />)}
        {states.map(s => <InputCombobox key={'c' + s} label="Buscar" state={s} value="Mad" onValueChange={() => {}} errorMessage="Error" />)}
      </div>
    </main>
  )
}
