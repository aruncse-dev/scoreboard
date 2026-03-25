export type ScoreEntryType = 'run' | 'wide' | 'noball' | 'wicket'

export interface ScoreEntry {
  id: string
  type: ScoreEntryType
  runs: number
  extras: number
  isWicket: boolean
  label: string
  cumulativeScore: number
  cumulativeWickets: number
}

export interface Inning {
  teamName: string
  entries: ScoreEntry[]
}

export interface Match {
  id: string
  createdAt: string
  team1Name: string
  team2Name: string
  innings: [Inning, Inning]
  currentInnings: 0 | 1
  status: 'in_progress' | 'completed'
  result?: string
}

export interface ScoreButtonConfig {
  label: string
  type: ScoreEntryType
  runs: number
  extras: number
  isWicket: boolean
}
