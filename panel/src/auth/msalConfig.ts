import { Configuration, PopupRequest } from '@azure/msal-browser'

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AAD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID ?? 'common'}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
}

export const tokenRequest: PopupRequest = {
  scopes: [import.meta.env.VITE_APIM_SCOPE ?? ''],
}
