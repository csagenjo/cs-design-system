import { useState } from 'react'
import './tokens.css'
import { StepIndicatorLarge } from './organisms/StepIndicatorLarge'
import { StepIndicatorSmall } from './organisms/StepIndicatorSmall'
import { StepNavigator } from './organisms/StepNavigator'
import { SubstepNavigator } from './organisms/SubstepNavigator'
import { TabItem } from './components/TabItem'
import { TopNavigation } from './organisms/TopNavigation'
import { Headline } from './components/Headline'
import { Tabs } from './organisms/Tabs'

const navItems = [
  { id: 'clientes', label: 'Clientes' },
  {
    id: 'productos', label: 'Productos y servicios',
    flydown: [
      { groupTitle: 'Ahorro', links: [{ label: 'Cuentas y depósitos' }] },
      { groupTitle: 'Financiación', links: [{ label: 'Hipotecas' }, { label: 'Líneas de crédito' }, { label: 'Préstamos' }] },
      { groupTitle: 'Inversión', links: [{ label: 'Asesoramiento' }, { label: 'Broker' }, { label: 'Catálogo productos' }, { label: 'Fondos de inversión' }, { label: 'Planes de pensión' }] },
      { groupTitle: 'Protección', links: [{ label: 'Seguros de Auto' }] },
      { groupTitle: 'Servicios', links: [{ label: 'Anticipo nómina' }, { label: 'Avales' }, { label: 'Domiciliaciones' }, { label: 'Overdraft' }, { label: 'Portabilidad' }] },
      { groupTitle: 'Transversales', links: [{ label: 'Cambios titularidad' }, { label: 'Dual control' }, { label: 'Impagos' }, { label: 'Motor de precios' }] },
      { groupTitle: 'Destacado', featured: { size: '4:3', caption: 'Nueva hipoteca a tipo fijo' } },
    ],
  },
  {
    id: 'organismos', label: 'Organismos Públicos',
    flydown: [
      { links: [
        { label: 'AEAT Impuestos' }, { label: 'AEAT Modelos' }, { label: 'CGPJ Requerimientos' },
        { label: 'Embargos' }, { label: 'Oficios' }, { label: 'Organismos' }, { label: 'Seguridad Social' },
      ] },
    ],
  },
  { id: 'configuracion', label: 'Configuración e informes' },
]

const largeSteps = [
  { state: 'completed', label: 'Datos personales' },
  { state: 'active', number: '2', label: 'Dirección' },
  { state: 'incomplete', number: '3', label: 'Documentación' },
  { state: 'incomplete', number: '4', label: 'Confirmación' },
]

export default function App() {
  const [selectedStep, setSelectedStep] = useState(2)
  const [chapterOpen, setChapterOpen] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h3 style={{ padding: '0 40px' }}>TopNavigation — resize the window to see it collapse</h3>
        <TopNavigation
          logo={<div style={{ fontWeight: 700 }}>Logo</div>}
          menuItems={navItems}
          onExit={() => alert('exit')}
        />
      </div>

      <div style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h3>Headline level=1 (responsive — 32px below 1024px, 48px above; always &lt;h1&gt;)</h3>
        <Headline level={1}>Título de página</Headline>
      </div>

      <div>
        <h3>Tabs organism, device="desktop"</h3>
        <Tabs
          device="desktop"
          items={[
            { id: 'a', label: 'Clientes' },
            { id: 'b', label: 'Facturación' },
            { id: 'c', label: 'Organismos Públicos' },
          ]}
          selectedId="b"
          onChange={() => {}}
        />
      </div>

      <div>
        <h3>TabItem device="desktop" (Top Navigation, 16px)</h3>
        <div style={{ display: 'flex' }}>
          <TabItem device="desktop">Clientes</TabItem>
          <TabItem device="desktop" selected>Facturación y servicios</TabItem>
          <TabItem device="desktop">Sistemas de pago</TabItem>
        </div>
      </div>

      <div>
        <h3>StepIndicatorLarge</h3>
        <StepIndicatorLarge steps={largeSteps} />
      </div>

      <div>
        <h3>StepIndicatorSmall</h3>
        <div style={{ border: '1px solid #eee', borderRadius: 8 }}>
          {largeSteps.map((s, i) => (
            <StepIndicatorSmall
              key={i}
              state={s.state}
              number={s.number ?? String(i + 1)}
              step={i + 1}
              total={largeSteps.length}
              label={s.label}
              selected={selectedStep === i + 1}
              onClick={() => setSelectedStep(i + 1)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>StepNavigator + SubstepNavigator</h3>
        <div style={{ border: '1px solid #eee', borderRadius: 8, maxWidth: 320 }}>
          <StepNavigator state="completed" number="1" title="Datos personales" showTopConnector={false} />
          <StepNavigator
            variation="chapter"
            state="active"
            number="2"
            title="Documentación"
            expanded={chapterOpen}
            onToggleExpand={() => setChapterOpen((o) => !o)}
          />
          {chapterOpen && (
            <>
              <SubstepNavigator state="completed" label="DNI / NIE" />
              <SubstepNavigator state="active" label="Justificante de domicilio" />
            </>
          )}
          <StepNavigator state="incomplete" number="3" title="Confirmación" showBottomConnector={false} />
        </div>
      </div>
      </div>
    </div>
  )
}
