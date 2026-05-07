export type CalendarChip = {
  type: 'calendar'
  label: string
  eventId: string
}

export type DevOpsChip = {
  type: 'devops'
  label: string
  org: string
  project: string
  workItemId: string
}

export type MailChip = {
  type: 'mail'
  label: string
  messageId: string
}

export type Chip = CalendarChip | DevOpsChip | MailChip

export interface Entry {
  id: string
  project: string
  task: string
  start: string
  end: string
  hours: number
  notes: string
  chips?: Chip[]
}

export interface DraftDay {
  date: string
  entries: Entry[]
}
