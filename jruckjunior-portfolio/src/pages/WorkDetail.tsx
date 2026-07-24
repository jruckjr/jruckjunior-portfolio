import { Link, Navigate, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '../data/projects'
import './WorkDetail.css'

function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <Navigate to="/work" replace />
  }

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="container work-detail">
      <header className="work-detail-header">
        <h1>{project.title}</h1>
        <dl className="work-detail-facts">
          <div>
            <dt>Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </header>

      <div className="work-detail-media">
        <img src={project.image} alt={project.title} />
      </div>

      <p className="work-detail-summary">{project.summary}</p>

      <Link to={`/work/${next.slug}`} className="work-detail-next">
        Next project: {next.title} &rarr;
      </Link>
    </article>
  )
}

export default WorkDetail
