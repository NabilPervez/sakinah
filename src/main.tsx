import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.VITE_PREVIEW ? (
      // Artifact preview build: no URL routing in the sandboxed frame (Nabil, 2026-11-15).
      <MemoryRouter initialEntries={['/today']}><App /></MemoryRouter>
    ) : (
      <BrowserRouter><App /></BrowserRouter>
    )}
  </StrictMode>,
)
