interface ScoreButtonProps {
  label: string
  bgColor: string
  textColor?: string
  border?: string
  onClick: () => void
  disabled?: boolean
}

export default function ScoreButton({
  label,
  bgColor,
  textColor = 'var(--text-primary)',
  border = 'none',
  onClick,
  disabled = false,
}: ScoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bgColor,
        color: textColor,
        border,
        borderRadius: 10,
        width: '100%',
        height: 64,
        fontSize: '1.1rem',
        fontWeight: 700,
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPointerDown={e => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)'
      }}
      onPointerUp={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
      }}
      onPointerLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
      }}
    >
      {label}
    </button>
  )
}
