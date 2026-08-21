import './tokens.css'
import { List } from './components/List'
import { AmountView } from './components/AmountView'
import { Divider } from './components/Divider'
import { SectionHeader } from './components/SectionHeader'
import { BadgeHighlight } from './components/BadgeHighlight'
import { DescriptionList, DescriptionListItem } from './organisms/DescriptionList'

const box = { padding: 24, display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }
const row = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }

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
    </div>
  )
}
