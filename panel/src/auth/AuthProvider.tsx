import { ReactNode } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './msalConfig'

const msalInstance = new PublicClientApplication(msalConfig)

export function AuthProvider({ children }: { children: ReactNode }) {
  const isMsalConfigured =
    !!import.meta.env.VITE_AAD_CLIENT_ID && !!import.meta.env.VITE_AAD_TENANT_ID

  if (!isMsalConfigured) {
    // APIM not ready yet — skip auth wrapper, run in mock mode
    return <>{children}</>
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}
