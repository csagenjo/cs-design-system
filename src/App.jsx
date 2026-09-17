import { useState } from 'react'
import './tokens.css'
import { SidebarMenu } from './organisms/SidebarMenu'

const items = [
  {
    id: 'p1', label: 'Parent 1', children: [
      { id: 'c1', label: 'Child 1', children: [{ id: 'g1', label: 'Gran son 1' }, { id: 'g2', label: 'Gran son 2 seleccionado' }] },
      { id: 'c2', label: 'Child 2' },
    ]
  },
  { id: 'p2', label: 'Parent 2' },
  { id: 'p3', label: 'Parent 3', children: [{ id: 'c3', label: 'Child 3' }] },
  { id: 'p4', label: 'Parent 4' },
]

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedId, setSelectedId] = useState('g2')

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarMenu
        title="Gestión de cuentas"
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
      <div style={{ flex: 1, padding: 24, fontSize: 13 }}>
        <p>Seleccionado: <b>{selectedId}</b></p>
        <p style={{ color: '#999' }}>resto de La Plataforma</p>
      </div>
    </div>
  )
}
