/* Galería de accesibilidad — SOLO para escaneo automático (axe-core).
   Renderiza cada componente exportado de src/components (salvo _* / flags.js / icons.js)
   y src/organisms con sus variantes y estados representativos, todo estático.
   Cada componente vive en <section data-component="Name"> con su <h2>.
   No es parte de la app: se construye con vite.a11y.config.js → dist-a11y/. */

import React from 'react';

/* ── Capa 1 · components ── */
import { Accordion } from '../components/Accordion';
import { AccountSelector } from '../components/AccountSelector';
import { AccountSelectorInvoker } from '../components/AccountSelectorInvoker';
import { AccountSelectorListItem } from '../components/AccountSelectorListItem';
import { AmountView } from '../components/AmountView';
import { BadgeHighlight } from '../components/BadgeHighlight';
import { BadgeNotification } from '../components/BadgeNotification';
import { Button } from '../components/Button';
import { CTALink } from '../components/CTALink';
import { Card } from '../components/Card';
import { CellData } from '../components/CellData';
import { CellHeader } from '../components/CellHeader';
import { CellMore } from '../components/CellMore';
import { Checkbox } from '../components/Checkbox';
import { Chip } from '../components/Chip';
import { Collapsible } from '../components/Collapsible';
import { CollapsibleIconButton } from '../components/CollapsibleIconButton';
import { CountryFlag } from '../components/CountryFlag';
import { DescriptionText } from '../components/DescriptionText';
import { DetailText } from '../components/DetailText';
import { Dialog } from '../components/Dialog';
import { DialogSimple } from '../components/DialogSimple';
import { Divider } from '../components/Divider';
import { Drawer } from '../components/Drawer';
import { DropZone } from '../components/DropZone';
import { ErrorAndEmptyState } from '../components/ErrorAndEmptyState';
import { Headline } from '../components/Headline';
import { HelperText } from '../components/HelperText';
import { FieldLabel } from '../components/FieldLabel';
import { ValidationMessage } from '../components/ValidationMessage';
import { Icon } from '../components/Icon';
import { IconButton } from '../components/IconButton';
import { Image } from '../components/Image';
import { InlineNotification } from '../components/InlineNotification';
import { InputAmount } from '../components/InputAmount';
import { InputCombobox } from '../components/InputCombobox';
import { InputDate } from '../components/InputDate';
import { InputDropdown } from '../components/InputDropdown';
import { InputStepper } from '../components/InputStepper';
import { InputTelephone } from '../components/InputTelephone';
import { InputText } from '../components/InputText';
import { LabelDescription } from '../components/LabelDescription';
import { Link } from '../components/Link';
import { LinkList } from '../components/LinkList';
import { List } from '../components/List';
import { DocumentItem } from '../components/DocumentItem';
import { ListView } from '../components/ListView';
import { LiveRegion } from '../components/LiveRegion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Node } from '../components/Node';
import { Pagination } from '../components/Pagination';
import { PopoverSheet } from '../components/PopoverSheet';
import { ProgressBar } from '../components/ProgressBar';
import { Radio } from '../components/Radio';
import { RadioGroup } from '../organisms/RadioGroup';
import { CheckboxGroup } from '../organisms/CheckboxGroup';
import { RangeSlider } from '../components/RangeSlider';
import { Scrim } from '../components/Scrim';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { Selector } from '../components/Selector';
import { SelectorInvoker } from '../components/SelectorInvoker';
import { SelectorListItem } from '../components/SelectorListItem';
import { Slider } from '../components/Slider';
import { Snackbar } from '../components/Snackbar';
import { StepHor } from '../components/StepHor';
import { StepVer } from '../components/StepVer';
import { SteppedSlider } from '../components/SteppedSlider';
import { TabItem } from '../components/TabItem';
import { Text } from '../components/Text';
import { Tooltip } from '../components/Tooltip';
import { VisuallyHidden } from '../components/VisuallyHidden';

/* ── Capa 2 · organisms ── */
import { AccordionGroup } from '../organisms/AccordionGroup';
import { ButtonBar } from '../organisms/ButtonBar';
import { CellActions } from '../organisms/CellActions';
import { Combobox } from '../organisms/Combobox';
import { CountryPicker } from '../organisms/CountryPicker';
import { CurrencyPicker } from '../organisms/CurrencyPicker';
import { DescriptionList, DescriptionListItem, DescriptionListAccount } from '../organisms/DescriptionList';
import { FileSelector } from '../organisms/FileSelector';
import { FileUpload } from '../organisms/FileUpload';
import { PageTitle } from '../organisms/PageTitle';
import { SidebarMenu } from '../organisms/SidebarMenu';
import { StepIndicatorLarge } from '../organisms/StepIndicatorLarge';
import { StepIndicatorSmall } from '../organisms/StepIndicatorSmall';
import { StepNavigator } from '../organisms/StepNavigator';
import { SubstepNavigator } from '../organisms/SubstepNavigator';
import { Switch } from '../components/Switch';
import { Table, TableRow } from '../organisms/Table';
import { Tabs, TabPanel } from '../organisms/Tabs';
import { TopNavigation } from '../organisms/TopNavigation';

const noop = () => {};

/* ── Layout helpers (estilos de la galería, no del sistema) ── */
const css = `
.a11y-gallery {
  background: var(--ds-bg-default);
  color: var(--ds-fg-default);
  min-height: 100vh;
  padding: 24px;
  text-align: left;
  box-sizing: border-box;
  font-family: var(--ds-fontFamily-default, var(--sans));
}
.a11y-gallery h1:not(.ds-headline) { font-size: 28px; margin: 0 0 24px; color: var(--ds-fg-default); letter-spacing: 0; }
.a11y-gallery > section {
  border-top: 1px solid var(--ds-borderColor-subtle, currentColor);
  padding: 24px 0;
}
.a11y-gallery > section > h2 {
  font-size: 20px; margin: 0 0 16px; color: var(--ds-fg-default);
  font-family: var(--mono); letter-spacing: 0;
}
.a11y-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
.a11y-col { display: flex; flex-direction: column; gap: 12px; }
.a11y-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
/* Contiene hijos position:fixed/absolute dentro de la sección */
.a11y-contain { position: relative; transform: translateZ(0); overflow: hidden; }
.a11y-onsurface { background: var(--ds-bg-primary); padding: 16px; }
.a11y-inverse { background: var(--ds-bg-inverse); padding: 16px; }
`;

/* Un fallo de render en un componente no tumba la galería entera: la sección
   queda marcada con data-a11y-error y el error sale por consola. */
class SectionBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error(`[a11y-gallery] ${this.props.name} crashed:`, error.message); }
  render() {
    if (this.state.error) return <p data-a11y-error={this.props.name}>Render error: {String(this.state.error.message)}</p>;
    return this.props.children;
  }
}

function Section({ name, children }) {
  return (
    <section data-component={name} aria-labelledby={`sec-${name}`}>
      <h2 id={`sec-${name}`}>{name}</h2>
      <SectionBoundary name={name}>{children}</SectionBoundary>
    </section>
  );
}

/* StepNavigator/SubstepNavigator: eje `appearance` onDefault/onPage (Figma `Style`;
   antes `style` primary/secondary — corregido en A11y-0). */
const stepNavAppearance = (st) => ({ appearance: st });
const substepAppearance = (st) => ({ appearance: st });
const Row = ({ children, style }) => <div className="a11y-row" style={style}>{children}</div>;
const Col = ({ children, style }) => <div className="a11y-col" style={style}>{children}</div>;
const Contain = ({ height, children, style }) => (
  <div className="a11y-contain" style={{ height, ...style }}>{children}</div>
);

const dropdownOptions = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
];
const comboboxOptions = [
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia' },
  { value: 'de', label: 'Alemania' },
];
const countries = [
  { value: 'es', label: 'SP | Spain (+34)', flag: 'spain' },
  { value: 'fr', label: 'FR | France (+33)', flag: 'france' },
  { value: 'gb', label: 'UK | United Kingdom (+44)', flag: 'united-kingdom' },
];
const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];
const sidebarItems = [
  { id: 'cuentas', label: 'Cuentas', children: [
    { id: 'corrientes', label: 'Cuentas corrientes' },
    { id: 'ahorro', label: 'Cuentas de ahorro', children: [
      { id: 'ahorro-1', label: 'Plazo fijo' },
    ] },
  ] },
  { id: 'clientes', label: 'Clientes' },
  { id: 'informes', label: 'Informes' },
];
const sizes3 = ['small', 'medium', 'large'];
const inputStates = ['default', 'error', 'disabled'];
const selectorStates = ['default', 'error', 'disabled', 'readOnly', 'dataHidden'];
const dataSelections = ['single', 'multiple', 'empty'];

