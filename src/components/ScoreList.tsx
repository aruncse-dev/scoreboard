import { useEffect, useRef } from 'react'
import { ScoreEntry } from '../types'

interface ScoreListProps {
  entries: ScoreEntry[]
}

export default function ScoreList({ entries }: ScoreListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries.length])

  if (entries.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 16,
      }}>
        No deliveries yet
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      border: '1px solid var(--border)',
      borderRadius: 10,
      background: 'var(--bg-secondary)',
    }}>
      {entries.map((entry, i) => {
        const isWicket = entry.isWicket
        const isExtra = entry.type === 'wide' || entry.type === 'noball'

        let rowBg = 'transparent'
        if (isWicket) rowBg = 'rgba(192,57,43,0.15)'
        else if (isExtra) rowBg = 'rgba(41,128,185,0.12)'
        else if (i % 2 === 0) rowBg = 'rgba(255,255,255,0.02)'

        let labelColor = 'var(--text-primary)'
        if (isWicket) labelColor = '#e74c3c'
        else if (isExtra) labelColor = '#5dade2'
        else if (entry.runs === 4 || entry.runs === 6) labelColor = 'var(--accent-gold)'

        return (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 14px',
              background: rowBg,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <span style={{
              width: 28,
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <span style={{
              width: 48,
              fontWeight: 700,
              fontSize: '1rem',
              color: labelColor,
              flexShrink: 0,
            }}>
              {entry.label}
            </span>
            <span style={{
              flex: 1,
              textAlign: 'right',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isWicket ? '#e74c3c' : 'var(--text-primary)',
            }}>
              {entry.cumulativeScore}/{entry.cumulativeWickets}
            </span>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
