import { clients } from '../data/clients'
import './About.css'

const skills = [
  'Art Direction',
  'Brand Guidelines',
  'Visual Identity',
  'Campaign Design',
  'Graphic Design',
  'Motion Design',
  'Film Direction',
  'Production',
  'Print & Packaging Design',
]

function About() {
  return (
    <section className="container about-page">
      <p className="about-bio">
        Multi-disciplinary visual artist and Art Director specializing in
        brand imagery and film making. Originally from Kansas City, based in
        Seattle.
      </p>

      <div className="about-section">
        <h2>Expertise</h2>
        <ul className="about-list">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="about-section">
        <h2>Clients</h2>
        <ul className="about-list">
          {clients.map((client) => (
            <li key={client.name}>{client.name}</li>
          ))}
        </ul>
      </div>

      <div className="about-section">
        <h2>Contact</h2>
        <ul className="about-list">
          <li>
            <a href="mailto:jruckjr@gmail.com">jruckjr@gmail.com</a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/james-ruckdeschell-jr-57040150"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default About
