import { Match, Inning, ScoreEntry, ScoreEntryType } from '../types'

const STORAGE_KEY = 'scoretracker_matches'

function loadMatches(): Match[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Match[]) : []
  } catch {
    return []
  }
}

function saveMatches(matches: Match[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
}

export function getAllMatches(): Match[] {
  return loadMatches()
}

export function getMatchById(id: string): Match | undefined {
  return loadMatches().find(m => m.id === id)
}

export function createMatch(team1Name: string, team2Name: string): Match {
  const emptyInning = (teamName: string): Inning => ({ teamName, entries: [] })
  const match: Match = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    team1Name: team1Name.trim(),
    team2Name: team2Name.trim(),
    innings: [emptyInning(team1Name.trim()), emptyInning(team2Name.trim())],
    currentInnings: 0,
    status: 'in_progress',
  }
  const matches = loadMatches()
  matches.unshift(match)
  saveMatches(matches)
  return match
}

export function addEntry(
  matchId: string,
  type: ScoreEntryType,
  runs: number,
  extras: number,
  isWicket: boolean,
  label: string
): Match | undefined {
  const matches = loadMatches()
  const idx = matches.findIndex(m => m.id === matchId)
  if (idx === -1) return undefined

  const match = matches[idx]
  const inning = match.innings[match.currentInnings]

  const prevScore = inning.entries.reduce((sum, e) => sum + e.runs + e.extras, 0)
  const prevWickets = inning.entries.filter(e => e.isWicket).length

  const entry: ScoreEntry = {
    id: crypto.randomUUID(),
    type,
    runs,
    extras,
    isWicket,
    label,
    cumulativeScore: prevScore + runs + extras,
    cumulativeWickets: prevWickets + (isWicket ? 1 : 0),
  }

  inning.entries.push(entry)
  matches[idx] = match
  saveMatches(matches)
  return match
}

export function undoLastEntry(matchId: string): Match | undefined {
  const matches = loadMatches()
  const idx = matches.findIndex(m => m.id === matchId)
  if (idx === -1) return undefined

  const match = matches[idx]
  const inning = match.innings[match.currentInnings]
  inning.entries.pop()

  matches[idx] = match
  saveMatches(matches)
  return match
}

export function endInnings(matchId: string): Match | undefined {
  const matches = loadMatches()
  const idx = matches.findIndex(m => m.id === matchId)
  if (idx === -1) return undefined

  const match = matches[idx]

  if (match.currentInnings === 0) {
    match.currentInnings = 1
  } else {
    match.status = 'completed'
    match.result = computeResult(match)
  }

  matches[idx] = match
  saveMatches(matches)
  return match
}

export function deleteMatch(matchId: string): void {
  const matches = loadMatches().filter(m => m.id !== matchId)
  saveMatches(matches)
}

export function getInningScore(inning: Inning): { runs: number; wickets: number } {
  const runs = inning.entries.reduce((sum, e) => sum + e.runs + e.extras, 0)
  const wickets = inning.entries.filter(e => e.isWicket).length
  return { runs, wickets }
}

function computeResult(match: Match): string {
  const s1 = getInningScore(match.innings[0])
  const s2 = getInningScore(match.innings[1])

  if (s2.runs > s1.runs) {
    const wicketsLeft = 10 - s2.wickets
    return `${match.team2Name} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`
  } else if (s1.runs > s2.runs) {
    const margin = s1.runs - s2.runs
    return `${match.team1Name} won by ${margin} run${margin !== 1 ? 's' : ''}`
  } else {
    return 'Match Tied'
  }
}
