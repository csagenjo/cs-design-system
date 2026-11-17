import { useState, useEffect, useRef, useId, Children } from 'react'
import './tokens.css'
import './foundations.css'
import { Card } from './components/Card'
import { Headline } from './components/Headline'
import { HelperText } from './components/HelperText'
import { SectionHeader } from './components/SectionHeader'
import { Button } from './components/Button'
import { Checkbox } from './components/Checkbox'
import { Radio } from './components/Radio'
import { CountryFlag } from './components/CountryFlag'
import { InputText } from './components/InputText'
import { InputDropdown } from './components/InputDropdown'
import { InputStepper } from './components/InputStepper'
import { InputTelephone } from './components/InputTelephone'
import { InlineNotification } from './components/InlineNotification'
import { TopNavigation } from './organisms/TopNavigation'
import { SidebarMenu } from './organisms/SidebarMenu'
import { PageTitle } from './organisms/PageTitle'
import { ButtonBar } from './organisms/ButtonBar'
import { RadioGroup } from './organisms/RadioGroup'
import { FileUpload } from './organisms/FileUpload'
import { Tabs, TabPanel } from './organisms/Tabs'

/* Banco de pruebas — paso 4, pasada A (16/11/2026): pipeline Figma MCP sin Code Connect.
   Dos pantallas del alta de proveedor, compuestas solo con átomos y organismos del sistema:
     ?screen=cards → "Supplier form · Cards · Filled" (32924:574)
     ?screen=tabs  → "Supplier form · Tabs · Filled"  (32936:9544)
   En Tabs, "Create supplier" valida: marca los campos, pone el icono de error en las
   pestañas afectadas, resume en la ButtonBar y lleva a la primera pestaña con error. */

const css = `
#root { width: auto; border-inline: 0; }
.ds-sf-page { min-height: 100vh; display: flex; flex-direction: column; background: var(--ds-bg-page); text-align: left; }
.ds-sf-body { flex: 1; display: flex; align-items: stretch; }
.ds-sf-work { flex: 1; min-width: 0; padding: var(--ds-spacing-2xl) var(--ds-spacing-xl); }
.ds-sf-form { display: flex; flex-direction: column; gap: var(--ds-spacing-2xl); padding-inline: var(--ds-spacing-xl); }
.ds-sf-section { display: flex; flex-direction: column; gap: var(--ds-spacing-2xl); padding: var(--ds-spacing-2xl); }
.ds-sf-header { display: flex; flex-direction: column; gap: var(--ds-spacing-md); padding-inline: var(--ds-spacing-xs); }
.ds-sf-fields { display: flex; flex-direction: column; gap: var(--ds-spacing-xl); }
.ds-sf-row { display: flex; gap: var(--ds-layout-gutter); align-items: flex-start; }
.ds-sf-cell { flex: 1 0 0; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
.ds-sf-cell > .ds-input-root--full-width, .ds-sf-cell > fieldset, .ds-sf-cell > div:only-child { align-self: stretch; }
.ds-sf-sub { display: flex; align-items: center; justify-content: space-between; padding-inline: var(--ds-spacing-xs); }
.ds-sf-add { align-self: flex-start; }
.ds-sf-actions { padding: var(--ds-spacing-2xl); }
.ds-sf-dev { display: flex; gap: var(--ds-spacing-xl); align-items: center; padding: var(--ds-spacing-xs) var(--ds-spacing-xl); font-family: monospace; font-size: 12px; color: var(--ds-fg-default); background: var(--ds-bg-default); }
.ds-sf-dev a { color: inherit; }
`

/* ── Datos ───────────────────────────────────────────────────────────── */

const FILLED = {
  internalCode: 'SUP-000184', taxId: 'B12345674', legalName: 'Northwind Office Supplies, S.L.', tradeName: 'Northwind',
  street: 'Calle de la Industria 24, 3º B', postcode: '28108', city: 'Alcobendas', province: 'Madrid', country: 'es',
  phone: '912 345 678', email: 'orders@northwind.example', website: 'www.northwind.example',
  contacts: [
    { key: 1, name: 'Laura Gómez Ruiz', role: 'sales', phone: '600 123 456', email: 'laura.gomez@northwind.example' },
    { key: 2, name: 'Pablo Martín Soto', role: 'accounts', phone: '600 987 654', email: 'pablo.martin@northwind.example' },
  ],
  ledger: '400000184', expense: '600000000', operationType: 'domestic', vatRate: '21', withholding: 0, surcharge: false,
  iban: 'ES91 2100 0418 4502 0005 1332', bic: 'CAIXESBBXXX', holder: 'Northwind Office Supplies, S.L.',
  paymentMethod: 'transfer', paymentTerm: '60', fixedDays: '5, 20', currency: 'EUR', discount: 3, shipping: 'supplier',
}
// Mismos datos con tres fallos, para ver la validación sin tener que borrar nada a mano.
const WITH_MISTAKES = { ...FILLED, taxId: 'B1234567', legalName: '', iban: 'ES91 2100 0418 4502 0005 1333' }

