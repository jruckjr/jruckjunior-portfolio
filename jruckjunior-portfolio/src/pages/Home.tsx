import { Link } from 'react-router-dom'
import ProjectGrid from '../components/ProjectGrid'
import ClientTicker from '../components/ClientTicker'
import IntroTicker from '../components/IntroTicker'
import { projects } from '../data/projects'
import './Home.css'

function Home() {
  const featured = projects.slice(0, 4)

  return (
    <>
      <section className="home-intro">
        <IntroTicker />
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
