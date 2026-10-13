import type { PointerEvent } from 'react'

// Hand the cursor's position over an element (-1 to 1 on each axis, from the
// centre) to the CSS as --tilt-x / --tilt-y, which tips the nearest corner
// back into the page. Put it on an element that doesn't itself shrink or tilt,
// so the hover doesn't flicker off at the edges.
function trackTilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
  el.style.setProperty('--tilt-x', x.toFixed(3))
  el.style.setProperty('--tilt-y', y.toFixed(3))
}

export default trackTilt
