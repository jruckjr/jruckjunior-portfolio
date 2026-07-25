import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ClientTicker from '../components/ClientTicker'
import IntroTicker from '../components/IntroTicker'
import { projects, type Project } from '../data/projects'
import './Home.css'

interface PreviewState {
  project: Project
  x: number
  y: number
}

function Home() {
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [visibleSlugs, setVisibleSlugs] = useState<Set<string>>(new Set())
  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  useEffect(() => {
    const rows = tbodyRef.current?.querySelectorAll<HTMLTableRowElement>('tr') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const slug = entry.target.getAttribute('data-slug')
          if (!slug) return
          setVisibleSlugs((prev) => new Set(prev).add(slug))
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2 },
    )
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="home-page-bg" aria-hidden="true">
        <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="home-intro-blur">
              <feGaussianBlur stdDeviation="40" />
            </filter>
          </defs>
          <circle cx="150" cy="200" r="120" fill="#FD0064" filter="url(#home-intro-blur)" opacity="0.35">
            <animate attributeName="cx" values="150;650;150" dur="9s" repeatCount="indefinite" />
            <animate attributeName="cy" values="200;120;200" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="150" r="100" fill="#1E2124" filter="url(#home-intro-blur)" opacity="0.18">
            <animate attributeName="cx" values="650;250;650" dur="11s" repeatCount="indefinite" />
            <animate attributeName="cy" values="150;300;150" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="300" r="140" fill="#DDE1E4" filter="url(#home-intro-blur)" opacity="0.5">
            <animate attributeName="cx" values="400;100;400" dur="10s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;150;300" dur="12s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <section className="home-intro">
        <IntroTicker />
      </section>

      <section className="container home-projects">
        <div className="home-projects-panel">
          <table className="home-projects-table">
            <thead>
              <tr>
                <th>Projects</th>
                <th>Years</th>
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {projects.map((project, index) => (
                <tr
                  key={project.slug}
                  data-slug={project.slug}
                  className={visibleSlugs.has(project.slug) ? 'is-visible' : ''}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  onMouseMove={(e) => setPreview({ project, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setPreview(null)}
                >
                  <td>
                    <Link to={`/work/${project.slug}`}>{project.title}</Link>
                  </td>
                  <td>
                    <Link to={`/work/${project.slug}`}>{project.year}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {preview && (
        <div
          className="home-project-preview"
          style={{ left: preview.x, top: preview.y }}
          aria-hidden="true"
        >
          <img src={preview.project.image} alt="" />
        </div>
      )}

      <section className="home-clients">
        <p className="container home-clients-title">Brands Worked With:</p>
        <ClientTicker />
      </section>
    </>
  )
}

export default Home
