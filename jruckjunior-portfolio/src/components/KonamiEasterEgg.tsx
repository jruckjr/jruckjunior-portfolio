import { useEffect, useRef } from 'react'
import './KonamiEasterEgg.css'

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const ACTIVE_DURATION_MS = 5000

function KonamiEasterEgg() {
  const progressRef = useRef(0)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = KONAMI_SEQUENCE[progressRef.current]

      if (key === expected) {
        progressRef.current += 1
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0
          document.body.classList.add('konami-active')
          window.clearTimeout(timeoutRef.current)
          timeoutRef.current = window.setTimeout(() => {
            document.body.classList.remove('konami-active')
          }, ACTIVE_DURATION_MS)
        }
      } else {
        progressRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  return null
}

export default KonamiEasterEgg
