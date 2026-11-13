import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../tokens.css'
import '../foundations.css'
import Gallery from './Gallery.jsx'

// ?mode=dark → <html data-mode="dark"> · ?theme=youth → <html data-theme="youth">, antes del primer render
const params = new URLSearchParams(window.location.search)
const mode = params.get('mode') === 'dark' ? 'dark' : 'light'
const theme = params.get('theme') === 'youth' ? 'youth' : 'retail'
document.documentElement.dataset.mode = mode
if (theme === 'youth') document.documentElement.dataset.theme = 'youth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gallery mode={mode} theme={theme} />
  </StrictMode>,
)
