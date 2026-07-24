import { Link } from 'react-router-dom'
import ProjectGrid from '../components/ProjectGrid'
import ClientTicker from '../components/ClientTicker'
import { projects } from '../data/projects'
import './Home.css'

function Home() {
  const featured = projects.slice(0, 4)

  return (
    <>
      <section className="container home-intro">
        <p className="home-intro-title">Art Director. Designer. + Motion.</p>
      </section>

      <section className="home-clients">
        <p className="container home-clients-title">Brands Worked With:</p>
        <ClientTicker />
      </section>

      <section className="container home-work">
        <ProjectGrid projects={featured} />
        <Link to="/work" className="home-work-link">
          View all work &rarr;
        </Link>
      </section>
    </>
  )
}

export default Home
