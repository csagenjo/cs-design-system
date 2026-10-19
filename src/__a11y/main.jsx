import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../tokens.css'
import Gallery from './Gallery.jsx'

// ?mode=dark → <html data-mode="dark"> antes del primer render
const mode = new URLSearchParams(window.location.search).get('mode') === 'dark' ? 'dark' : 'light'
document.documentElement.dataset.mode = mode

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gallery mode={mode} />
  </StrictMode>,
)
