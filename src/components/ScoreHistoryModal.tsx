import { useState } from 'react'
import Modal from './Modal'
import ScoreList from './ScoreList'
import { Match } from '../types'
import { getInningScore } from '../store/matchStore'

interface ScoreHistoryModalProps {
  match: Match
  onClose: () => void
}

export default function ScoreHistoryModal({ match, onClose }: ScoreHistoryModalProps) {
  const [tab, setTab] = useState<0 | 1>(0)
  const inning = match.innings[tab]
  const score = getInningScore(inning)
  const hasSecond = match.innings[1].entries.length > 0 || match.currentInnings === 1 || match.status === 'completed'

  return (
    <Modal title="Score History" onClose={onClose} maxWidth={480}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[0, 1].map(i => {
          const inn = match.innings[i]
          const s = getInningScore(inn)
          const isActive = tab === i
          const isDisabled = i === 1 && !hasSecond
          return (
            <button
              key={i}
              onClick={() => !isDisabled && setTab(i as 0 | 1)}
              disabled={isDisabled}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: isActive ? 'var(--accent-gold)' : 'var(--bg-button)',
                color: isActive ? '#04080f' : isDisabled ? 'var(--text-secondary)' : 'var(--text-primary)',
                fontWeight: isActive ? 800 : 500,
                fontSize: '0.88rem',
                borderRadius: 10,
                border: isActive ? 'none' : '1px solid var(--border-bright)',
                opacity: isDisabled ? 0.4 : 1,
                textAlign: 'center',
              }}
            >
              <div>{inn.teamName}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>
                {s.runs}/{s.wickets}
              </div>
            </button>
          )
        })}
      </div>

      {/* Entry count */}
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        marginBottom: 8,
        paddingLeft: 2,
      }}>
        {inning.entries.length} {inning.entries.length === 1 ? 'delivery' : 'deliveries'}
        {' · '}
        {inning.entries.filter(e => e.runs === 4).length} fours
        {' · '}
        {inning.entries.filter(e => e.runs === 6).length} sixes
        {' · '}
        {inning.entries.filter(e => e.isWicket).length} wickets
      </div>

      {/* Score list */}
      <div style={{ height: 'min(320px, 40dvh)' }}>
        <ScoreList entries={inning.entries} />
      </div>

      {/* Score summary row */}
      {score.runs > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--border-bright)',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
            {score.runs}/{score.wickets}
          </span>
        </div>
      )}
    </Modal>
  )
}
