import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import MeltText from './MeltText'
import './ProjectTicker.css'

// Enough stacked copies that the window (which can be tall) never runs past
// the end; the track slides up by exactly one copy for a seamless loop.
const COPIES = 4

// Typewriter: independent cursors, each repeatedly picking a random visible
// name, deleting it and typing it back. Times are in ms.
const CURSORS = 2
const DELETE_MS = [28, 60] // per character, random within range
const TYPE_MS = [55, 140]
const EMPTY_PAUSE_MS = [250, 650] // with the line cleared, before typing
const REST_MS = [600, 2600] // after a name is retyped, before the next one
// Only pick names comfortably inside the faded window, and keep the cursors
// at least this many rows apart.
const VISIBLE_BAND = [0.25, 0.75]
const MIN_ROWS_APART = 3

const between = ([min, max]: number[]) => min + Math.random() * (max - min)

// Project names (plain text, not links) scrolling upward in a seamless loop,
// with the same grainy melt-on-hover as the homepage title.
function ProjectTicker() {
  const titles = projects.map((project) => project.title)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timers = new Set<number>()
    const busy = new Set<HTMLLIElement>()
    let stopped = false

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          resolve()
        }, ms)
        timers.add(id)
      })
    }

    // A random name in the middle of the window, away from the other cursor.
    function pickItem() {
      // The track moves; measure against the fixed window around it.
      const box = (root!.parentElement ?? root!).getBoundingClientRect()
      const top = box.top + box.height * VISIBLE_BAND[0]
      const bottom = box.top + box.height * VISIBLE_BAND[1]
      const items = [...root!.querySelectorAll<HTMLLIElement>('.project-ticker-list li')]
      const rowHeight = items.length > 1 ? Math.abs(items[1].offsetTop - items[0].offsetTop) : 0
      const others = [...busy].map((li) => li.getBoundingClientRect().top)
      const candidates = items.filter((li) => {
        const { top: y } = li.getBoundingClientRect()
        return (
          y > top &&
          y < bottom &&
          !busy.has(li) &&
          others.every((other) => Math.abs(other - y) >= rowHeight * MIN_ROWS_APART)
        )
      })
      return candidates[Math.floor(Math.random() * candidates.length)]
    }

    // Delete a name to nothing and type it back, with a blinking cursor.
    // The real text (React's) is only visually hidden meanwhile, so screen
    // readers keep the full name; the typed copy is decoration.
    async function retype(li: HTMLLIElement) {
      const title = li.querySelector<HTMLElement>('.project-ticker-title')
      if (!title) return
      const full = title.textContent ?? ''
      const typed = document.createElement('span')
      typed.className = 'project-ticker-typed'
      typed.setAttribute('aria-hidden', 'true')
      const text = document.createTextNode(full)
      const caret = document.createElement('span')
      caret.className = 'project-ticker-caret'
      typed.append(text, caret)
      li.classList.add('is-typing')
      li.append(typed)

      try {
        for (let n = full.length - 1; n >= 0 && !stopped; n--) {
          await wait(between(DELETE_MS))
          text.data = full.slice(0, n)
        }
        await wait(between(EMPTY_PAUSE_MS))
        for (let n = 1; n <= full.length && !stopped; n++) {
          text.data = full.slice(0, n)
          await wait(between(TYPE_MS))
        }
        await wait(400)
      } finally {
        typed.remove()
        li.classList.remove('is-typing')
      }
    }

    async function cursorLoop(startDelay: number) {
      await wait(startDelay)
      while (!stopped) {
        const li = pickItem()
        if (li) {
          busy.add(li)
          await retype(li)
          busy.delete(li)
        }
        await wait(between(REST_MS))
      }
    }

    // Stagger the cursors so they don't start together.
    for (let i = 0; i < CURSORS; i++) cursorLoop(400 + i * between([900, 2200]))

    return () => {
      stopped = true
      timers.forEach((id) => window.clearTimeout(id))
      root.querySelectorAll('.project-ticker-typed').forEach((el) => el.remove())
      root.querySelectorAll('.is-typing').forEach((el) => el.classList.remove('is-typing'))
    }
  }, [])

  return (
    <MeltText as="div" className="project-ticker" strength={14} radiusEm={3}>
      <div ref={rootRef} className="project-ticker-track">
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            className="project-ticker-list"
            aria-label={copy === 0 ? 'Projects' : undefined}
            aria-hidden={copy === 0 ? undefined : true}
          >
            {titles.map((title) => (
              <li key={title}>
                <span className="project-ticker-title">{title}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </MeltText>
  )
}

export default ProjectTicker
