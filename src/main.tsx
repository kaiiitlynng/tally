import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (no render-blocking third-party stylesheet). opsz.css keeps DM Sans' optical-size axis.
import '@fontsource-variable/dm-sans/opsz.css'
import '@fontsource/doto/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