export default function Gallery({ mode }) {
  return (
    <main className="a11y-gallery" data-gallery-mode={mode}>
      <style>{css}</style>
      <h1>CS Design System · a11y gallery ({mode})</h1>

      {/* ═══════════ components ═══════════ */}

      <Section name="Accordion">
        <div style={{ maxWidth: 480 }}>
          <Accordion title="Título expandido" expanded onToggle={noop}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Accordion>
          <Accordion title="Título colapsado" expanded={false} onToggle={noop}>Contenido</Accordion>
          <Accordion title="Último item" expanded={false} onToggle={noop} isLast>Contenido</Accordion>
        </div>
      </Section>

      <Section name="AccountSelector">
        <div className="a11y-grid">
          {selectorStates.map((s) => (
            <AccountSelector key={s} label={`Cuenta (${s})`} helperText="Selecciona la cuenta de cargo"
              errorMessage="Selecciona una cuenta" state={s} headerText="Cuenta corriente"
              amount="1.250,00" currency="€" detailText="ES00 0000 0000 0000" onClick={noop} />
          ))}
          <AccountSelector label="Cuentas (multiple)" dataSelection="multiple" selectedCount={3}
            headerText="Cuentas" amount="3.400,00" currency="€" onClick={noop} />
          <AccountSelector label="Cuenta (empty)" dataSelection="empty" headerText="Selecciona una cuenta" onClick={noop} />
          <AccountSelector label="Cuenta negativa" amountType="negative" headerText="Cuenta de crédito"
            amount="-40,00" currency="€" onClick={noop} />
        </div>
      </Section>

      <Section name="AccountSelectorInvoker">
        <div className="a11y-grid">
          {selectorStates.flatMap((s) => dataSelections.map((d) => (
            <AccountSelectorInvoker key={s + d} state={s} dataSelection={d}
              ariaLabel={`Cuenta ${s} ${d}`} headerText="Cuenta corriente" amount="1.250,00"
              currency="€" detailText="ES00 0000" selectedCount={d === 'multiple' ? 2 : undefined} onClick={noop} />
          )))}
          <AccountSelectorInvoker ariaLabel="Cuenta negativa" amountType="negative" amount="-40,00" currency="€" onClick={noop} />
        </div>
      </Section>

      <Section name="AccountSelectorListItem">
        <div className="a11y-grid">
          {['single', 'multiple'].flatMap((d) => [false, true].map((sel) => (
            <AccountSelectorListItem key={d + sel} data={d} selected={sel} onSelectedChange={noop}
              headerText={`Cuenta ${d} ${sel ? 'selected' : 'unselected'}`} amount="1.250,00" currency="€" detailText="ES00 0000" />
          )))}
          {['error', 'disabled', 'dataHidden'].map((s) => (
            <AccountSelectorListItem key={s} state={s} disabled={s === 'disabled'} onSelectedChange={noop}
              headerText={`Cuenta ${s}`} amount="1.250,00" currency="€" detailText="ES00 0000" />
          ))}
          <AccountSelectorListItem amountType="negative" headerText="Cuenta negativa" amount="-40,00" currency="€" onSelectedChange={noop} />
        </div>
      </Section>

      <Section name="AmountView">
        {['neutral', 'emphasis', 'subtle', 'disabled'].map((h) => (
          <Row key={h}>
            {['positive', 'negative'].map((t) => (
              <AmountView key={t} amount={t === 'negative' ? '-40,00' : '1.250,00'} currency="€" highlight={h} type={t} />
            ))}
          </Row>
        ))}
        <Row>
          {['xs', 'sm', 'md', 'lg'].map((s) => <AmountView key={s} amount="99,00" currency="USD" size={s} />)}
          <AmountView amount="99,00" currency="USD" isoPlacement="left" amountWeight="bold" />
        </Row>
      </Section>

      <Section name="BadgeHighlight">
        <Row>
          {['emphasis', 'neutral', 'positive', 'negative'].map((v) => (
            <BadgeHighlight key={v} variant={v} label={v} />
          ))}
          {['emphasis', 'neutral', 'positive', 'negative'].map((v) => (
            <BadgeHighlight key={'i' + v} variant={v} label={`${v} icon`} icon={<Icon name="info" size="2xs" />} />
          ))}
          <BadgeHighlight disabled label="disabled" />
        </Row>
      </Section>

      <Section name="BadgeNotification">
        <Row>
          {['default', 'primary', 'secondary', 'tertiary'].flatMap((c) => ['default', 'expanded'].map((s) => (
            <BadgeNotification key={c + s} color={c} size={s} label={s === 'expanded' ? '99+' : '3'} ariaLabel={`${c} ${s} notificaciones`} />
          )))}
          <BadgeNotification disabled label="3" ariaLabel="disabled notificaciones" />
        </Row>
      </Section>

      <Section name="Button">
        {['accent', 'default'].flatMap((t) => ['primary', 'secondary', 'tertiary'].map((v) => (
          <Row key={t + v}>
            {['sm', 'md', 'lg'].map((s) => <Button key={s} type={t} variant={v} size={s}>{`${t} ${v} ${s}`}</Button>)}
            <Button type={t} variant={v} iconLeft="Download">{`${t} ${v} iconLeft`}</Button>
            <Button type={t} variant={v} iconRight="ArrowRight">{`${t} ${v} iconRight`}</Button>
            <Button type={t} variant={v} loading>{`${t} ${v} loading`}</Button>
            <Button type={t} variant={v} disabled>{`${t} ${v} disabled`}</Button>
          </Row>
        )))}
        <Row>
          <div style={{ width: 320 }}><Button fullWidth>Full width</Button></div>
        </Row>
      </Section>

      <Section name="CTALink">
        {['default', 'accent'].map((v) => (
          <Row key={v}>
            {['low', 'medium', 'high'].map((e) => (
              <CTALink key={e} href="#" variant={v} emphasis={e}>{`CTA ${v} ${e}`}</CTALink>
            ))}
            <CTALink href="https://example.com" variant={v} external>{`Externo ${v}`}</CTALink>
            {['low', 'medium', 'high'].map((e) => (
              <CTALink key={`dis-${e}`} variant={v} emphasis={e} disabled>{`Disabled ${e}`}</CTALink>
            ))}
            {/* Sin href → <button> con aspecto de CTA (A11y-0, audit §D) */}
            {['low', 'medium', 'high'].map((e) => (
              <CTALink key={`btn-${e}`} variant={v} emphasis={e} onClick={noop}>{`Acción ${v} ${e}`}</CTALink>
            ))}
          </Row>
        ))}
      </Section>

      <Section name="Card">
        <Card style={{ padding: 16, maxWidth: 320 }}>
          <Text>Contenido de tarjeta</Text>
        </Card>
      </Section>

      <Section name="CellData">
        <Table ariaLabel="Clientes">
          {['neutral', 'onSurface', 'zebra'].map((s) => (
            <TableRow key={s}>
              <CellData surface={s}>{`García (${s})`}</CellData>
              <CellData surface={s} density="basic">Basic</CellData>
              <CellData surface={s} align="right">1.250,00 €</CellData>
            </TableRow>
          ))}
          <TableRow>
            <CellData lastRow>Total</CellData>
            <CellData lastRow>—</CellData>
            <CellData lastRow align="right">3.750,00 €</CellData>
          </TableRow>
        </Table>
      </Section>

      <Section name="CellHeader">
        <Table ariaLabel="Headers">
          {['neutral', 'onSurface', 'zebra'].map((s) => (
            <TableRow key={s}>
              <CellHeader surface={s}>{`Customer (${s})`}</CellHeader>
              <CellHeader surface={s} onSort={noop}>Name</CellHeader>
              <CellHeader surface={s} border="primary" sortDirection="ascending" onSort={noop}>Date</CellHeader>
              <CellHeader surface={s} density="basic" align="right" sortDirection="descending" onSort={noop}>Amount</CellHeader>
            </TableRow>
          ))}
        </Table>
      </Section>

      <Section name="CellMore">
        <Table ariaLabel="CellMore">
          {['neutral', 'onSurface', 'zebra'].map((s, i) => (
            <TableRow key={s}>
              <CellData surface={s}>{`Row ${s}`}</CellData>
              <CellMore surface={s} onClick={noop} />
              <CellMore surface={s} label="" ariaLabel="More options" onClick={noop} lastRow={i === 2} />
              <CellMore surface={s} density="basic" ariaLabel={`More about ${s}`} onClick={noop} />
              <CellMore surface={s} disabled onClick={noop} />
            </TableRow>
          ))}
        </Table>
      </Section>

      <Section name="Checkbox">
        <Row>
          <Checkbox label="Unchecked" checked={false} onChange={noop} />
          <Checkbox label="Checked" checked onChange={noop} />
          <Checkbox label="Indeterminate" indeterminate checked={false} onChange={noop} />
          <Checkbox label="Error" state="error" checked={false} onChange={noop} />
          <Checkbox label="Error checked" state="error" checked onChange={noop} />
          <Checkbox label="Disabled" state="disabled" checked={false} onChange={noop} />
          <Checkbox label="Disabled checked" state="disabled" checked onChange={noop} />
          <Checkbox ariaLabel="Seleccionar fila 1" checked onChange={noop} />
        </Row>
      </Section>

      <Section name="CheckboxGroup">
        <Row>
          <CheckboxGroup label="Términos y condiciones" values={[]} onChange={noop} required>
            <Checkbox value="accept" label="Acepto los términos" />
          </CheckboxGroup>
          <CheckboxGroup label="Avisos" values={['email']} onChange={noop} required helperText="Elige al menos uno">
            <Checkbox value="email" label="Email" />
            <Checkbox value="sms" label="SMS" />
          </CheckboxGroup>
          <CheckboxGroup label="Canales (error)" values={[]} onChange={noop} state="error" errorMessage="Elige al menos un canal">
            <Checkbox value="web" label="Web" />
            <Checkbox value="app" label="App" />
          </CheckboxGroup>
          <CheckboxGroup label="Disabled" values={['a']} onChange={noop} state="disabled">
            <Checkbox value="a" label="A" />
            <Checkbox value="b" label="B" />
          </CheckboxGroup>
          <CheckboxGroup label="Horizontal" values={[]} onChange={noop} orientation="horizontal">
            <Checkbox value="x" label="X" />
            <Checkbox value="y" label="Y" />
          </CheckboxGroup>
        </Row>
      </Section>

      <Section name="Chip">
        <Row>
          <Chip type="choice" label="Choice" selected={false} onSelectedChange={noop} />
          <Chip type="choice" label="Choice selected" selected onSelectedChange={noop} />
          <Chip type="choice" label="Choice disabled" disabled />
          <Chip type="filter" label="Filter" selected={false} onSelectedChange={noop} />
          <Chip type="filter" label="Filter selected" selected onSelectedChange={noop} />
          <Chip type="filter" variant="dismissible" filterLabel="Estado" value="Activo" onRemove={noop} />
          <Chip type="filter" variant="dismissible" filterLabel="Estado" value="Disabled" disabled onRemove={noop} />
          <Chip type="input" label="Input chip" onRemove={noop} onChipClick={noop} />
          <Chip type="input" label="Input con icono" icon={<Icon name="file-text" size="2xs" />} onRemove={noop} />
          <Chip type="input" label="Input disabled" disabled onRemove={noop} />
        </Row>
      </Section>

      <Section name="Collapsible">
        {['default', 'secondary'].map((v) => (
          <Row key={v}>
            {['sm', 'md', 'lg'].flatMap((s) => [false, true].map((e) => (
              <Collapsible key={s + e} variant={v} size={s} expanded={e} onToggle={noop} />
            )))}
          </Row>
        ))}
        <Row><Collapsible labels={{ expand: 'Ver más', collapse: 'Ver menos' }} expanded onToggle={noop} /></Row>
      </Section>

      <Section name="CollapsibleIconButton">
        {['default', 'secondary'].map((v) => (
          <Row key={v} style={{ paddingTop: 40 }}>
            {sizes3.flatMap((s) => [false, true].map((e) => (
              <CollapsibleIconButton key={s + e} variant={v} size={s} expanded={e} onToggle={noop} />
            )))}
          </Row>
        ))}
      </Section>

      <Section name="CountryFlag">
        <Row>
          {['spain', 'france', 'united-kingdom', 'germany', 'italy', 'portugal'].map((c) => (
            <CountryFlag key={c} country={c} />
          ))}
          <CountryFlag country="spain" size={32} />
        </Row>
      </Section>

      <Section name="DescriptionText">
        <Row>
          {['subtle', 'default', 'disabled'].flatMap((c) => ['14', '16'].map((s) => (
            <DescriptionText key={c + s} color={c} size={s}>{`Description ${c} ${s}`}</DescriptionText>
          )))}
        </Row>
      </Section>

      <Section name="DetailText">
        <Row>
          {['default', 'secondary', 'tertiary', 'disabled'].flatMap((c) => ['14', '16'].map((s) => (
            <DetailText key={c + s} color={c} size={s} icon={<Icon name="phone" size="2xs" />}>{`Detail ${c} ${s}`}</DetailText>
          )))}
          <DetailText showIcon={false}>Sin icono</DetailText>
        </Row>
      </Section>

      <Section name="Dialog">
        <Col>
          {['default', 'primary', 'onPrimary', 'secondary', 'tertiary'].map((h) => (
            <Dialog modal={false} key={h} header={h} title={`Dialog ${h}`} onBack={noop} onClose={noop}
              mainButtonLabel="Accept" secondaryButtonLabel="Cancel" onMainButton={noop} onSecondaryButton={noop}>
              <p>Scrollable content ({h}).</p>
            </Dialog>
          ))}
          {['default', 'primary', 'onPrimary', 'secondary', 'tertiary'].map((h) => (
            <Dialog modal={false} key={`s-${h}`} size="small" header={h} title={`Dialog small ${h}`} onBack={noop} onClose={noop}
              onMainButton={noop} onSecondaryButton={noop}>
              <p>Small header.</p>
            </Dialog>
          ))}
          <Contain height={420} style={{ maxWidth: 720 }}>
            <Dialog modal={false} width="fullScreen" header="default" title="Dialog fullScreen" onClose={noop}
              mainButtonLabel="Accept" secondaryButtonLabel="Cancel" onMainButton={noop} onSecondaryButton={noop}>
              <p>Full screen variant.</p>
            </Dialog>
          </Contain>
          <Dialog modal={false} header="tertiary" title="No back, no close" crossButton={false} showArrow={false} showButtons={false}>
            <p>No buttons.</p>
          </Dialog>
        </Col>
      </Section>

      <Section name="DialogSimple">
        <Row>
          <DialogSimple modal={false} message="Do you want to delete this item?" onClose={noop}
            primaryButtonLabel="Delete" secondaryButtonLabel="Cancel" onPrimaryButton={noop} onSecondaryButton={noop} />
          <DialogSimple modal={false} variant="expanded" title="Confirm operation" message="This action can't be undone."
            primaryButtonLabel="Confirm" secondaryButtonLabel="Cancel" onClose={noop}
            onPrimaryButton={noop} onSecondaryButton={noop} />
          <DialogSimple modal={false} message="No buttons" showButtonBar={false} onClose={noop} />
        </Row>
      </Section>

      <Section name="Divider">
        <div style={{ maxWidth: 480 }}><Divider /></div>
      </Section>

      <Section name="Drawer">
        <Row>
          {['primary', 'secondary'].flatMap((c) => [true, false].map((collapsed) => (
            <Contain key={c + collapsed} height={260} style={{ width: 260 }}>
              <Drawer anchor="left" color={c} dismissable collapsed={collapsed} onToggleCollapse={noop}
                icon={<Icon name="menu" />} expandedIcon={<Icon name="arrow-left" />}>
                <Text>{`Drawer ${c} ${collapsed ? 'collapsed' : 'expanded'}`}</Text>
              </Drawer>
            </Contain>
          )))}
          <Contain height={260} style={{ width: 260 }}>
            <Drawer dismissable={false} icon={<Icon name="wallet" />} iconLabel="Panel fijo">
              <Text>Standard (no dismissable)</Text>
            </Drawer>
          </Contain>
          <Contain height={260} style={{ width: 260 }}>
            <Drawer anchor="left" iconPlacement="end" showDivider={false} dismissable collapsed={false}
              onToggleCollapse={noop} icon={<Icon name="menu" />}>
              <Text>iconPlacement end</Text>
            </Drawer>
          </Contain>
        </Row>
        <Contain height={200}>
          <Drawer anchor="top" dismissable collapsed={false} onToggleCollapse={noop}
            icon={<Icon name="chevron-down" />} expandedIcon={<Icon name="chevron-up" />}>
            <Text>Drawer anchor top expanded</Text>
          </Drawer>
        </Contain>
      </Section>

      <Section name="DropZone">
        <Row>
          <div style={{ width: 288 }}><DropZone onButtonClick={noop} buttonLabel="Choose files" /></div>
          <div style={{ width: 288 }}><DropZone disabled buttonLabel="Choose files" /></div>
        </Row>
      </Section>

      <Section name="ErrorAndEmptyState">
        <Row>
          <Contain height={520} style={{ width: 480 }}>
            <ErrorAndEmptyState modal={false} title="We couldn't load the data" description="Try again in a few minutes."
              onClose={noop} onPrimaryButton={noop} onSecondaryButton={noop} />
          </Contain>
          <ErrorAndEmptyState modal={false} variant="popUp" title="No results" description="Try changing the filters."
            secondaryButton={false} primaryButtonLabel="Retry" onPrimaryButton={noop} onClose={noop} />
          <ErrorAndEmptyState modal={false} variant="popUp" title="No buttons" showButtons={false} onClose={noop} />
        </Row>
      </Section>

      <Section name="Headline">
        <Col>
          {['default', 'primary', 'secondary'].map((c) => (
            <Row key={c}>
              {[1, 2, 3, 4, 5, 6].map((l) => <Headline key={l} level={l} color={c}>{`H${l} ${c}`}</Headline>)}
            </Row>
          ))}
          <div className="a11y-onsurface">
            <Headline level={3} color="onColor">Headline onColor</Headline>
          </div>
          <div>
            {/* level y size separados (v2): etiqueta h3, aspecto 2xl / etiqueta h3, aspecto xs */}
            <Headline level={3} size="2xl">h3 con size 2xl</Headline>
            <Headline level={3} size="xs">h3 con size xs</Headline>
          </div>
        </Col>
      </Section>

      <Section name="FieldLabel">
        <Row>
          <FieldLabel as="p">Label</FieldLabel>
          <FieldLabel as="p" required>Label obligatorio</FieldLabel>
          <FieldLabel as="p" disabled>Label deshabilitado</FieldLabel>
        </Row>
      </Section>

      <Section name="ValidationMessage">
        <Col>
          <ValidationMessage message="This field is required" />
          <ValidationMessage message="A long validation message that wraps onto a second line so the icon stays aligned with the first line of text." />
          <ValidationMessage type="counter" message="12/140" />
        </Col>
      </Section>

      <Section name="HelperText">
        <Row>
          <HelperText>Formato: DD/MM/AAAA</HelperText>
          <HelperText disabled>No disponible</HelperText>
          <HelperText>1-25 de 100</HelperText>
        </Row>
      </Section>

      <Section name="Icon">
        <Row>
          {['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((s) => <Icon key={s} name="search" size={s} />)}
          {['eye', 'calendar', 'plus', 'x', 'check', 'trash', 'edit', 'download', 'info', 'circle-check', 'circle-x', 'menu'].map((n) => (
            <Icon key={n} name={n} />
          ))}
        </Row>
      </Section>

      <Section name="IconButton">
        {['default', 'accent'].map((t) => (
          <Row key={t}>
            {['primary', 'secondary', 'tertiary'].flatMap((v) => sizes3.map((s) => (
              <IconButton key={v + s} type={t} variant={v} size={s} icon="plus" ariaLabel={`Añadir ${t} ${v} ${s}`} onClick={noop} />
            )))}
            {['primary', 'secondary', 'tertiary'].map((v) => (
              <IconButton key={'d' + v} type={t} variant={v} icon="filter" ariaLabel={`Filtrar ${t} ${v} disabled`} disabled />
            ))}
            <IconButton type={t} icon="chevron-down" label="Expandir" onClick={noop} />
            <IconButton type={t} size="large" icon="chevron-down" label="Disabled" disabled />
            <IconButton type={t} icon="plus" ariaLabel={`Add ${t}`} loading />
            <IconButton type={t} variant="primary" icon="plus" label="Add" loading />
          </Row>
        ))}
      </Section>

      <Section name="Image">
        <Row>
          {['1:1', '3:2', '4:3', '16:9'].map((s) => (
            <div key={s} style={{ width: 200 }}><Image size={s} alt="" caption={`Imagen ${s}`} /></div>
          ))}
          <div style={{ width: 120 }}><Image size="1:1" variant="circle" alt="Foto de perfil" showCaption={false} /></div>
        </Row>
      </Section>

      <Section name="InlineNotification">
        {['default', 'borderless', 'simple'].map((st) => (
          <div className="a11y-grid" key={st} style={{ marginBottom: 16 }}>
            {['error', 'success', 'information', 'warning'].map((t) => (
              <InlineNotification key={t} type={t} style={st} title={`${t} ${st}`}
                message="Mensaje de notificación inline" onButtonClick={noop} />
            ))}
          </div>
        ))}
        <div className="a11y-grid">
          <InlineNotification type="warning" style="simple" showTitle={false} message="Revisa este campo" showButton={false} />
          <InlineNotification type="information" title="Solo título" showMessage={false} showButton={false} />
        </div>
      </Section>

      <Section name="InputAmount">
        <div className="a11y-grid">
          {inputStates.map((s) => (
            <InputAmount key={s} label={`Importe ${s}`} state={s} currency="EUR" defaultValue="12,50"
              errorMessage="Introduce un importe válido" onCurrencyClick={noop} />
          ))}
          <InputAmount label="Error en la divisa" state="error" errorField="currency" currency="XYZ" defaultValue="12,50"
            errorMessage="Elige una divisa" onCurrencyClick={noop} />
          <InputAmount label="Importe fixed" currencyVariant="fixed" currency="USD" defaultValue="99,00" />
          <InputAmount label="Importe con helper" helperText="Máximo 10.000 € por operación" currency="EUR" />
        </div>
      </Section>

      <Section name="InputCombobox">
        <div className="a11y-grid" style={{ paddingBottom: 16 }}>
          {inputStates.map((s) => (
            <InputCombobox key={s} label={`Buscar ${s}`} state={s} value="Mad" onValueChange={noop}
              errorMessage="Sin coincidencias" helperText="Escribe para buscar" />
          ))}
          <InputCombobox label="Con autosuggest" value="Mad" autoSuggestText="Madrid" onValueChange={noop} iconLeft="search" />
          {/* Abierto: el átomo no pinta la lista — el consumidor (Combobox) le pasa aria-controls con el id de su listbox */}
          <InputCombobox label="Abierto" value="" placeholder="Buscar país" open onToggleOpen={noop} onValueChange={noop} aria-controls="gal-input-combobox-list" />
          <div id="gal-input-combobox-list" role="listbox" aria-label="Países">
            <div role="option" aria-selected="false">España</div>
          </div>
          <InputCombobox label="Etiquetas (multiple)" multiple value="" onValueChange={noop}
            selectedChips={[{ value: 'es', label: 'España' }, { value: 'fr', label: 'Francia' }]} onRemoveChip={noop} />
        </div>
      </Section>

      <Section name="InputDate">
        <div className="a11y-grid">
          {inputStates.map((s) => (
            <InputDate key={s} label={`Fecha ${s}`} state={s} defaultValue="30/11/2025"
              errorMessage="Fecha inválida" helperText="Formato: DD/MM/AAAA" />
          ))}
          <InputDate label="Fecha vacía" />
        </div>
      </Section>

      <Section name="InputDropdown">
        <div className="a11y-grid">
          {inputStates.map((s) => (
            <InputDropdown key={s} label={`Lista ${s}`} state={s} options={dropdownOptions} defaultValue="a"
              errorMessage="Selecciona una opción" helperText="Elige una" />
          ))}
          <InputDropdown label="Lista con placeholder" options={dropdownOptions} />
        </div>
      </Section>

      <Section name="InputStepper">
        <div className="a11y-grid">
          {[...inputStates, 'read-only'].map((s) => (
            <InputStepper key={s} label={`Cantidad ${s}`} state={s} defaultValue={3}
              errorMessage="Cantidad inválida" helperText="Entre 0 y 10" min={0} max={10} />
          ))}
          <InputStepper label="En el mínimo" defaultValue={0} min={0} max={10} />
        </div>
      </Section>

      <Section name="InputTelephone">
        <div className="a11y-grid">
          {inputStates.map((s) => (
            <InputTelephone key={s} label={`Teléfono ${s}`} state={s} defaultValue="600 000 000"
              errorMessage="Introduce un número válido" onCountryClick={noop} />
          ))}
          <InputTelephone label="Error en el país" state="error" errorField="country" defaultValue="600 000 000"
            errorMessage="Elige un país" onCountryClick={noop} />
          <InputTelephone label="Teléfono fixed" countryVariant="fixed" flagEmoji="🇪🇸" countryCode="+34" />
          <InputTelephone label="Con bandera SVG" flag={<CountryFlag country="united-kingdom" />} countryCode="+44"
            helperText="Usaremos este número solo para verificación" onCountryClick={noop} />
        </div>
      </Section>

      <Section name="InputText">
        <div className="a11y-grid">
          {[...inputStates, 'read-only'].map((s) => (
            <InputText key={s} label={`Texto ${s}`} state={s} defaultValue="Valor" errorMessage="Campo obligatorio"
              helperText="Texto de ayuda" iconLeft="search" iconRight="eye" iconRightPrimary />
          ))}
          <InputText label="Placeholder" placeholder="Escribe aquí" />
          <InputText label="Contraseña" type="password" defaultValue="secreto" iconRight="eye-off" />
          <InputText label="Adaptive (textarea)" adaptive defaultValue={'Línea 1\nLínea 2'} />
          <InputText ariaLabel="Sin label visible" placeholder="Sin label" iconLeft="search" iconLeftPrimary />
          <InputText label="Obligatorio" required placeholder="Con asterisco (A11y-4)" />
        </div>
      </Section>

      <Section name="LabelDescription">
        <Row>
          <LabelDescription label="Documents" description="PDF or JPG, up to 10 MB" />
          <LabelDescription align="right" label="Invoice" description="Upload the receipt as a PDF" />
        </Row>
      </Section>

      <Section name="Link">
        {['default', 'accent'].map((v) => (
          <Row key={v}>
            {['xs', 'sm', 'md', 'lg'].flatMap((s) => ['low', 'medium'].map((e) => (
              <Link key={s + e} href="#" variant={v} size={s} emphasis={e}>{`Link ${v} ${s} ${e}`}</Link>
            )))}
            <Link href="#" variant={v} leftIcon rightIcon={false}>Anterior</Link>
            <Link href="#" variant={v} rightIcon={false}>Sin icono</Link>
            <Link href="https://example.com" variant={v} external>Enlace externo</Link>
            {/* Sin href → <button> con aspecto de enlace (A11y-0, audit §D) */}
            <Link variant={v} onClick={noop}>{`Acción ${v} (sin href)`}</Link>
            <Link href="#" variant={v} current>{`Página actual ${v}`}</Link>
            <Link variant={v} emphasis="medium" leftIcon rightIcon={false} onClick={noop}>{`Acción ${v} con icono`}</Link>
          </Row>
        ))}
      </Section>

      <Section name="LinkList">
        <Row>
          <LinkList ariaLabel="Navegación principal" items={[
            { label: 'Inicio', href: '#' },
            { label: 'Clientes', href: '#', variant: 'accent' },
            { label: 'Informes', href: '#', emphasis: 'medium' },
            { label: 'Ayuda', href: 'https://example.com', external: true },
          ]} />
          <LinkList title="Accesos rápidos" titleLevel={3} gap="lg" items={[
            { label: 'Nueva operación', href: '#', variant: 'accent', emphasis: 'medium' },
            { label: 'Ver historial', href: '#' },
          ]} />
        </Row>
      </Section>

      <Section name="List">
        <Row>
          <List variant="unordered" items={['Uno', 'Dos', 'Tres']} />
          <List variant="ordered" items={[{ number: '1.', content: 'Primero' }, { number: '2.', content: 'Segundo' }]} />
          <List variant="checkmark" items={['Incluido', 'También esto']} />
        </Row>
      </Section>

      <Section name="DocumentItem">
        <Col style={{ width: 288 }}>
          <DocumentItem status="uploading" documentName="invoice.pdf" onRemove={noop} />
          <DocumentItem status="uploaded" documentName="invoice.pdf" onNameChange={noop} onRemove={noop} />
          <DocumentItem status="error" documentName="invoice.pdf" errorMessage="The file is larger than 10 MB" onNameChange={noop} onRemove={noop} />
        </Col>
      </Section>

      <Section name="ListView">
        <Col style={{ maxWidth: 520 }}>
          <ListView header="Jane Doe" descriptionText="Customer 4521" detailText="Since 12/03/2026" leftIcon={<Icon name="file-text" />} onClick={noop} />
          <ListView header="Current account" descriptionText="ES00 0000 0000 0000 0000"
            rightPanelContent={<AmountView amount="1,250.00" currency="EUR" />} divider="fullBottom" onClick={noop} />
          <ListView header="Selected row" selected swapDescription={<Text chevron>See more</Text>} onClick={noop} />
          {['secondary', 'tertiary'].map((c) => (
            <ListView key={c} header={`Detail ${c}`} detailColor={c} divider="partialBottom" onClick={noop} />
          ))}
          <ListView header="All sides" divider="allSides" onClick={noop} />
          <ListView header="Disabled" disabled divider="fullBottom" onClick={noop} />
          <ListView header="No panels" leftPanel={false} rightPanel={false} description={false} detail={false} onClick={noop} />
          <ListView header="Email alerts" control="checkbox" checked onClick={noop} />
          <div role="radiogroup" aria-label="Delivery">
            <ListView header="Standard" control="radio" checked divider="partialBottom" onClick={noop} />
            <ListView header="Express" control="radio" divider="partialBottom" onClick={noop} />
          </div>
          <ListView header="Notifications" control="switch" controlPlacement="right" checked onClick={noop} />
          <ListView header="Notifications off" control="switch" controlPlacement="right" disabled onClick={noop} />
        </Col>
      </Section>

      <Section name="LiveRegion">
        <Col>
          <LiveRegion><p>Región persistente (polite) con contenido visible.</p></LiveRegion>
          <LiveRegion politeness="assertive"><p>Región persistente (assertive) — solo errores que bloquean.</p></LiveRegion>
          <LiveRegion visuallyHidden>Región oculta: solo para lector de pantalla.</LiveRegion>
          <LiveRegion />
        </Col>
      </Section>

      <Section name="LoadingSpinner">
        <Row>
          {['extraSmall', 'small', 'medium', 'large'].map((s) => <LoadingSpinner key={s} size={s} label={`Cargando ${s}`} />)}
          <div className="a11y-onsurface"><LoadingSpinner size="large" color="onColor" label="Guardando" /></div>
          <span style={{ color: 'var(--ds-fg-default)' }}><LoadingSpinner color="current" label="Current" /></span>
        </Row>
      </Section>

      <Section name="Node">
        <Row>
          <Node state="incomplete" number="1" />
          <Node state="active" number="2" />
          <Node state="completed" number="3" />
          <Node state="active" number="12" />
        </Row>
      </Section>

      <Section name="Pagination">
        <Col>
          <Pagination currentPage={1} totalPages={4} onPageChange={noop} ariaLabel="Pagination, primera" />
          <Pagination variant="secondary" currentPage={7} totalPages={20} onPageChange={noop} ariaLabel="Pagination, secondary" />
          <Pagination currentPage={20} totalPages={20} onPageChange={noop} ariaLabel="Pagination, última" />
          <Pagination currentPage={3} totalPages={10} disabled onPageChange={noop} ariaLabel="Pagination, disabled" />
        </Col>
      </Section>

      <Section name="PopoverSheet">
        <Row>
          {['bottom', 'top', 'right', 'left'].map((p) => (
            <Contain key={p} height={300} style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PopoverSheet open placement={p} pointer="center" ariaLabel={`Popover ${p}`} onClose={noop}
                trigger={<Button size="sm" onClick={noop}>{`Abrir ${p}`}</Button>}>
                <Text size="14" weight="regular">{`Contenido ${p}`}</Text>
              </PopoverSheet>
            </Contain>
          ))}
          {['left', 'right'].map((ptr) => (
            <Contain key={ptr} height={220} style={{ width: 460, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 16 }}>
              <PopoverSheet open placement="bottom" pointer={ptr} showCloseButton={ptr === 'left'} ariaLabel={`Popover pointer ${ptr}`}
                onClose={noop} trigger={<Button size="sm" onClick={noop}>{`Pointer ${ptr}`}</Button>}>
                <Text size="14" weight="regular">Contenido</Text>
              </PopoverSheet>
            </Contain>
          ))}
        </Row>
      </Section>

      <Section name="ProgressBar">
        <Col style={{ maxWidth: 480 }}>
          {[0, 20, 50, 80, 100].map((v) => <ProgressBar key={v} value={v} label="Uploading" helperText={`${v}%`} />)}
          <div className="a11y-onsurface"><ProgressBar value={80} variant="onColor" label="Uploading" helperText="80%" /></div>
          <ProgressBar value={100} showLabel={false} showHelperText={false} />
        </Col>
      </Section>

      <Section name="Radio">
        <Row>
          <Radio label="Opción A" name="a11y-grupo" value="a" checked onChange={noop} />
          <Radio label="Opción B" name="a11y-grupo" value="b" checked={false} onChange={noop} />
          <Radio label="Error" name="a11y-err" value="a" state="error" checked={false} onChange={noop} />
          <Radio label="Error checked" name="a11y-err2" value="a" state="error" checked onChange={noop} />
          <Radio label="Disabled" name="a11y-dis" value="c" state="disabled" checked={false} onChange={noop} />
          <Radio label="Disabled checked" name="a11y-dis2" value="c" state="disabled" checked onChange={noop} />
          <Radio ariaLabel="Seleccionar fila 1" showLabel={false} name="a11y-filas" value="1" checked onChange={noop} />
        </Row>
      </Section>

      <Section name="RadioGroup">
        <Row>
          <RadioGroup label="Tipo de cuenta" name="g-rg-1" value="personal" onChange={noop} required helperText="Elige una">
            <Radio value="personal" label="Personal" />
            <Radio value="empresa" label="Empresa" />
          </RadioGroup>
          <RadioGroup label="Frecuencia (error)" name="g-rg-2" value={undefined} onChange={noop} state="error" errorMessage="Elige una frecuencia">
            <Radio value="m" label="Mensual" />
            <Radio value="a" label="Anual" />
          </RadioGroup>
          <RadioGroup label="Disabled" name="g-rg-3" value="a" onChange={noop} state="disabled">
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
          <RadioGroup label="Horizontal" name="g-rg-4" value="s" onChange={noop} orientation="horizontal">
            <Radio value="s" label="Sí" />
            <Radio value="n" label="No" />
          </RadioGroup>
        </Row>
        <div style={{ maxWidth: 420, marginTop: 16 }}>
          <RadioGroup label="Cuenta de cargo (lista)" name="g-rg-5" spacing="none" value="1" onChange={noop}>
            <SelectorListItem headerText="Cuenta nómina" detailText="ES12 3456" selected onSelectedChange={noop} />
            <SelectorListItem headerText="Cuenta ahorro" detailText="ES98 7654" selected={false} onSelectedChange={noop} />
          </RadioGroup>
        </div>
      </Section>

      <Section name="RangeSlider">
        <Col style={{ maxWidth: 480, paddingTop: 48 }}>
          <RangeSlider value={[20, 70]} onChange={noop} ariaLabel="Precio" />
          <RangeSlider value={[20, 70]} onChange={noop} ariaLabel="Precio secondary" variant="secondary" />
          <RangeSlider value={[20, 70]} onChange={noop} ariaLabel="Precio disabled" disabled />
        </Col>
      </Section>

      <Section name="Scrim">
        <Contain height={200} style={{ maxWidth: 480 }}>
          <div style={{ position: 'absolute', inset: 0 }}><Scrim onClick={noop} /></div>
          <div style={{ position: 'relative', padding: 16 }}><Text>Contenido bajo/ sobre scrim</Text></div>
        </Contain>
      </Section>

      <Section name="SectionHeader">
        <Row>
          {['sm', 'md'].flatMap((s) => ['default', 'primary', 'disabled'].flatMap((c) => ['bold', 'regular'].map((w) => (
            <SectionHeader key={s + c + w} level={3} size={s} color={c} weight={w}>{`Sección ${s} ${c} ${w}`}</SectionHeader>
          ))))}
        </Row>
      </Section>

      <Section name="SegmentedControl">
        <Col>
          {sizes3.map((s) => (
            <SegmentedControl key={s} size={s} segments={['Día', 'Semana', 'Mes']} selectedIndex={1} onChange={noop} ariaLabel={`Periodo ${s}`} />
          ))}
          <SegmentedControl segments={['A', 'B', 'C', 'D', 'E', 'F', 'G']} selectedIndex={0} onChange={noop} ariaLabel="Siete segmentos" />
        </Col>
      </Section>

      <Section name="Selector">
        <div className="a11y-grid">
          {selectorStates.map((s) => (
            <Selector key={s} label={`Selector ${s}`} helperText="Elige un elemento" errorMessage="Selecciona un elemento"
              state={s} headerText="Elemento seleccionado" descriptionText="Descripción" detailText="Detalle" onClick={noop} />
          ))}
          <Selector label="Selector multiple" dataSelection="multiple" selectedCount={3} headerText="Elementos" onClick={noop} />
          <Selector label="Selector empty" dataSelection="empty" headerText="Selecciona un elemento" onClick={noop} />
        </div>
      </Section>

      <Section name="SelectorInvoker">
        <div className="a11y-grid">
          {selectorStates.flatMap((s) => dataSelections.map((d) => (
            <SelectorInvoker key={s + d} state={s} dataSelection={d} ariaLabel={`Selector ${s} ${d}`}
              headerText="Header Text" descriptionText="Descripción" detailText="Detalle"
              selectedCount={d === 'multiple' ? 2 : undefined} onClick={noop} />
          )))}
          {['secondary', 'tertiary'].map((e) => (
            <SelectorInvoker key={e} ariaLabel={`Detalle ${e}`} descriptionEmphasis={e} detailText={`Detalle ${e}`} onClick={noop} />
          ))}
        </div>
      </Section>

      <Section name="SelectorListItem">
        <div className="a11y-grid">
          {['single', 'multiple'].flatMap((d) => [false, true].map((sel) => (
            <SelectorListItem key={d + sel} data={d} selected={sel} onSelectedChange={noop}
              headerText={`Item ${d} ${sel ? 'selected' : 'unselected'}`} descriptionText="Descripción" detailText="Detalle" />
          )))}
          {['error', 'disabled', 'dataHidden'].map((s) => (
            <SelectorListItem key={s} state={s} disabled={s === 'disabled'} onSelectedChange={noop}
              headerText={`Item ${s}`} descriptionText="Descripción" detailText="Detalle" />
          ))}
          <SelectorListItem headerText="Sin control" showControl={false} selected icon={<CountryFlag country="spain" />} onClick={noop} />
          <SelectorListItem headerText="Sin icono" icon={null} descriptionEmphasis="tertiary" detailText="Detalle tertiary" onSelectedChange={noop} />
        </div>
      </Section>

      <Section name="Slider">
        <Col style={{ maxWidth: 480, paddingTop: 48 }}>
          <Slider value={40} onChange={noop} ariaLabel="Volumen" />
          <Slider value={40} onChange={noop} ariaLabel="Volumen con iconos"
            iconLeft={<Icon name="minus" size="sm" />} iconRight={<Icon name="plus" size="sm" />} />
          <Slider value={60} onChange={noop} ariaLabel="Progreso secondary" variant="secondary" />
          <Slider value={60} onChange={noop} ariaLabel="Progreso disabled" disabled />
        </Col>
      </Section>

      <Section name="Snackbar">
        <Col>
          <Snackbar message="Changes saved" showAction={false} />
          <Snackbar message="Item deleted" actionLabel="Undo" onAction={noop} />
          <Snackbar length="multi" message="The operation could not be completed. Try again later." actionLabel="Retry" onAction={noop} />
        </Col>
      </Section>

      <Section name="StepHor">
        <Row>
          <div style={{ display: 'flex', width: 480 }}>
            <StepHor state="completed" label="Datos personales" showLeftConnector={false} />
            <StepHor state="active" number="2" label="Dirección" />
            <StepHor state="incomplete" number="3" label="Confirmación" showRightConnector={false} />
          </div>
        </Row>
      </Section>

      <Section name="StepVer">
        <Row>
          <div>
            <StepVer state="completed" showTopConnector={false} />
            <StepVer state="active" number="2" />
            <StepVer state="incomplete" number="3" showBottomConnector={false} />
          </div>
        </Row>
      </Section>

      <Section name="SteppedSlider">
        <Col style={{ maxWidth: 480, paddingTop: 48 }}>
          <SteppedSlider value={50} steps={5} onChange={noop} ariaLabel="Nivel" />
          <SteppedSlider value={33.33} steps={4} onChange={noop} ariaLabel="Nivel secondary" variant="secondary" />
          <SteppedSlider value={75} steps={5} onChange={noop} ariaLabel="Nivel disabled" disabled />
        </Col>
      </Section>

      <Section name="TabItem">
        {['line', 'contained'].map((v) => (
          <div key={v} role="tablist" aria-label={`Tabs ${v}`} className="a11y-row">
            {['s', 'm', 'l'].map((s) => <TabItem key={s} size={s} variant={v} selected={s === 'm'} onClick={noop}>{`Tab ${v} ${s}`}</TabItem>)}
          </div>
        ))}
      </Section>

      <Section name="Text">
        <Row>
          {['default', 'secondary', 'disabled'].flatMap((c) => ['14', '16'].flatMap((s) => ['bold', 'regular'].map((w) => (
            <Text key={c + s + w} color={c} size={s} weight={w}>{`Text ${c} ${s} ${w}`}</Text>
          ))))}
          <Text chevron onClick={noop}>Ver detalle</Text>
          <Text chevron>Chevron sin click</Text>
        </Row>
      </Section>

      <Section name="Tooltip">
        <Row style={{ padding: '56px 96px', gap: 120 }}>
          {['top', 'bottom', 'left', 'right'].map((p) => (
            <Tooltip key={p} label={`Tooltip ${p}`} placement={p} forceVisible>
              <IconButton icon="info" ariaLabel={`Info ${p}`} />
            </Tooltip>
          ))}
          <Tooltip label="Eliminar" placement="top" forceVisible>
            <Button variant="secondary" size="sm">Eliminar</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section name="VisuallyHidden">
        <Row>
          <button type="button"><Icon name="X" size="sm" /><VisuallyHidden>Cerrar</VisuallyHidden></button>
          <p>Texto visible <VisuallyHidden>con contexto extra solo para lector</VisuallyHidden></p>
          <a href="#main"><VisuallyHidden focusable>Saltar al contenido</VisuallyHidden></a>
        </Row>
      </Section>

      {/* ═══════════ organisms ═══════════ */}

      <Section name="AccordionGroup">
        <Col style={{ maxWidth: 520 }}>
          <AccordionGroup defaultOpenIndex={0} items={[
            { title: 'Primer título', content: 'Lorem ipsum dolor sit amet.' },
            { title: 'Segundo título', content: 'Otro contenido.' },
            { title: 'Tercer título', content: 'Y otro más.' },
          ]} />
          <AccordionGroup multiple defaultOpenIndex={1} items={[
            { title: 'Multiple A', content: 'Contenido A' },
            { title: 'Multiple B', content: 'Contenido B' },
          ]} />
        </Col>
      </Section>

      <Section name="ButtonBar">
        <Col>
          <ButtonBar variant="complex" ariaLabel="Step actions"
            notification={<InlineNotification type="error" style="default" showTitle={false} showButton={false} message="Fix the highlighted fields" />}
            onPrev={noop} negativeActions={[{ label: 'Reject', onClick: noop }]} onCancel={noop}
            extraSecondary={[{ label: 'Save draft', onClick: noop }]} primaryLabel="Accept" onPrimary={noop}
            onNext={noop} />
          <ButtonBar variant="complex" onPrev={noop} prevDisabled onCancel={noop} primaryLabel="Confirm" onPrimary={noop}
            onNext={noop} nextDisabled />
          <ButtonBar variant="simple" secondaryLabel="Clear" onSecondary={noop} primaryLabel="Search" onPrimary={noop}
            notification={<InlineNotification type="information" style="default" showTitle={false} showButton={false} message="Showing the last 30 days" />} />
          <ButtonBar variant="form" negativeActions={[{ label: 'Delete', onClick: noop }]}
            onCancel={noop} primaryLabel="Save" onPrimary={noop} primaryLoading />
          <ButtonBar variant="detail" secondaryLabel="Edit" onSecondary={noop} primaryLabel="Send for review" onPrimary={noop} />
          <ButtonBar variant="form" size="md" onCancel={noop} primaryLabel="Medium" onPrimary={noop} />
        </Col>
      </Section>

      <Section name="CellActions">
        <Table ariaLabel="CellActions">
          {['neutral', 'onSurface', 'zebra'].map((s, i) => (
            <TableRow key={s}>
              <CellData surface={s} lastRow={i === 2}>{`Fila ${s}`}</CellData>
              <CellActions surface={s} lastRow={i === 2}>
                <Link href="#" size="sm" rightIcon={false}>Editar</Link>
              </CellActions>
              <CellActions surface={s} align="left" lastRow={i === 2}>
                <Button variant="tertiary" size="sm">Editar</Button>
                <Button variant="tertiary" size="sm">Borrar</Button>
              </CellActions>
            </TableRow>
          ))}
        </Table>
      </Section>

      <Section name="Combobox">
        <div className="a11y-grid">
          <Combobox label="País" ariaLabel="País" options={comboboxOptions} value="" onChange={noop} placeholder="Busca un país" />
          <Combobox label="Etiquetas" multiple options={comboboxOptions} selectedValues={['es', 'fr']} onSelectedValuesChange={noop} />
          <Combobox label="Error" state="error" errorMessage="Selecciona un país" options={comboboxOptions} value="" onChange={noop} />
          <Combobox label="Disabled" state="disabled" options={comboboxOptions} value="es" onChange={noop} />
          <Combobox label="Con helper" helperText="Escribe para filtrar" iconLeft="search" options={comboboxOptions} value="" onChange={noop} />
        </div>
      </Section>

      <Section name="CountryPicker">
        <Contain height={340} style={{ maxWidth: 420 }}>
          <div style={{ position: 'relative' }}>
            <InputTelephone label="Teléfono" flag={<CountryFlag country="spain" />} countryCode="+34" onCountryClick={noop} />
            <CountryPicker open countries={countries} value="es" onChange={noop} onClose={noop} />
          </div>
        </Contain>
      </Section>

      <Section name="CurrencyPicker">
        <Contain height={320} style={{ maxWidth: 420 }}>
          <div style={{ position: 'relative' }}>
            <InputAmount label="Importe" currency="EUR" onCurrencyClick={noop} />
            <CurrencyPicker open currencies={currencies} value="EUR" onChange={noop} onClose={noop} />
          </div>
        </Contain>
      </Section>

      <Section name="DescriptionList">
        <Row>
          {['landscape', 'portrait'].map((o) => (
            <div key={o} style={{ width: 420 }}>
              <DescriptionList orientation={o} title="Customer" titleLevel={3} showEdit onEdit={noop}>
                <DescriptionListItem label="Name">Jane Doe</DescriptionListItem>
                <DescriptionListItem label="Status" labelWeight="bold" showEdit onEdit={noop}>
                  <BadgeHighlight variant="positive" label="Active" />
                </DescriptionListItem>
                <DescriptionListItem label="Website"><Link href="#" rightIcon>Open profile</Link></DescriptionListItem>
                <DescriptionListItem label="Notes" emptyText="Not filled" showEdit onEdit={noop} />
                <DescriptionListItem label="Account" showEdit onEdit={noop}>
                  <DescriptionListAccount icon="wallet" name="Main account" amount="1,289.00" currency="EUR" number="XX71 0961 2345 6769" helperText="Opened in 2019" />
                </DescriptionListItem>
              </DescriptionList>
            </div>
          ))}
        </Row>
      </Section>

      <Section name="FileSelector">
        <Row>
          <div style={{ width: 288 }}>
            <FileSelector buttonLabel="Choose files" files={[
              { id: '1', name: 'invoice.pdf', status: 'uploaded' },
              { id: '2', name: 'contract.pdf', status: 'uploading' },
              { id: '3', name: 'setup.exe', status: 'error', errorMessage: 'Format not supported' },
            ]} onFileNameChange={noop} onFileRemove={noop} onButtonClick={noop} />
          </div>
          <div style={{ width: 288 }}><FileSelector disabled buttonLabel="Choose files" files={[]} onButtonClick={noop} /></div>
        </Row>
      </Section>

      <Section name="FileUpload">
        <Col>
          <div style={{ width: 547 }}>
            <FileUpload layout="wide" label="Documents" description="PDF or JPG, up to 10 MB" buttonLabel="Choose files"
              files={[{ id: '1', name: 'invoice.pdf', status: 'uploaded' }]}
              onFileNameChange={noop} onFileRemove={noop} onButtonClick={noop} />
          </div>
          <div style={{ width: 288 }}>
            <FileUpload layout="stacked" label="Documents" description="PDF or JPG, up to 10 MB" buttonLabel="Choose files"
              files={[
                { id: '1', name: 'invoice.pdf', status: 'uploaded' },
                { id: '2', name: 'contract.pdf', status: 'error', errorMessage: 'Format not supported' },
              ]} onFileNameChange={noop} onFileRemove={noop} onButtonClick={noop} />
          </div>
          <div style={{ width: 288 }}>
            <FileUpload layout="compact" label="Invoice" description="Upload the PDF" buttonLabel="Choose file"
              files={[{ id: '1', name: 'invoice.pdf', status: 'uploaded' }]} onButtonClick={noop} onFileRemove={noop} />
          </div>
          <FileUpload layout="compact" label="Invoice" description="Upload the PDF" buttonLabel="Choose file" files={[]} onButtonClick={noop} />
          <div style={{ width: 288 }}>
            <FileUpload layout="stacked" showLabel={false} buttonLabel="Choose files for the claim" files={[]} onButtonClick={noop} />
          </div>
          <div style={{ width: 547 }}>
            <FileUpload layout="wide" label="Disabled" buttonLabel="Choose files" disabled files={[]} onButtonClick={noop} />
          </div>
        </Col>
      </Section>

      <Section name="PageTitle">
        <Col>
          <PageTitle nav={{ type: 'icon', icon: 'x', ariaLabel: 'Close', onClick: noop }} title="Payment details"
            actions={[
              { icon: 'share', label: 'Share', onClick: noop },
              { icon: 'heart', label: 'Add to favourites', onClick: noop },
              { icon: 'search', label: 'Search', onClick: noop },
            ]} />
          <PageTitle nav={{ type: 'breadcrumb', items: [
            { label: 'Accounts', onClick: noop }, { label: 'Current account', onClick: noop }, { label: 'Payment details' },
          ] }} title="Payment details" actions={[{ icon: 'share', label: 'Share', onClick: noop }, { icon: 'download', label: 'Download', onClick: noop }]} />
          <PageTitle nav={{ type: 'icon', icon: 'arrow-left', ariaLabel: 'Back', onClick: noop }} title="Back with icon" />
          <PageTitle nav={{ type: 'link', label: 'Back', onClick: noop }} title="With link" />
          <PageTitle nav={{ type: 'text', label: 'Step 2 of 3', weight: 'bold' }} title="With bold text" />
          <PageTitle nav={{ type: 'text', label: 'Draft', disabled: true }} title="With disabled text" />
          <PageTitle title="Without nav" />
        </Col>
      </Section>

      <Section name="SidebarMenu">
        <Row>
          <Contain height={420} style={{ width: 300 }}>
            <SidebarMenu title="Gestión de cuentas" items={sidebarItems} selectedId="ahorro-1" onSelect={noop} collapsed={false} onToggleCollapse={noop} />
          </Contain>
          <Contain height={420} style={{ width: 300 }}>
            <SidebarMenu title="Colapsado" items={sidebarItems} selectedId="clientes" onSelect={noop} collapsed onToggleCollapse={noop} />
          </Contain>
        </Row>
      </Section>

      <Section name="StepIndicatorLarge">
        <StepIndicatorLarge steps={[
          { state: 'completed', label: 'Datos personales' },
          { state: 'active', number: '2', label: 'Dirección' },
          { state: 'incomplete', number: '3', label: 'Documentación' },
          { state: 'incomplete', number: '4', label: 'Confirmación' },
        ]} />
      </Section>

      <Section name="StepIndicatorSmall">
        <Col style={{ maxWidth: 360 }}>
          <StepIndicatorSmall state="completed" number="1" step={1} total={4} label="Datos personales" onClick={noop} />
          <StepIndicatorSmall state="active" number="2" step={2} total={4} label="Dirección" selected onClick={noop} />
          <StepIndicatorSmall state="incomplete" number="3" step={3} total={4} label="Confirmación" onClick={noop} />
        </Col>
      </Section>

      <Section name="StepNavigator">
        <Row>
          {['onDefault', 'onPage'].map((st) => (
            <div key={st} style={{ width: 360 }}>
              <StepNavigator {...stepNavAppearance(st)} state="completed" number="1" title={`Completado (${st})`} showTopConnector={false} onClick={noop} />
              <StepNavigator {...stepNavAppearance(st)} state="selected" number="2" title="Seleccionado" onClick={noop} />
              <StepNavigator {...stepNavAppearance(st)} state="active" number="3" title="Activo" onClick={noop} />
              <StepNavigator {...stepNavAppearance(st)} variation="chapter" state="incomplete" number="4" title="Capítulo expandido"
                expanded onToggleExpand={noop} onClick={noop} />
              <SubstepNavigator {...substepAppearance(st)} state="completed" label="Substep completado" onClick={noop} />
              <SubstepNavigator {...substepAppearance(st)} state="active" label="Substep activo" selected onClick={noop} />
              <StepNavigator {...stepNavAppearance(st)} variation="chapter" state="incomplete" number="5" title="Capítulo colapsado"
                expanded={false} onToggleExpand={noop} showBottomConnector={false} onClick={noop} />
            </div>
          ))}
        </Row>
      </Section>

      <Section name="SubstepNavigator">
        <Row>
          {['onDefault', 'onPage'].map((st) => (
            <div key={st} style={{ width: 360 }}>
              {['incomplete', 'active', 'completed'].map((s) => (
                <SubstepNavigator key={s} {...substepAppearance(st)} state={s} label={`Substep ${s} (${st})`} onClick={noop} />
              ))}
              <SubstepNavigator {...substepAppearance(st)} state="active" label="Substep selected" selected onClick={noop} />
            </div>
          ))}
        </Row>
      </Section>

      <Section name="Switch">
        <Col>
          <Switch label="Notifications" checked onChange={noop} />
          <Switch label="Auto-renew" onChange={noop} />
          <Switch label="Read only on" checked state="readOnly" />
          <Switch label="Read only off" state="readOnly" />
          <Switch label="Disabled on" checked state="disabled" />
          <Switch label="Disabled off" state="disabled" />
          <Switch ariaLabel="Dark mode" onChange={noop} />
          <div style={{ maxWidth: 320 }}><Switch label="Full width" fullWidth checked onChange={noop} /></div>
        </Col>
      </Section>

      <Section name="Table">
        <Table ariaLabel="Table">
          <TableRow>
            <CellHeader border="primary" sortDirection="ascending" onSort={noop}>Customer</CellHeader>
            <CellHeader>Estado</CellHeader>
            <CellHeader align="right">Importe</CellHeader>
          </TableRow>
          <TableRow>
            <CellData>García Fernández</CellData>
            <CellData><BadgeHighlight variant="positive" label="Activo" /></CellData>
            <CellData align="right">1.250,00 €</CellData>
          </TableRow>
          <TableRow>
            <CellData surface="zebra">López Martín</CellData>
            <CellData surface="zebra"><BadgeHighlight variant="negative" label="Bloqueado" /></CellData>
            <CellData surface="zebra" align="right">-40,00 €</CellData>
          </TableRow>
          <TableRow>
            <CellData lastRow>Total</CellData>
            <CellData lastRow>—</CellData>
            <CellData lastRow align="right">1.210,00 €</CellData>
          </TableRow>
        </Table>
      </Section>

      <Section name="Tabs">
        <Col>
          {['line', 'contained'].flatMap((v) => ['s', 'm', 'l'].map((s) => (
            <Tabs key={v + s} size={s} variant={v} selectedId="b" onChange={noop} ariaLabel={`Cuenta ${v} ${s}`}
              items={[{ id: 'a', label: `Resumen ${v} ${s}` }, { id: 'b', label: 'Movimientos' }, { id: 'c', label: 'Documentos' }]} />
          )))}
          <div style={{ maxWidth: 420 }}>
            <Tabs size="s" variant="contained" type="scrollable" selectedId="1" onChange={noop} ariaLabel="Meses" items={[
              { id: '1', label: 'Enero' }, { id: '2', label: 'Febrero' }, { id: '3', label: 'Marzo' },
              { id: '4', label: 'Abril' }, { id: '5', label: 'Mayo' }, { id: '6', label: 'Junio' },
            ]} />
          </div>
          {/* Pestañas enlazadas a su panel (A11y-3): id en Tabs + TabPanel */}
          <Tabs id="g-tabs" selectedId="mov" onChange={noop} ariaLabel="Cuenta con paneles"
            items={[{ id: 'res', label: 'Resumen' }, { id: 'mov', label: 'Movimientos' }]} />
          <TabPanel tabsId="g-tabs" itemId="mov">Panel de movimientos</TabPanel>
        </Col>
      </Section>

      <Section name="TopNavigation">
        <Contain height={120}>
          <TopNavigation
            logo={<Text>La Plataforma</Text>}
            exitLabel="Salir"
            onExit={noop}
            menuItems={[
              { id: 'clientes', label: 'Clientes' },
              { id: 'facturacion', label: 'Facturación y servicios', flydown: [
                { groupTitle: 'Facturación', links: [{ label: 'Facturas', onClick: noop }] },
                { groupTitle: 'Sistema de pago', links: [{ label: 'Cobros', onClick: noop }] },
              ] },
              { id: 'informes', label: 'Informes' },
            ]}
          />
        </Contain>
      </Section>
    </main>
  );
}
