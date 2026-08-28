import './tokens.css'
import { List } from './components/List'
import { AmountView } from './components/AmountView'
import { Divider } from './components/Divider'
import { SectionHeader } from './components/SectionHeader'
import { BadgeHighlight } from './components/BadgeHighlight'
import { DescriptionList, DescriptionListItem } from './organisms/DescriptionList'
import { Dialog } from './components/Dialog'
import { DialogSimple } from './components/DialogSimple'
import { ErrorAndEmptyState } from './components/ErrorAndEmptyState'
import { Scrim } from './components/Scrim'
import { Selector } from './components/Selector'
import { SelectorListItem } from './components/SelectorListItem'
import { AccountSelector } from './components/AccountSelector'
import { AccountSelectorListItem } from './components/AccountSelectorListItem'
import { Text } from './components/Text'
import { DescriptionText } from './components/DescriptionText'
import { DetailText } from './components/DetailText'
import { ListView } from './components/ListView'
import { ListItem } from './components/ListItem'
import { DropZone } from './components/DropZone'
import { LabelDescription } from './components/LabelDescription'
import { FileSelector } from './organisms/FileSelector'
import { FileUpload } from './organisms/FileUpload'

const box = { padding: 24, display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }
const row = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }
const scrollRow = { display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }
const viewport = { position: 'relative', width: 400, height: 640, border: `1px solid var(--ds-borderColor-subtle)`, overflow: 'hidden', flexShrink: 0 }

