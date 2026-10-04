import { useState } from 'react'
import './InvertToggle.css'

// index.html applies the saved choice before first paint; this reads it back.
const STORAGE_KEY = 'inverted'

function InvertToggle() {
  const [inverted, setInverted] = useState(() =>
    document.documentElement.classList.contains('inverted'),
  )

  function toggle() {
    const next = !inverted
    setInverted(next)
    document.documentElement.classList.toggle('inverted', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      className="invert-toggle"
      onClick={toggle}
    >
      <span className="invert-toggle-icon" aria-hidden="true" />
      {inverted ? 'light mode' : 'dark mode'}
    </button>
  )
}

export default InvertToggle
