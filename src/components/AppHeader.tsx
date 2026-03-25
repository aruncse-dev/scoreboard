import { useNavigate } from 'react-router-dom'

interface AppHeaderProps {
  /** Back button: pass a path to show ← button, omit for home */
  backTo?: string
  /** Center title text (defaults to "Score Board" with logo) */
  title?: string
  /** Right-side content */
  right?: React.ReactNode
  /** Dark/light toggle */
  theme?: 'dark' | 'light'
  onToggleTheme?: () => void
}

export default function AppHeader({ backTo, title, right, theme, onToggleTheme }: AppHeaderProps) {
  const navigate = useNavigate()
  const base = import.meta.env.BASE_URL  // '/scoreboard/'

  return (
    <div className="safe-top" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      {/* Back or app icon */}
      {backTo ? (
        <button
          onClick={() => navigate(backTo)}
          style={{
            width: 38, height: 38,
            borderRadius: '50%',
            background: 'var(--bg-button)',
            border: '1px solid var(--border-bright)',
            color: 'var(--accent-gold)',
            fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ←
        </button>
      ) : (
        <img
          src={`${base}icon.png`}
          alt="Score Board"
          style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }}
        />
      )}

      {/* Title */}
      <span style={{ fontWeight: 800, fontSize: '1rem', flex: 1, color: 'var(--text-primary)' }}>
        {title ?? 'Score Board'}
      </span>

      {/* Theme toggle */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          style={{
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'var(--bg-button)',
            border: '1px solid var(--border-bright)',
            fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      )}

      {/* Extra right content */}
      {right}
    </div>
  )
}