export default function App() {
  return (
    <div style={box}>
      <section>
        <SectionHeader color="primary">List</SectionHeader>
        <div style={{ display: 'flex', gap: 48 }}>
          <List variant="unordered" items={['Uno', 'Dos', 'Tres']} />
          <List variant="ordered" items={[
            { number: '1.', content: 'Primero' },
            { number: '2.', content: 'Segundo' },
            { number: 'a.', content: 'Marcador libre' },
          ]} />
          <List variant="checkmark" items={['Incluido', 'También esto']} />
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">AmountView — highlight × type</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: 12, justifyContent: 'start' }}>
          {['neutral', 'emphasis', 'subtle', 'disabled'].map(h => (
            <AmountView key={h + 'p'} amount="1.250,00" currency="€" highlight={h} type="positive" />
          ))}
          {['neutral', 'emphasis', 'subtle', 'disabled'].map(h => (
            <AmountView key={h + 'n'} amount="-40,00" currency="€" highlight={h} type="negative" />
          ))}
        </div>
        <div style={{ ...row, marginTop: 12 }}>
          <AmountView amount="99" currency="USD" size="md" amountWeight="bold" highlight="emphasis" />
          <AmountView amount="99" currency="USD" size="lg" isoPlacement="left" />
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader>SectionHeader sizes / colors / weights</SectionHeader>
        <div style={row}>
          <SectionHeader size="sm">sm bold</SectionHeader>
          <SectionHeader size="md" weight="regular">md regular</SectionHeader>
          <SectionHeader color="primary">primary</SectionHeader>
          <SectionHeader color="disabled">disabled</SectionHeader>
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">Datos del cliente</SectionHeader>
        <DescriptionList orientation="landscape">
          <DescriptionListItem label="Cliente">García Fernández</DescriptionListItem>
          <DescriptionListItem label="Estado" showEdit onEdit={() => alert('edit')}>
            <BadgeHighlight variant="positive" label="Activo" />
          </DescriptionListItem>
          <DescriptionListItem label="Preferencias">
            <List variant="unordered" items={['Notificaciones', 'Newsletter']} />
          </DescriptionListItem>
          <DescriptionListItem label="Saldo" emptyText="Sin datos" />
        </DescriptionList>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">Dialog — header × color (PopUp)</SectionHeader>
        <div style={scrollRow}>
          {['default', 'primary', 'onPrimary', 'secondary', 'tertiary'].map(h => (
            <Dialog key={h} header={h} width="popUp" title="Dialog Title">
              <div style={{ padding: 16 }}>Contenido scrollable del diálogo.</div>
            </Dialog>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader color="primary">Dialog — size small / fullScreen</SectionHeader>
        <div style={row}>
          <Dialog header="secondary" size="small" width="popUp" title="Small header">
            <div style={{ padding: 16 }}>Header 44px.</div>
          </Dialog>
          <div style={viewport}>
            <Dialog header="primary" width="fullScreen" title="Full Screen">
              <div style={{ padding: 16 }}>Sin esquinas ni sombra — ocupa el contenedor.</div>
            </Dialog>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader color="primary">Dialog + Scrim (composición)</SectionHeader>
        <div style={{ ...viewport, width: 560 }}>
          <Scrim />
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)' }}>
            <Dialog header="default" size="small" width="popUp" title="Confirmar">
              <div style={{ padding: 16 }}>El consumidor compone Scrim + Dialog.</div>
            </Dialog>
          </div>
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">DialogSimple</SectionHeader>
        <div style={row}>
          <DialogSimple message="¿Seguro que quieres eliminar este elemento?" />
          <DialogSimple
            variant="expanded"
            title="Confirmar operación"
            message="Esta acción no se puede deshacer."
            primaryButtonLabel="Confirmar"
            secondaryButtonLabel="Cancelar"
          />
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">ErrorAndEmptyState</SectionHeader>
        <div style={row}>
          <div style={viewport}>
            <ErrorAndEmptyState
              title="No se pudo cargar la información"
              description="Inténtalo de nuevo más tarde."
            />
          </div>
          <ErrorAndEmptyState
            variant="popUp"
            title="Sin resultados"
            description="Prueba a cambiar los filtros."
            secondaryButton={false}
            primaryButtonLabel="Reintentar"
          />
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">Selector — refactor DescriptionText/DetailText</SectionHeader>
        <Selector
          label="Cuenta origen"
          headerText="Cuenta corriente"
          descriptionText="Descripción de la cuenta"
          detailText="Here is some detail text"
          helperText="Texto de ayuda"
        />
        <div style={{ ...row, marginTop: 12 }}>
          <SelectorListItem headerText="Selected data" descriptionText="Description" detailText="Here is some detail text" selected />
          <SelectorListItem headerText="Selected data" descriptionText="Description" detailText="Ver más" descriptionEmphasis="secondary" />
          <SelectorListItem headerText="Selected data" descriptionText="Description" detailText="Deshabilitado" disabled />
        </div>
      </section>

      <section>
        <SectionHeader color="primary">AccountSelector — refactor DetailText</SectionHeader>
        <AccountSelector
          label="Cuenta destino"
          headerText="Cuenta ahorro"
          amount="1.250,00"
          currency="€"
          detailText="ES00 0000 0000 0000 0000"
        />
        <AccountSelector
          label="Cuenta destino (disabled)"
          state="disabled"
          headerText="Cuenta ahorro"
          amount="1.250,00"
          currency="€"
          detailText="ES00 0000 0000 0000 0000"
        />
        <div style={{ ...row, marginTop: 12 }}>
          <AccountSelectorListItem headerText="Cuenta" amount="99,00" currency="USD" detailText="Here is some detail text" selected />
          <AccountSelectorListItem headerText="Cuenta" amount="-40,00" currency="€" amountType="negative" detailText="Deshabilitado" disabled />
        </div>
      </section>

      <section>
        <SectionHeader color="primary">Text / DescriptionText / DetailText — átomos nuevos</SectionHeader>
        <div style={row}>
          <Text>Texto</Text>
          <Text color="secondary" weight="regular">Ver más</Text>
          <Text color="disabled">Deshabilitado</Text>
          <Text chevron>Con chevron</Text>
        </div>
        <div style={{ ...row, marginTop: 12 }}>
          <DescriptionText>Description</DescriptionText>
          <DescriptionText color="default">Default</DescriptionText>
          <DescriptionText color="disabled">Disabled</DescriptionText>
        </div>
        <div style={{ ...row, marginTop: 12 }}>
          <DetailText>Here is some detail text</DetailText>
          <DetailText color="secondary">Secondary</DetailText>
          <DetailText color="tertiary">Tertiary</DetailText>
          <DetailText color="disabled">Disabled</DetailText>
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">ListView</SectionHeader>
        <div style={{ maxWidth: 480, border: `1px solid var(--ds-borderColor-subtle)` }}>
          <ListView
            header="García Fernández"
            descriptionText="Cliente nº 4521"
            detailText="Alta: 12/03/2026"
            divider="fullBottom"
          />
          <ListView
            header="Cuenta corriente"
            descriptionText="ES00 0000 0000 0000 0000"
            rightPanelContent={<AmountView amount="1.250,00" currency="€" />}
            divider="fullBottom"
            selected
          />
          <ListView
            header="Fila con chevron"
            swapDescription={<Text chevron>Ver más</Text>}
            detail={false}
            divider="fullBottom"
          />
          <ListView
            header="Deshabilitada"
            descriptionText="Sin acceso"
            detailText="Contacta con soporte"
            disabled
          />
        </div>
      </section>

      <Divider />

      <section>
        <SectionHeader color="primary">ListItem</SectionHeader>
        <div style={{ maxWidth: 400, border: `1px solid var(--ds-borderColor-subtle)` }}>
          <ListItem status="uploading" documentName="factura.pdf" />
          <ListItem status="uploaded" documentName="contrato.pdf" onNameChange={() => {}} onRemove={() => {}} />
          <ListItem status="error" documentName="nomina.pdf" errorMessage="Formato no soportado" onRemove={() => {}} />
        </div>
      </section>

      <section>
        <SectionHeader color="primary">DropZone</SectionHeader>
        <div style={{ ...row, alignItems: 'flex-start' }}>
          <div style={{ width: 260 }}><DropZone onButtonClick={() => {}} /></div>
          <div style={{ width: 260 }}><DropZone disabled /></div>
        </div>
      </section>

      <section>
        <SectionHeader color="primary">LabelDescription</SectionHeader>
        <div style={row}>
          <LabelDescription label="Documentos" description="Formatos: PDF, JPG" />
          <LabelDescription align="right" label="Factura" description="Sube el justificante en PDF" />
        </div>
      </section>

      <section>
        <SectionHeader color="primary">FileSelector</SectionHeader>
        <div style={{ maxWidth: 320 }}>
          <FileSelector
            files={[
              { id: '1', name: 'factura.pdf', status: 'uploaded' },
              { id: '2', name: 'contrato.pdf', status: 'uploading' },
              { id: '3', name: 'nomina.pdf', status: 'error', errorMessage: 'Formato no soportado' },
            ]}
            onButtonClick={() => {}}
          />
        </div>
      </section>

      <section>
        <SectionHeader color="primary">FileUpload — wide / stacked / compact</SectionHeader>
        <FileUpload
          layout="wide"
          label="Documentos"
          description="Formatos: PDF, JPG"
          files={[{ id: '1', name: 'factura.pdf', status: 'uploaded' }]}
          onButtonClick={() => {}}
        />
        <div style={{ marginTop: 24, maxWidth: 320 }}>
          <FileUpload
            layout="stacked"
            label="Documentos"
            description="Formatos: PDF, JPG"
            files={[
              { id: '1', name: 'factura.pdf', status: 'uploaded' },
              { id: '2', name: 'contrato.pdf', status: 'error', errorMessage: 'Formato no soportado' },
            ]}
            onButtonClick={() => {}}
          />
        </div>
        <div style={{ marginTop: 24, maxWidth: 320 }}>
          <FileUpload
            layout="compact"
            label="Factura"
            description="Sube el PDF"
            files={[{ id: '1', name: 'factura.pdf', status: 'uploaded' }]}
            onButtonClick={() => {}}
          />
        </div>
      </section>
    </div>
  )
}
