import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import './ProjectGrid.css'

interface ProjectGridProps {
  projects: Project[]
}

function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <ul className="project-grid">
      {projects.map((project) => (
        <li key={project.slug} className="project-card">
          <Link to={`/work/${project.slug}`}>
            <div className="project-card-media">
              <img src={project.image} alt="" loading="lazy" />
            </div>
            <div className="project-card-meta">
              <h2>{project.title}</h2>
              <p>
                {project.client} — {project.category}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default ProjectGrid
