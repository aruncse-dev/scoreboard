import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getMatchById,
  addEntry,
  undoLastEntry,
  endInnings,
  getInningScore,
} from '../store/matchStore'
import { Match, ScoreButtonConfig } from '../types'

interface MatchPageProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}
import ScoreButton from './ScoreButton'
import ScoreList from './ScoreList'
import InningsSummary from './InningsSummary'
import Modal from './Modal'
import ScoreHistoryModal from './ScoreHistoryModal'
import AppHeader from './AppHeader'

const SCORE_BUTTONS: ScoreButtonConfig[] = [
{ label: '1',  type: 'run',    runs: 1, extras: 0, isWicket: false },
  { label: '2',  type: 'run',    runs: 2, extras: 0, isWicket: false },
  { label: '3',  type: 'run',    runs: 3, extras: 0, isWicket: false },
  { label: '4',  type: 'run',    runs: 4, extras: 0, isWicket: false },
  { label: '6',  type: 'run',    runs: 6, extras: 0, isWicket: false },
  { label: 'W',  type: 'wicket', runs: 0, extras: 0, isWicket: true  },
  { label: 'Wd', type: 'wide',   runs: 0, extras: 1, isWicket: false },
  { label: 'Nb', type: 'noball', runs: 1, extras: 1, isWicket: false },
]

function buttonStyle(btn: ScoreButtonConfig): { bgColor: string; textColor?: string; border?: string } {
  if (btn.isWicket) return { bgColor: 'var(--accent-red)', textColor: '#fff' }
  if (btn.type === 'wide') return { bgColor: 'var(--accent-blue)', textColor: '#fff' }
  if (btn.type === 'noball') return { bgColor: '#7a2e00', textColor: '#f5f5f5' }
  if (btn.runs === 4 || btn.runs === 6) return { bgColor: 'var(--bg-button)', border: '2px solid var(--accent-gold)', textColor: 'var(--accent-gold)' }
  return { bgColor: 'var(--bg-button)' }
}

