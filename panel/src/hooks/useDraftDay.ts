import { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { tokenRequest } from '../auth/msalConfig'
import type { DraftDay } from '../types'

const APIM_BASE = import.meta.env.VITE_APIM_BASE_URL
const IS_APIM_READY = !!APIM_BASE && !!import.meta.env.VITE_AAD_CLIENT_ID

async function fetchWithToken(url: string, token: string): Promise<DraftDay> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`APIM error: ${res.status}`)
  return res.json()
}

async function fetchMock(): Promise<DraftDay> {
  const res = await fetch('/mocks/draft-day.json')
  if (!res.ok) throw new Error('Failed to load mock data')
  return res.json()
}

// Hook for when MSAL is NOT configured (mock-only mode)
export function useDraftDayMock(date: string) {
  const [data, setData] = useState<DraftDay | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMock()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [date])

  return { data, error, loading, isMock: true }
}

// Hook for when MSAL IS configured (real APIM with silent token)
export function useDraftDayApim(date: string) {
  const { instance, accounts } = useMsal()
  const [data, setData] = useState<DraftDay | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accounts[0]) {
      setError('Not signed in')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        // Silent token acquisition
        const result = await instance.acquireTokenSilent({
          ...tokenRequest,
          account: accounts[0],
        })
        const url = `${APIM_BASE}/timesheets/draft/${date}`
        const draft = await fetchWithToken(url, result.accessToken)
        setData(draft)
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          // Silent failed — fall back to mock
          console.warn('Silent token failed, falling back to mock')
          try {
            const mock = await fetchMock()
            setData(mock)
          } catch (me: unknown) {
            setError(me instanceof Error ? me.message : 'Unknown error')
          }
        } else {
          setError(e instanceof Error ? e.message : 'Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [date, instance, accounts])

  return { data, error, loading, isMock: false }
}

// Unified hook — auto-selects mode based on config
export function useDraftDay(date: string) {
  const mockResult = useDraftDayMock(date)
  const apimResult = useDraftDayApim(date)
  return IS_APIM_READY ? apimResult : mockResult
}
