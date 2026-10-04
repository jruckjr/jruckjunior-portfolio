import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectStrip.css'

// Every project, listed out in a strip pinned under the header on work pages.
function ProjectStrip() {
  const listRef = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()

  // On narrow screens the strip is one sideways-scrolling line; bring the
  // current project to the middle of it. (No effect when everything fits.)
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('a.active')
    if (!list || !active) return
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2
  }, [pathname])

  return (
    <nav className="project-strip" aria-label="Projects">
      <ul ref={listRef} className="container project-strip-list">
        {projects.map((project) => (
          <li key={project.slug}>
            <NavLink to={`/work/${project.slug}`}>{project.title}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ProjectStrip
