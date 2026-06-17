import { Button } from './components/Button'
import { ButtonBar } from './organisms/ButtonBar'
import { InputText } from './components/InputText'
import { Checkbox } from './components/Checkbox'
import { Link } from './components/Link'
import { CTALink } from './components/CTALink'

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

      {/* InputText */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT TEXT</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Default" placeholder="Escribe aquí" />
          <InputText label="Con helper" placeholder="Escribe aquí" helperText="Texto de ayuda descriptivo" />
          <InputText label="Read-only" state="read-only" value="Valor no editable" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Error" state="error" errorMessage="Campo obligatorio" />
          <InputText label="Error con valor" state="error" defaultValue="valor inválido" errorMessage="Formato incorrecto. Ej: usuario@email.com" />
          <InputText label="Disabled" state="disabled" placeholder="No disponible" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Icono izq. subtle" iconLeft="Search" placeholder="Buscar..." />
          <InputText label="Icono izq. primary" iconLeft="Search" iconLeftPrimary placeholder="Buscar..." />
          <InputText label="Icono der. subtle" iconRight="Eye" placeholder="Contraseña" type="password" />
          <InputText label="Icono der. primary" iconRight="Eye" iconRightPrimary placeholder="Contraseña" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Ambos iconos" iconLeft="Lock" iconRight="Eye" placeholder="Contraseña segura" type="password" />
          <InputText label="Icono + error" state="error" iconLeft="Search" errorMessage="Sin resultados" defaultValue="xk9@##" />
          <InputText label="Adaptive (textarea)" adaptive placeholder="Escribe varias líneas..." helperText="Crece con el contenido" />
        </div>
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

      {/* CTALink */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CTALINK — Low</p>
        <div style={{ display: 'inline-flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <CTALink href="#" emphasis="low">Ver detalle</CTALink>
          <CTALink href="#" emphasis="low" variant="accent">Leer más</CTALink>
          <CTALink emphasis="low" disabled>No disponible</CTALink>
        </div>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CTALINK — Medium</p>
        <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <CTALink href="#">Ver detalle</CTALink>
          <CTALink href="#" variant="accent">Leer más</CTALink>
          <CTALink disabled>No disponible</CTALink>
        </div>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CTALINK — High</p>
        <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <CTALink href="#" emphasis="high">Registrarse</CTALink>
          <CTALink href="#" emphasis="high" variant="accent">Empezar</CTALink>
          <CTALink emphasis="high" disabled>No disponible</CTALink>
        </div>
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
