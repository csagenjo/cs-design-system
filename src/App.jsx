import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from './components/Button'
import { ButtonBar } from './organisms/ButtonBar'
import { InputText } from './components/InputText'
import { InputDate } from './components/InputDate'
import { InputDropdown } from './components/InputDropdown'
import { InputStepper } from './components/InputStepper'
import { InputTelephone } from './components/InputTelephone'
import { InputAmount } from './components/InputAmount'
import { Checkbox } from './components/Checkbox'
import { Radio } from './components/Radio'
import { Link } from './components/Link'
import { CTALink } from './components/CTALink'
import { Chip } from './components/Chip'
import { LinkList } from './components/LinkList'

function App() {
  const [choiceA, setChoiceA] = useState(false);
  const [choiceB, setChoiceB] = useState(true);
  const [filterOn, setFilterOn] = useState(true);
  const [filterOff, setFilterOff] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [chips, setChips] = useState(['Madrid', 'Barcelona']);

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>

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
          <InputText label="Helper visible" placeholder="Escribe aquí" helperText="Instrucciones de relleno" />
          <InputText label="Error sin helper" state="error" errorMessage="Campo obligatorio" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Helper + Error (ambos)" state="error" helperText="Instrucciones que siguen visibles" errorMessage="Formato incorrecto" defaultValue="valor inválido" />
          <InputText label="Disabled con helper" state="disabled" helperText="Texto de ayuda" placeholder="No disponible" />
          <InputText label="Read-only" state="read-only" value="Valor no editable" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputText label="Icono izq. subtle" iconLeft="Search" placeholder="Buscar..." />
          <InputText label="Icono izq. primary" iconLeft="Search" iconLeftPrimary placeholder="Buscar..." />
          <InputText label="Icono der." iconRight="Eye" placeholder="Contraseña" type="password" />
          <InputText label="Ambos iconos" iconLeft="Lock" iconRight="Eye" placeholder="Contraseña segura" />
        </div>
      </section>

      {/* InputDate */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT DATE</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputDate label="Default" />
          <InputDate label="Con helper" helperText="Formato: DD/MM/AAAA" />
          <InputDate label="Helper + Error (ambos)" state="error" helperText="Formato: DD/MM/AAAA" errorMessage="Fecha inválida" />
          <InputDate label="Disabled" state="disabled" />
        </div>
      </section>

      {/* InputDropdown */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT DROPDOWN</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputDropdown
            label="País"
            options={[{label:'España',value:'es'},{label:'Francia',value:'fr'},{label:'Alemania',value:'de'}]}
          />
          <InputDropdown
            label="Con helper"
            helperText="Selecciona tu región de residencia"
            options={[{label:'Madrid',value:'mad'},{label:'Barcelona',value:'bcn'},{label:'Valencia',value:'val'}]}
          />
          <InputDropdown
            label="Helper + Error (ambos)"
            state="error"
            helperText="Elige una opción válida"
            errorMessage="Selección obligatoria"
            options={[{label:'Opción A',value:'a'}]}
          />
          <InputDropdown
            label="Disabled"
            state="disabled"
            options={[{label:'Sin opciones',value:'x'}]}
          />
        </div>
      </section>

      {/* InputStepper */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT STEPPER</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputStepper label="Cantidad" defaultValue={1} min={0} max={10} />
          <InputStepper label="Con helper" helperText="Entre 0 y 99 unidades" defaultValue={5} min={0} max={99} />
          <InputStepper label="Helper + Error" state="error" helperText="Mínimo 1 unidad" errorMessage="Cantidad inválida" defaultValue={0} min={1} />
          <InputStepper label="Disabled" state="disabled" defaultValue={3} />
        </div>
      </section>

      {/* InputTelephone */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT TELEPHONE</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputTelephone label="Selectable (default)" flagEmoji="🇪🇸" countryCode="+34" placeholder="600 000 000" />
          <InputTelephone label="Fixed" countryVariant="fixed" flagEmoji="🇬🇧" countryCode="+44" placeholder="07700 000000" />
          <InputTelephone label="Con helper" helperText="Solo para verificación" flagEmoji="🇪🇸" countryCode="+34" />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputTelephone label="Helper + Error" state="error" helperText="Introduce tu móvil" errorMessage="Número inválido" flagEmoji="🇪🇸" countryCode="+34" />
          <InputTelephone label="Disabled" state="disabled" flagEmoji="🇪🇸" countryCode="+34" />
        </div>
      </section>

      {/* InputAmount */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>INPUT AMOUNT</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <InputAmount label="Selectable default" currency="EUR" locale="es-ES" value="" />
          <InputAmount label="Selectable error" state="error" currency="EUR" locale="es-ES" errorMessage="Importe no válido" />
          <InputAmount label="Fixed disabled" state="disabled" currencyVariant="fixed" currency="USD" locale="en-US" value="1,000.00" />
          <InputAmount label="Fixed default" currencyVariant="fixed" currency="GBP" locale="en-GB" value="500.00" />
        </div>
      </section>

      {/* Checkbox */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHECKBOX</p>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Checkbox label="Unselected" />
          <Checkbox label="Selected" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Checkbox label="Error unselected" state="error" errorMessage="Campo obligatorio" />
          <Checkbox label="Error selected" state="error" defaultChecked errorMessage="Campo obligatorio" />
          <Checkbox label="Error indeterminate" state="error" indeterminate errorMessage="Campo obligatorio" />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Checkbox label="Disabled" state="disabled" />
          <Checkbox label="Disabled selected" state="disabled" defaultChecked />
          <Checkbox label="Disabled indeterminate" state="disabled" indeterminate />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Checkbox label="Con description" description="Texto de ayuda" defaultChecked />
          <Checkbox ariaLabel="Seleccionar fila" />
        </div>
      </section>

      {/* Radio Button */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>RADIO BUTTON</p>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Radio label="Unselected" name="radio-default" value="a" />
          <Radio label="Selected" name="radio-default" value="b" defaultChecked />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Radio label="Error unselected" name="radio-error" value="a" state="error" errorMessage="Selecciona una opción" />
          <Radio label="Error selected" name="radio-error" value="b" state="error" defaultChecked errorMessage="Selecciona una opción" />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Radio label="Disabled" name="radio-disabled" value="a" state="disabled" />
          <Radio label="Disabled selected" name="radio-disabled" value="b" state="disabled" defaultChecked />
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Radio ariaLabel="Seleccionar opción A" name="radio-nolabel" value="a" />
          <Radio ariaLabel="Seleccionar opción B" name="radio-nolabel" value="b" defaultChecked />
        </div>
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

      {/* Chip */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHIP — Choice</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip type="choice" label="Unselected" selected={choiceA} onSelectedChange={setChoiceA} />
          <Chip type="choice" label="Selected" selected={choiceB} onSelectedChange={setChoiceB} />
          <Chip type="choice" label="Disabled" disabled />
          <Chip type="choice" label="Disabled selected" disabled selected />
        </div>

        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHIP — Filter Selectable</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip type="filter" variant="selectable" label="Pendiente" selected={filterOff} onSelectedChange={setFilterOff} />
          <Chip type="filter" variant="selectable" label="Activos" selected={filterOn} onSelectedChange={setFilterOn} />
          <Chip type="filter" variant="selectable" label="Disabled" disabled />
          <Chip type="filter" variant="selectable" label="Disabled sel." disabled selected />
        </div>

        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHIP — Filter Dismissible</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {showFilter && (
            <Chip type="filter" variant="dismissible" filterLabel="Ciudad" value="Madrid" onRemove={() => setShowFilter(false)} />
          )}
          <Chip type="filter" variant="dismissible" filterLabel="Fecha" value="01/01/2026" onRemove={() => {}} />
          <Chip type="filter" variant="dismissible" filterLabel="Estado" value="Activo" onRemove={() => {}} disabled />
        </div>

        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>CHIP — Input</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {chips.map((city) => (
            <Chip
              key={city}
              type="input"
              label={city}
              icon={<MapPin />}
              onChipClick={() => alert(`Editar: ${city}`)}
              onRemove={() => setChips((prev) => prev.filter((c) => c !== city))}
            />
          ))}
          <Chip type="input" label="Sin click" onRemove={() => {}} />
          <Chip type="input" label="Disabled" disabled onRemove={() => {}} />
        </div>

      </section>

      {/* LinkList */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p style={{ fontSize: '12px', color: '#9AA1AA', margin: 0 }}>LINK LIST</p>
        <LinkList
          ariaLabel="Navegación de ejemplo"
          gap="md"
          items={[
            { label: 'Inicio',     href: '/' },
            { label: 'Clientes',   href: '/clientes', variant: 'accent' },
            { label: 'Informes',   href: '/informes', emphasis: 'medium' },
            { label: 'Ayuda externa', href: 'https://help.example.com', external: true, rightIcon: true, leftIcon: false },
          ]}
        />
      </section>

    </div>
  )
}

export default App
