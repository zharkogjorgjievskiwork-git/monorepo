import type { Chip } from '../types'

function getChipConfig(chip: Chip): { icon: string; href: string; color: string; bg: string } {
  switch (chip.type) {
    case 'calendar':
      return {
        icon: '📅',
        href: `https://outlook.office.com/calendar/item/${encodeURIComponent(chip.eventId)}`,
        color: '#60a5fa',
        bg: '#1e3a5f22',
      }
    case 'devops':
      return {
        icon: '✅',
        href: `https://dev.azure.com/${chip.org}/${encodeURIComponent(chip.project)}/_workitems/edit/${chip.workItemId}`,
        color: '#a78bfa',
        bg: '#2d1f5e22',
      }
    case 'mail':
      return {
        icon: '✉️',
        href: `https://outlook.office.com/mail/deeplink/compose?messageId=${encodeURIComponent(chip.messageId)}`,
        color: '#34d399',
        bg: '#0d3d2e22',
      }
  }
}

interface EntryChipsProps {
  chips: Chip[]
}

export function EntryChips({ chips }: EntryChipsProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {chips.map((chip, i) => {
        const { icon, href, color, bg } = getChipConfig(chip)
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              fontWeight: 500,
              color,
              background: bg,
              border: `1px solid ${color}44`,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}22`
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = color
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = bg
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}44`
            }}
          >
            <span style={{ fontSize: '10px' }}>{icon}</span>
            {chip.label}
          </a>
        )
      })}
    </div>
  )
}
