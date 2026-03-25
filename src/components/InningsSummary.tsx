import { Inning } from '../types'
import { getInningScore } from '../store/matchStore'

interface InningsSummaryProps {
  inning: Inning
  label: string
}

export default function InningsSummary({ inning, label }: InningsSummaryProps) {
  const { runs, wickets } = getInningScore(inning)
  const boundaries = inning.entries.filter(e => e.runs === 4).length
  const sixes = inning.entries.filter(e => e.runs === 6).length
  const extras = inning.entries.reduce((sum, e) => sum + e.extras, 0)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--accent-gold)',
        marginBottom: 8,
      }}>
        {inning.teamName}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        marginBottom: 10,
      }}>
        {runs}/{wickets}
      </div>
      <div style={{
        display: 'flex',
        gap: 16,
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
      }}>
        <span>4s: <strong style={{ color: 'var(--accent-gold)' }}>{boundaries}</strong></span>
        <span>6s: <strong style={{ color: 'var(--accent-gold)' }}>{sixes}</strong></span>
        <span>Extras: <strong style={{ color: 'var(--text-primary)' }}>{extras}</strong></span>
        <span>Balls: <strong style={{ color: 'var(--text-primary)' }}>{inning.entries.length}</strong></span>
      </div>
    </div>
  )
}
