import { useParams } from 'react-router-dom'
import { useDraftDay } from '../hooks/useDraftDay'
import { useApprove } from '../hooks/useApprove'
import { EntryChips } from '../components/EntryChips'
import type { Entry } from '../types'

const DAY_START = 8
const DAY_END = 18
const TOTAL_MINUTES = (DAY_END - DAY_START) * 60
const PX_PER_MINUTE = 3

const PROJECT_COLORS: Record<string, string> = {
  'Client Portal Redesign': '#c8f135',
  'Internal Tools': '#38bdf8',
  'Hackathon': '#f97316',
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function toPx(time: string): number {
  const mins = timeToMinutes(time) - DAY_START * 60
  return mins * PX_PER_MINUTE
}

function durationPx(start: string, end: string): number {
  return (timeToMinutes(end) - timeToMinutes(start)) * PX_PER_MINUTE
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

const HOUR_LABELS = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i)
const FIXTURE_USER_ID = 'fixture-user-001'

export default function DraftDayPage() {
  const { date } = useParams<{ date: string }>()
  const { data, error, loading, isMock } = useDraftDay(date ?? '')
  const { approve, loading: approving, result: approveResult } = useApprove()

  const totalHours = data?.entries.reduce((sum, e) => sum + e.hours, 0) ?? 0
  const timelineHeight = TOTAL_MINUTES * PX_PER_MINUTE

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="border-b sticky top-0 z-10 backdrop-blur-sm" style={{ borderColor: 'var(--border)', background: 'rgba(15,15,17,0.9)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
              Draft Timesheet {isMock && <span style={{ color: '#f97316' }}>[mock]</span>}
            </p>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
              {date ?? data?.date ?? '—'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>Total</p>
              <p className="text-3xl font-extrabold" style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>
                {totalHours.toFixed(1)}<span className="text-base font-normal ml-1" style={{ color: 'var(--text-muted)' }}>hrs</span>
              </p>
            </div>
            {data && (
              <button
                onClick={() => approve(FIXTURE_USER_ID, data)}
                disabled={approving || approveResult?.success === true}
                style={{
                  background: approveResult?.success ? '#1a2e00' : 'var(--accent)',
                  color: approveResult?.success ? '#c8f135' : '#0f0f11',
                  border: approveResult?.success ? '1px solid #c8f135' : 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: approving || approveResult?.success ? 'not-allowed' : 'pointer',
                  opacity: approving ? 0.7 : 1,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {approving ? 'Submitting…' : approveResult?.success ? '✓ Approved' : 'Approve Draft'}
              </button>
            )}
          </div>
        </div>
        {approveResult && !approveResult.success && (
          <div className="max-w-4xl mx-auto px-6 pb-3">
            <div className="rounded-lg px-4 py-2 text-sm font-mono" style={{ background: '#2a1010', color: '#f87171', border: '1px solid #7f1d1d' }}>
              ⚠ Approval failed: {approveResult.error}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {error && (
          <div className="rounded-lg p-4 mb-6 font-mono text-sm" style={{ background: '#2a1010', color: '#f87171', border: '1px solid #7f1d1d' }}>
            ⚠ {error}
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-3 py-20 justify-center" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
            <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            Loading...
          </div>
        )}
        {data && (
          <div className="flex gap-0">
            <div className="relative flex-shrink-0 w-16" style={{ height: timelineHeight }}>
              {HOUR_LABELS.map(hour => (
                <div
                  key={hour}
                  className="absolute right-3 text-xs font-mono -translate-y-2"
                  style={{ top: (hour - DAY_START) * 60 * PX_PER_MINUTE, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            <div className="relative flex-1" style={{ height: timelineHeight }}>
              {HOUR_LABELS.map(hour => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t"
                  style={{ top: (hour - DAY_START) * 60 * PX_PER_MINUTE, borderColor: hour % 2 === 0 ? 'var(--border)' : 'transparent', borderStyle: 'dashed' }}
                />
              ))}

              {data.entries.map((entry: Entry) => {
                const top = toPx(entry.start)
                const height = durationPx(entry.start, entry.end)
                const color = PROJECT_COLORS[entry.project] ?? '#a78bfa'

                return (
                  <div
                    key={entry.id}
                    className="absolute left-2 right-2 rounded-lg overflow-hidden flex flex-col justify-between transition-transform hover:scale-[1.01] cursor-pointer"
                    style={{
                      top,
                      height: height - 4,
                      background: 'var(--surface)',
                      border: `1px solid ${color}33`,
                      borderLeft: `3px solid ${color}`,
                      padding: '10px 12px',
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color, fontFamily: 'DM Mono, monospace' }}>
                          {entry.project}
                        </span>
                        <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                          {entry.hours}h
                        </span>
                      </div>
                      {height > 60 && (
                        <p className="text-sm font-semibold mt-1 truncate" style={{ color: 'var(--text)' }}>
                          {entry.task}
                        </p>
                      )}
                      {height > 90 && entry.notes && (
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {entry.notes}
                        </p>
                      )}
                      {height > 100 && entry.chips && entry.chips.length > 0 && (
                        <EntryChips chips={entry.chips} />
                      )}
                    </div>
                    {height > 50 && (
                      <p className="text-xs font-mono mt-2 flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                        {formatTime(entry.start)} → {formatTime(entry.end)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