const OPTIONS = {
  country: [{ value: 'es', label: 'Spain' }, { value: 'pt', label: 'Portugal' }, { value: 'fr', label: 'France' }],
  role: [{ value: 'sales', label: 'Sales' }, { value: 'accounts', label: 'Accounts' }, { value: 'logistics', label: 'Logistics' }],
  vatRate: [{ value: '21', label: '21% · Standard' }, { value: '10', label: '10% · Reduced' }, { value: '4', label: '4% · Super-reduced' }, { value: '0', label: '0% · Exempt' }],
  paymentMethod: [{ value: 'transfer', label: 'Bank transfer' }, { value: 'debit', label: 'Direct debit' }, { value: 'card', label: 'Card' }],
  paymentTerm: [{ value: '0', label: 'On receipt' }, { value: '30', label: '30 days' }, { value: '60', label: '60 days' }, { value: '90', label: '90 days' }],
  currency: [{ value: 'EUR', label: 'EUR · Euro' }, { value: 'USD', label: 'USD · US dollar' }, { value: 'GBP', label: 'GBP · Pound sterling' }],
  shipping: [{ value: 'supplier', label: 'Paid by supplier' }, { value: 'buyer', label: 'Paid by us' }],
}

const SECTIONS = [
  { id: 'identification', label: 'Identification' },
  { id: 'contact', label: 'Contact' },
  { id: 'tax', label: 'Tax and accounting' },
  { id: 'bank', label: 'Bank details' },
  { id: 'commercial', label: 'Commercial terms' },
]

/* ── Validación ──────────────────────────────────────────────────────── */

const REQUIRED = {
  identification: ['taxId', 'legalName', 'street', 'postcode', 'city', 'country'],
  tax: ['ledger', 'operationType', 'vatRate'],
  bank: ['iban', 'holder'],
  commercial: ['paymentMethod', 'paymentTerm', 'currency'],
}
const LABELS = {
  taxId: 'tax ID', legalName: 'the legal name', street: 'the street and number', postcode: 'the postcode', city: 'the city',
  country: 'a country', ledger: 'the ledger account', operationType: 'an operation type', vatRate: 'a VAT rate',
  iban: 'the IBAN', holder: 'the account holder', paymentMethod: 'a payment method', paymentTerm: 'a payment term', currency: 'a currency',
}
const isEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
function ibanOk(raw) {
  const s = raw.replace(/\s+/g, '').toUpperCase()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false
  const digits = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => c.charCodeAt(0) - 55)
  let rest = 0
  for (const d of digits) rest = (rest * 10 + Number(d)) % 97
  return rest === 1
}

function validate(v) {
  const e = {} // id de campo → { section, message }
  const add = (section, id, message) => { e[id] = { section, message } }
  for (const [section, ids] of Object.entries(REQUIRED))
    for (const id of ids) if (String(v[id] ?? '').trim() === '') add(section, id, `Enter ${LABELS[id]}.`)
  if (!e.taxId && !/^([A-Z]\d{7}[A-Z0-9]|\d{8}[A-Z])$/i.test(v.taxId.trim())) add('identification', 'taxId', 'Enter a valid tax ID: 9 characters, for example B12345674.')
  if (!e.postcode && v.country === 'es' && !/^\d{5}$/.test(v.postcode.trim())) add('identification', 'postcode', 'Enter a 5-digit postcode.')
  if (!isEmail(v.email)) add('contact', 'email', 'Enter an email like name@company.com.')
  v.contacts.forEach((c, i) => {
    if (!c.name.trim()) add('contact', `c${c.key}-name`, 'Enter the contact’s full name.')
    if (!c.role) add('contact', `c${c.key}-role`, 'Choose a role.')
    if (!isEmail(c.email)) add('contact', `c${c.key}-email`, 'Enter an email like name@company.com.')
  })
  if (!e.iban && !ibanOk(v.iban)) add('bank', 'iban', 'Check the IBAN: the control digits don’t match.')
  return e
}

const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
function summary(errors) {
  const bySection = SECTIONS.map((s) => ({ ...s, n: Object.values(errors).filter((x) => x.section === s.id).length })).filter((s) => s.n)
  const total = bySection.reduce((a, s) => a + s.n, 0)
  const parts = bySection.map((s) => `${s.n} in ${s.label}`)
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]
  return `${NUM[total] ?? total} field${total > 1 ? 's' : ''} need${total > 1 ? '' : 's'} your attention: ${list}.`
}

