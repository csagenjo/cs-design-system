import { Button } from './components/Button'
import { ButtonBar } from './components/ButtonBar'
import { Input } from './components/Input'
import { Checkbox } from './components/Checkbox'
import { Link } from './components/Link'

function App() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Button */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>BUTTON</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="accent">Accent</Button>
          <Button variant="accent" outline>Accent outline</Button>
          <Button variant="default">Default</Button>
          <Button variant="default" outline>Default outline</Button>
          <Button variant="negative">Negative</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent" disabled>Disabled</Button>
        </div>
      </section>

      {/* Input */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT</p>
        <Input label="Default" placeholder="Escribe aquí" />
        <Input label="Error" state="error" errorMessage="Campo obligatorio" />
        <Input label="Disabled" state="disabled" />
      </section>

      {/* Checkbox */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHECKBOX</p>
        <Checkbox label="Unselected" />
        <Checkbox label="Selected" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Error" state="error" errorMessage="Campo obligatorio" />
        <Checkbox label="Disabled" state="disabled" />
      </section>

      {/* Link */}
      <section style={{ display: 'inline-flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>LINK</p>
        <Link href="/ruta">Default link</Link>
        <Link href="/ruta" variant="accent">Accent link</Link>
        <Link href="/ruta" emphasis="medium">Medium emphasis</Link>
        <Link href="/ruta" size="lg">Large link</Link>
        <Link href="/ruta" rightIcon={false}>Sin icono</Link>
        <Link href="https://ejemplo.com" external>Enlace externo</Link>
      </section>

      {/* ButtonBar */}
      <section>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0, marginBottom: '12px' }}>BUTTON BAR</p>
        <ButtonBar
          variant="form"
          primaryLabel="Guardar"
          cancelLabel="Cancelar"
        />
      </section>

    </div>
  )
}

export default App