export default function MatchPage({ theme, onToggleTheme }: MatchPageProps) {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const [match, setMatch] = useState<Match | null>(null)
  const [showEndModal, setShowEndModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (matchId) {
      const m = getMatchById(matchId)
      if (m) setMatch(m)
      else navigate('/')
    }
  }, [matchId, navigate])

  if (!match) return null

  const handleScore = (btn: ScoreButtonConfig) => {
    const updated = addEntry(match.id, btn.type, btn.runs, btn.extras, btn.isWicket, btn.label)
    if (updated) setMatch({ ...updated })
  }

  const handleUndo = () => {
    const inning = match.innings[match.currentInnings]
    if (inning.entries.length === 0) return
    const updated = undoLastEntry(match.id)
    if (updated) setMatch({ ...updated })
  }

  const handleEndInningsConfirm = () => {
    setShowEndModal(false)
    const updated = endInnings(match.id)
    if (updated) {
      setMatch({ ...updated })
      if (updated.status === 'completed') setShowResultModal(true)
    }
  }

  // Completed result page (when modal is dismissed)
  if (match.status === 'completed' && !showResultModal) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <AppHeader backTo="/" title="Match Result" theme={theme} onToggleTheme={onToggleTheme} />

        <div style={{ flex: 1, padding: '24px 20px', maxWidth: 520, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--bg-card)', border: '2px solid var(--accent-gold)',
            borderRadius: 14, padding: '20px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {match.team1Name} vs {match.team2Name}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {match.result}
            </div>
          </div>
          <InningsSummary inning={match.innings[0]} label="1st Innings" />
          <InningsSummary inning={match.innings[1]} label="2nd Innings" />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setShowHistory(true)}
              style={{
                flex: 1, padding: 16,
                background: 'var(--bg-card)', color: 'var(--accent-gold)',
                fontWeight: 700, fontSize: '0.95rem', borderRadius: 12,
                border: '1px solid var(--border-bright)',
              }}
            >
              📋 Ball-by-Ball
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                flex: 1, padding: 16,
                background: 'var(--accent-gold)', color: '#04080f',
                fontWeight: 800, fontSize: '0.95rem', borderRadius: 12,
              }}
            >
              ← Home
            </button>
          </div>
        </div>
        {showHistory && <ScoreHistoryModal match={match} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  const inning = match.innings[match.currentInnings]
  const { runs, wickets } = getInningScore(inning)
  const firstInningScore = match.currentInnings === 1 ? getInningScore(match.innings[0]) : null
  const target = firstInningScore ? firstInningScore.runs + 1 : null

  return (
    <div style={{ height: '100dvh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppHeader
        backTo="/"
        title={`${match.team1Name} vs ${match.team2Name}`}
        theme={theme}
        onToggleTheme={onToggleTheme}
        right={
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{
              fontSize: '0.72rem', color: 'var(--text-secondary)',
              background: 'var(--bg-button)', padding: '4px 8px',
              borderRadius: 10, border: '1px solid var(--border-bright)',
              fontWeight: 600,
            }}>
              {match.currentInnings === 0 ? '1st' : '2nd'}
            </span>
            <button
              onClick={() => setShowHistory(true)}
              title="Ball-by-ball"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--bg-button)', color: 'var(--accent-gold)',
                fontSize: '0.85rem', border: '1px solid var(--border-bright)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              📋
            </button>
          </div>
        }
      />

      {/* Scoreboard */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)', flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
          {inning.teamName} Batting
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            {runs}/{wickets}
          </span>
          {target && (
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              Target: {target} | Need {Math.max(0, target - runs)} more
            </span>
          )}
        </div>
      </div>

      {/* Score list */}
      <div style={{ flex: 1, padding: '10px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ScoreList entries={inning.entries} />
      </div>

      {/* Score buttons */}
      <div className="safe-bottom" style={{
        padding: '10px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)', flexShrink: 0,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
          {SCORE_BUTTONS.map(btn => {
            const s = buttonStyle(btn)
            return (
              <ScoreButton
                key={btn.label}
                label={btn.label}
                bgColor={s.bgColor}
                textColor={s.textColor}
                border={s.border}
                onClick={() => handleScore(btn)}
              />
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleUndo}
            disabled={inning.entries.length === 0}
            style={{
              flex: 1, padding: '13px',
              background: 'var(--bg-button)', color: 'var(--text-primary)',
              fontWeight: 600, fontSize: '0.9rem', borderRadius: 10,
              border: '1px solid var(--border)',
              opacity: inning.entries.length === 0 ? 0.4 : 1,
            }}
          >
            ↩ Undo
          </button>
          <button
            onClick={() => setShowEndModal(true)}
            style={{
              flex: 2, padding: '13px',
              background: 'var(--accent-gold)', color: '#05101f',
              fontWeight: 800, fontSize: '0.9rem', borderRadius: 10,
            }}
          >
            {match.currentInnings === 0 ? 'End Innings →' : 'Finish Match ✓'}
          </button>
        </div>
      </div>

      {/* End Innings modal */}
      {showEndModal && (
        <Modal
          title={match.currentInnings === 0 ? 'End 1st Innings' : 'Finish Match'}
          onClose={() => setShowEndModal(false)}
          footer={
            <>
              <button
                onClick={() => setShowEndModal(false)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--bg-button)', color: 'var(--text-primary)',
                  fontWeight: 600, borderRadius: 10, border: '1px solid var(--border)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEndInningsConfirm}
                style={{
                  flex: 2, padding: '12px',
                  background: 'var(--accent-gold)', color: '#05101f',
                  fontWeight: 800, borderRadius: 10,
                }}
              >
                {match.currentInnings === 0 ? 'Start 2nd Innings' : 'Finish Match'}
              </button>
            </>
          }
        >
          <InningsSummary
            inning={match.innings[match.currentInnings]}
            label={match.currentInnings === 0 ? '1st Innings Summary' : '2nd Innings Summary'}
          />
          {match.currentInnings === 0 && (
            <p style={{ marginTop: 14, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {match.team2Name} will need <strong style={{ color: 'var(--text-primary)' }}>{runs + 1}</strong> runs to win.
            </p>
          )}
        </Modal>
      )}

      {/* Score History modal */}
      {showHistory && <ScoreHistoryModal match={match} onClose={() => setShowHistory(false)} />}

      {/* Match Result modal */}
      {showResultModal && match.status === 'completed' && (
        <Modal
          title="Match Result"
          onClose={() => setShowResultModal(false)}
          maxWidth={440}
          footer={
            <>
              <button
                onClick={() => setShowResultModal(false)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--bg-button)', color: 'var(--text-primary)',
                  fontWeight: 600, borderRadius: 10, border: '1px solid var(--border)',
                }}
              >
                View Details
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--accent-gold)', color: '#05101f',
                  fontWeight: 800, borderRadius: 10,
                }}
              >
                Home
              </button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: 6 }}>
              {match.result}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {match.team1Name} vs {match.team2Name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{match.innings[0].teamName}</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                {getInningScore(match.innings[0]).runs}/{getInningScore(match.innings[0]).wickets}
              </div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{match.innings[1].teamName}</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                {getInningScore(match.innings[1]).runs}/{getInningScore(match.innings[1]).wickets}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