/* ── Piezas de la pantalla ───────────────────────────────────────────── */

function Section({ title, help, titleId, children }) {
  return (
    <div className="ds-sf-section">
      <div className="ds-sf-header">
        <Headline level={2} size="md" id={titleId}>{title}</Headline>
        <HelperText>{help}</HelperText>
      </div>
      <div className="ds-sf-fields">{children}</div>
    </div>
  )
}
const Row = ({ children }) => (
  <div className="ds-sf-row">{Children.toArray(children).map((c, i) => <div key={i} className="ds-sf-cell">{c}</div>)}</div>
)
const Sub = ({ children, action }) => (
  <div className="ds-sf-sub"><SectionHeader level={3} size="sm">{children}</SectionHeader>{action}</div>
)
const AddButton = ({ children, onClick }) => (
  <div className="ds-sf-add"><Button variant="tertiary" iconLeft="plus" onClick={onClick}>{children}</Button></div>
)

/* Contenido de las 5 secciones: igual en las dos pantallas, solo cambia el contenedor. */
function useSupplierForm(initial) {
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const set = (id, value) => setV((p) => ({ ...p, [id]: value }))
  const setContact = (key, field, value) => setV((p) => ({ ...p, contacts: p.contacts.map((c) => (c.key === key ? { ...c, [field]: value } : c)) }))
  // Tras el primer intento de envío, los errores se recalculan al escribir (desaparecen al corregir).
  useEffect(() => { if (submitted) setErrors(validate(v)) }, [v, submitted])

  const err = (id) => (errors[id] ? { state: 'error', errorMessage: errors[id].message } : {})
  const text = (id, label, extra = {}) => (
    <InputText id={id} label={label} fullWidth value={v[id]} onChange={(e) => set(id, e.target.value)} {...err(id)} {...extra} />
  )
  const drop = (id, label, extra = {}) => (
    <InputDropdown id={id} label={label} fullWidth options={OPTIONS[id]} value={v[id]} onChange={(e) => set(id, e.target.value)} {...err(id)} {...extra} />
  )
  const phone = (id, label, value, onChange) => (
    <InputTelephone id={id} label={label} fullWidth flag={<CountryFlag country="spain" />} countryName="Spain" countryCode="+34"
      onCountryClick={() => {}} value={value} onChange={(e) => onChange(e.target.value)} {...err(id)} />
  )
  const addContact = () => setV((p) => ({ ...p, contacts: [...p.contacts, { key: Math.max(0, ...p.contacts.map((c) => c.key)) + 1, name: '', role: '', phone: '', email: '' }] }))
  const removeContact = (key) => setV((p) => ({ ...p, contacts: p.contacts.filter((c) => c.key !== key) }))

  const content = {
    identification: (
      <>
        <Row>
          {text('internalCode', 'Internal code', { state: 'disabled', helperText: 'Assigned automatically by the system' })}
          {text('taxId', 'Tax ID (NIF / CIF / VAT)', { required: true })}
        </Row>
        <Row>{text('legalName', 'Legal name', { required: true })}</Row>
        <Row>{text('tradeName', 'Trade name')}</Row>
        <Sub>Registered address</Sub>
        <Row>{text('street', 'Street and number', { required: true })}</Row>
        <Row>{text('postcode', 'Postcode', { required: true, inputMode: 'numeric' })}{text('city', 'City', { required: true })}</Row>
        <Row>{text('province', 'Province or state')}{drop('country', 'Country', { required: true })}</Row>
        <AddButton onClick={() => {}}>Add address</AddButton>
      </>
    ),
    contact: (
      <>
        <Row>
          {phone('phone', 'Phone', v.phone, (x) => set('phone', x))}
          {text('email', 'Email', { type: 'email' })}
        </Row>
        <Row>{text('website', 'Website', { type: 'url' })}</Row>
        {v.contacts.map((c, i) => (
          <ContactBlock key={c.key} c={c} i={i} err={err} setContact={setContact} phone={phone}
            onRemove={i > 0 ? () => removeContact(c.key) : undefined} />
        ))}
        <AddButton onClick={addContact}>Add contact</AddButton>
      </>
    ),
    tax: (
      <>
        <Row>
          {text('ledger', 'Ledger account', { required: true, helperText: 'Subaccount of group 400 (suppliers) or 410 (creditors)', inputMode: 'numeric' })}
          {text('expense', 'Default expense account', { helperText: 'Offset account used when booking invoices', inputMode: 'numeric' })}
        </Row>
        <Row>
          <RadioGroup label="Operation type" orientation="horizontal" required value={v.operationType} onChange={(x) => set('operationType', x)}
            {...(errors.operationType ? { state: 'error', errorMessage: errors.operationType.message } : {})}>
            <Radio value="domestic" label="Domestic" />
            <Radio value="intra-eu" label="Intra-EU" />
            <Radio value="import" label="Import" />
            <Radio value="special" label="Special regime" />
          </RadioGroup>
        </Row>
        <Row>
          {drop('vatRate', 'Default VAT rate', { required: true })}
          <InputStepper label="Withholding tax (%)" helperText="Only for self-employed professionals" min={0} max={100}
            value={v.withholding} onChange={(x) => set('withholding', x)} />
        </Row>
        <Row><Checkbox label="Equivalence surcharge applies" checked={v.surcharge} onChange={(e) => set('surcharge', e.target.checked)} /></Row>
      </>
    ),
    bank: (
      <>
        <Row>{text('iban', 'IBAN', { required: true, autoComplete: 'off', spellCheck: false })}</Row>
        <Row>
          {text('bic', 'BIC / SWIFT', { helperText: 'Required for international payments' })}
          {text('holder', 'Account holder', { required: true })}
        </Row>
      </>
    ),
    commercial: (
      <>
        <Row>{drop('paymentMethod', 'Payment method', { required: true })}{drop('paymentTerm', 'Payment term', { required: true })}</Row>
        <Row>{text('fixedDays', 'Fixed payment days', { helperText: 'Days of the month, separated by commas' })}{drop('currency', 'Currency', { required: true })}</Row>
        <Row>
          <InputStepper label="Commercial discount (%)" min={0} max={100} value={v.discount} onChange={(x) => set('discount', x)} />
          {drop('shipping', 'Shipping costs')}
        </Row>
        <Row>
          <FileUpload layout="stacked" label="Attachments"
            description="Bank ownership certificate, tax compliance certificate and signed contracts."
            instruction="Drag & drop your files here" buttonLabel="Choose files" files={[]} onButtonClick={() => {}} />
        </Row>
      </>
    ),
  }

  function submit() {
    const e = validate(v)
    setSubmitted(true)
    setErrors(e)
    return e
  }
  return { content, errors, submitted, submit }
}

