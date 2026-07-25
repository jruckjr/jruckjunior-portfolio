import { Link } from 'react-router-dom'
import ClientTicker from '../components/ClientTicker'
import IntroTicker from '../components/IntroTicker'
import { projects } from '../data/projects'
import './Home.css'

function Home() {
  return (
    <>
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
            <tbody>
              {projects.map((project) => (
                <tr key={project.slug}>
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

      <section className="home-clients">
        <p className="container home-clients-title">Brands Worked With:</p>
        <ClientTicker />
      </section>
    </>
  )
}

export default Home
