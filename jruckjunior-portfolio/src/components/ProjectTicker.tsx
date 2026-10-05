import { projects } from '../data/projects'
import MeltText from './MeltText'
import './ProjectTicker.css'

// Enough stacked copies that the window (which can be tall) never runs past
// the end; the track slides up by exactly one copy for a seamless loop.
const COPIES = 4

// Project names (plain text, not links) scrolling upward in a seamless loop,
// with the same grainy melt-on-hover as the homepage title.
function ProjectTicker() {
  const titles = projects.map((project) => project.title)

  return (
    <MeltText as="div" className="project-ticker" strength={14} radiusEm={3}>
      <div className="project-ticker-track">
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            className="project-ticker-list"
            aria-label={copy === 0 ? 'Projects' : undefined}
            aria-hidden={copy === 0 ? undefined : true}
          >
            {titles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        ))}
      </div>
    </MeltText>
  )
}

export default ProjectTicker