function ContactBlock({ c, i, err, setContact, phone, onRemove }) {
  const id = (f) => `c${c.key}-${f}`
  return (
    <>
      <Sub action={onRemove && <Button variant="tertiary" onClick={onRemove} aria-label={`Remove contact person ${i + 1}`}>Remove</Button>}>
        {i === 0 ? 'Contact person' : `Contact person ${i + 1}`}
      </Sub>
      <Row>
        <InputText id={id('name')} label="Full name" required fullWidth value={c.name} onChange={(e) => setContact(c.key, 'name', e.target.value)} {...err(id('name'))} />
        <InputDropdown id={id('role')} label="Role" required fullWidth options={OPTIONS.role} value={c.role} onChange={(e) => setContact(c.key, 'role', e.target.value)} {...err(id('role'))} />
      </Row>
      <Row>
        {phone(id('phone'), 'Direct phone', c.phone, (x) => setContact(c.key, 'phone', x))}
        <InputText id={id('email')} label="Contact email" type="email" fullWidth value={c.email} onChange={(e) => setContact(c.key, 'email', e.target.value)} {...err(id('email'))} />
      </Row>
    </>
  )
}

const HELP = {
  identification: 'Legal details used on invoices and to detect duplicates.',
  contact: 'Channels for purchase orders and queries.',
  tax: 'How the supplier is booked in the ledger.',
  bank: 'Account for transfers and direct debits. It must match the bank ownership certificate.',
  commercial: 'Payment, currency and shipping conditions agreed with the supplier.',
}

/* ── Pantallas ───────────────────────────────────────────────────────── */

function CardsScreen() {
  const { content } = useSupplierForm(FILLED)
  return (
    <form className="ds-sf-form" noValidate onSubmit={(e) => e.preventDefault()}>
      {SECTIONS.map((s) => (
        <Card key={s.id} variant="full" as="section" aria-labelledby={`${s.id}-title`}>
          <Section title={s.label} help={HELP[s.id]} titleId={`${s.id}-title`}>{content[s.id]}</Section>
        </Card>
      ))}
      <Card variant="full">
        <div className="ds-sf-actions">
          <ButtonBar variant="form" negativeActions={[{ label: 'Save draft', onClick: () => {} }]}
            onCancel={() => {}} primaryLabel="Create supplier" onPrimary={() => {}} ariaLabel="Supplier form actions" />
        </div>
      </Card>
    </form>
  )
}

