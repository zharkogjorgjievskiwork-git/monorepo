import { useState } from 'react'
import type { DraftDay } from '../types'

const AGENT_BASE = import.meta.env.VITE_AGENT_BASE_URL ?? 'http://localhost:5000'

export function useApprove() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const approve = async (userId: string, draft: DraftDay) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${AGENT_BASE}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, draft }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setResult({ success: false, error: body.error ?? `HTTP ${res.status}` })
      } else {
        setResult({ success: true })
      }
    } catch (e) {
      setResult({ success: false, error: e instanceof Error ? e.message : 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return { approve, loading, result }
}
