import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllMatches, deleteMatch, getInningScore } from '../store/matchStore'
import { Match } from '../types'
import Modal from './Modal'
import AppHeader from './AppHeader'

interface HomePageProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [deleteTarget, setDeleteTarget] = useState<Match | null>(null)
  const navigate = useNavigate()

  const refresh = () => setMatches(getAllMatches())

  useEffect(() => { refresh() }, [])

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteMatch(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
  }

  const inProgress = matches.filter(m => m.status === 'in_progress')
  const completed = matches.filter(m => m.status === 'completed')

  const MatchCard = ({ match }: { match: Match }) => {
    const s1 = getInningScore(match.innings[0])
    const s2 = getInningScore(match.innings[1])
    const dateStr = new Date(match.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })

    return (
      <div
        onClick={() => navigate(`/match/${match.id}`)}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '14px 16px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <button
          onClick={e => { e.stopPropagation(); setDeleteTarget(match) }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            padding: '4px 8px',
            borderRadius: 6,
          }}
          title="Delete match"
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingRight: 32 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{match.team1Name}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>vs</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{match.team2Name}</span>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 2 }}>{match.team1Name}</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: match.currentInnings === 0 && match.status === 'in_progress' ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
              {s1.runs}/{s1.wickets}
              {match.currentInnings === 0 && match.status === 'in_progress' && (
                <span style={{ fontSize: '0.7rem', marginLeft: 4, color: 'var(--accent-gold)' }}>●</span>
              )}
            </div>
          </div>
          {(match.currentInnings === 1 || match.status === 'completed') && (
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 2 }}>{match.team2Name}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: match.currentInnings === 1 && match.status === 'in_progress' ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                {s2.runs}/{s2.wickets}
                {match.currentInnings === 1 && match.status === 'in_progress' && (
                  <span style={{ fontSize: '0.7rem', marginLeft: 4, color: 'var(--accent-gold)' }}>●</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.82rem',
            color: match.status === 'completed' ? 'var(--accent-gold)' : 'var(--accent-saffron)',
            fontWeight: 600,
          }}>
            {match.status === 'completed' ? match.result : 'In Progress'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dateStr}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <AppHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        right={
          <button
            onClick={() => navigate('/new-match')}
            style={{
              background: 'var(--accent-gold)',
              color: '#04080f',
              fontWeight: 800,
              fontSize: '0.88rem',
              padding: '10px 16px',
              borderRadius: 20,
            }}
          >
            + New Match
          </button>
        }
      />

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', maxWidth: 600, width: '100%', margin: '0 auto' }}>
        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏟️</div>
            <p style={{ fontSize: '1rem', marginBottom: 4 }}>No matches yet</p>
            <p style={{ fontSize: '0.85rem' }}>Tap "New Match" to start scoring</p>
          </div>
        ) : (
          <>
            {inProgress.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: '0.78rem', color: 'var(--text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: 'var(--accent-saffron)' }}>●</span> In Progress
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {inProgress.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <div style={{
                  fontSize: '0.78rem', color: 'var(--text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
                }}>
                  Completed
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {completed.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <Modal
          title="Delete Match"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--bg-button)',
                  color: 'var(--text-primary)',
                  fontWeight: 600, borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1, padding: '12px',
                  background: 'var(--accent-red)',
                  color: '#fff',
                  fontWeight: 700, borderRadius: 10,
                }}
              >
                Delete
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 14 }}>
            Are you sure you want to delete this match?
          </p>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 16px',
            fontWeight: 700,
            fontSize: '1rem',
          }}>
            {deleteTarget.team1Name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>vs</span> {deleteTarget.team2Name}
          </div>
          <p style={{ color: 'var(--accent-red)', fontSize: '0.82rem', marginTop: 10 }}>
            This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  )
}
