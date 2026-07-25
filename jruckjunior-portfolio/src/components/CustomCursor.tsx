import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    function handleMove(e: MouseEvent) {
      cursor!.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    function handleOver(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('a, button')) setHovering(true)
    }

    function handleOut(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('a, button')) setHovering(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${hovering ? ' is-hovering' : ''}`}
      aria-hidden="true"
    />
  )
}

export default CustomCursor
