import { useState } from 'react'
import './tokens.css'
import { InputAmount } from './components/InputAmount'
import { CurrencyPicker } from './organisms/CurrencyPicker'

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CHF', name: 'Swiss Franc' },
]

export default function App() {
  const [currency, setCurrency] = useState('EUR')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [amount, setAmount] = useState('1.234,56')

  return (
    <div style={{ padding: 40, maxWidth: 360 }}>
      <div style={{ position: 'relative' }}>
        <InputAmount
          label="Importe"
          currency={currency}
          value={amount}
          onChange={setAmount}
          onCurrencyClick={() => setPickerOpen((o) => !o)}
        />
        <CurrencyPicker
          open={pickerOpen}
          currencies={currencies}
          value={currency}
          onChange={setCurrency}
          onClose={() => setPickerOpen(false)}
        />
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: '#999' }}>Moneda seleccionada: <b>{currency}</b></p>
    </div>
  )
}
