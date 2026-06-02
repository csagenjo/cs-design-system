import { Checkbox } from './components/Checkbox'

function App() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Checkbox label="Unselected" />
      <Checkbox label="Selected" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Error" state="error" errorMessage="Campo requerido" />
      <Checkbox label="Disabled" state="disabled" />
      <Checkbox label="Con descripción" description="Texto de ayuda" />
      <Checkbox />
    </div>
  )
}

export default App