function TabsScreen({ initial }) {
  const { content, errors, submitted, submit } = useSupplierForm(initial)
  const [tab, setTab] = useState('identification')
  const [created, setCreated] = useState(false)
  const pendingFocus = useRef(null)
  const tabsId = useId().replace(/:/g, '')
  const errorCount = Object.keys(errors).length

  // Tras cambiar de pestaña por la validación, el foco va al primer campo con error.
  useEffect(() => {
    if (!pendingFocus.current) return
    // primer campo inválido en el orden de la pantalla (no en el orden de validación)
    const panel = document.querySelector(`#${tabsId}-panel-${pendingFocus.current}`)
    panel?.querySelector('[aria-invalid="true"]')?.focus()
    pendingFocus.current = null
  }, [tab, errors])

  function onCreate() {
    const e = submit()
    const ids = Object.keys(e)
    if (!ids.length) { setCreated(true); return }
    setCreated(false)
    const first = SECTIONS.find((s) => ids.some((id) => e[id].section === s.id))
    pendingFocus.current = first.id
    setTab(first.id)
  }

  const items = SECTIONS.map((s) => ({ ...s, hasError: Object.values(errors).some((x) => x.section === s.id) }))
  const notification = submitted && errorCount > 0
    ? <InlineNotification type="error" style="borderless" showTitle={false} showButton={false} message={summary(errors)} />
    : created
      ? <InlineNotification type="success" style="borderless" showTitle={false} showButton={false} message="Supplier created." />
      : undefined

  return (
    <form className="ds-sf-form" noValidate onSubmit={(e) => { e.preventDefault(); onCreate() }}>
      <Card variant="full">
        <Tabs id={tabsId} size="l" variant="contained" items={items} selectedId={tab} onChange={setTab} ariaLabel="Supplier details" />
        {SECTIONS.map((s) => (
          <TabPanel key={s.id} tabsId={tabsId} itemId={s.id} hidden={s.id !== tab}>
            <Section title={s.label} help={HELP[s.id]}>{content[s.id]}</Section>
          </TabPanel>
        ))}
      </Card>
      <Card variant="full">
        <div className="ds-sf-actions">
          <ButtonBar variant="complex" notification={notification}
            negativeActions={[{ label: 'Delete', onClick: () => {} }]}
            onCancel={() => {}} secondaryLabel="Save draft" onSecondary={() => {}}
            primaryLabel="Create supplier" onPrimary={onCreate} ariaLabel="Supplier form actions" />
        </div>
      </Card>
    </form>
  )
}

/* ── Página ──────────────────────────────────────────────────────────── */

const MENU = ['Suppliers', 'Purchases', 'Invoices', 'Payments', 'Treasury', 'Reports', 'Settings'].map((l) => ({ id: l.toLowerCase(), label: l }))
const SIDEBAR = [
  { id: 'list', label: 'Supplier list' },
  { id: 'new', label: 'New supplier' },
  { id: 'drafts', label: 'Drafts' },
]

export default function App() {
  const params = new URLSearchParams(location.search)
  const screen = params.get('screen') === 'tabs' ? 'tabs' : 'cards'
  const mistakes = params.get('data') !== 'valid'
  const [dark, setDark] = useState(params.get('mode') === 'dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  useEffect(() => { document.documentElement.dataset.mode = dark ? 'dark' : 'light' }, [dark])

  return (
    <div className="ds-sf-page">
      <style>{css}</style>
      <div className="ds-sf-dev">
        <a href="?screen=cards">Cards</a>
        <a href="?screen=tabs">Tabs (with mistakes)</a>
        <a href="?screen=tabs&data=valid">Tabs (valid)</a>
        <label><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> dark</label>
      </div>
      <TopNavigation logo={<span>Logo</span>} menuItems={MENU} selectedId="suppliers" action={{ label: 'Log out', icon: 'log-out', onClick: () => {} }} />
      <div className="ds-sf-body">
        <SidebarMenu title="Suppliers" items={SIDEBAR} selectedId="new" onSelect={() => {}}
          collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((c) => !c)} />
        <main className="ds-sf-work">
          <PageTitle nav={{ type: 'breadcrumb', items: [{ label: 'Suppliers', href: '#' }, { label: 'New supplier' }] }} title="New supplier" />
          {screen === 'tabs' ? <TabsScreen initial={mistakes ? WITH_MISTAKES : FILLED} /> : <CardsScreen />}
        </main>
      </div>
    </div>
  )
}
