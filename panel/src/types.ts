export interface Entry {
  id: string
  project: string
  task: string
  start: string  // "HH:MM"
  end: string    // "HH:MM"
  hours: number
  notes: string
}

export interface DraftDay {
  date: string
  entries: Entry[]
}
