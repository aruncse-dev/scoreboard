import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMatch } from '../store/matchStore'
import AppHeader from './AppHeader'

export default function NewMatchPage() {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!team1.trim() || !team2.trim()) {
      setError('Both team names are required')
      return
    }
    if (team1.trim().toLowerCase() === team2.trim().toLowerCase()) {
      setError('Team names must be different')
      return
    }
    const match = createMatch(team1, team2)
    navigate(`/match/${match.id}`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppHeader backTo="/" title="New Match" />

      {/* Form */}
      <div style={{
        flex: 1,
        padding: '32px 24px',
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏏</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            Set Up Match
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
            Enter the team names to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Team 1 (Batting First)
            </label>
            <input
              type="text"
              value={team1}
              onChange={e => { setTeam1(e.target.value); setError('') }}
              placeholder="Team A"
              maxLength={40}
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Team 2
            </label>
            <input
              type="text"
              value={team2}
              onChange={e => { setTeam2(e.target.value); setError('') }}
              placeholder="Team B"
              maxLength={40}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              color: '#e74c3c',
              fontSize: '0.88rem',
              marginBottom: 16,
              padding: '10px 14px',
              background: 'rgba(192,57,43,0.12)',
              borderRadius: 8,
              border: '1px solid rgba(192,57,43,0.3)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--accent-gold)',
              color: '#0d1b0f',
              fontWeight: 800,
              fontSize: '1.05rem',
              borderRadius: 12,
              letterSpacing: '0.02em',
            }}
          >
            Start Match
          </button>
        </form>
      </div>
    </div>
  )
}
