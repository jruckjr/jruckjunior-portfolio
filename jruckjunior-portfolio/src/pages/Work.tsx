import ProjectGrid from '../components/ProjectGrid'
import { projects } from '../data/projects'
import './Work.css'

function Work() {
  return (
    <section className="container work-page">
      <h1 className="work-page-title">Work</h1>
      <ProjectGrid projects={projects} />
    </section>
  )
}

export default Work
