import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/Auth/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="system" storageKey="theme">
      <BrowserRouter>
        <NextUIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NextUIProvider>
      </BrowserRouter>
    </NextThemesProvider>
  </React.StrictMode>,
)