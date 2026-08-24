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
        <div style={viewport}>
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
    </div>
  )
}
