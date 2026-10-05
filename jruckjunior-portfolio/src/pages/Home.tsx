import ClientTicker from '../components/ClientTicker'
import CheckerStripe from '../components/CheckerStripe'
import MeltText from '../components/MeltText'
import ProjectTicker from '../components/ProjectTicker'
import ShowreelScroll from '../components/ShowreelScroll'
import './Home.css'

function Home() {
  return (
    <>
      <div className="home-above-fold">
        <section className="container home-hero">
          <div className="home-hero-titles">
            <MeltText as="h1" className="home-hero-wordmark" text="JUNIOR." />
            <MeltText
              className="home-hero-subhead"
              text="Art Director. Designer. [+Motion]"
            />
          </div>
          <ProjectTicker />
        </section>

        <section className="container home-brands-intro">
          <p className="home-brands-label">Brands I&rsquo;ve worked with:</p>
        </section>

        <section className="home-clients">
          <ClientTicker />
        </section>
      </div>

      <ShowreelScroll />

      <CheckerStripe />

      <section className="container home-about-list">
        <p>what am i about?</p>
        <p>fly fisher.</p>
        <p>motorcycles.</p>
        <p>
          <span className="home-about-highlight">black</span> metal.
        </p>
        <p>(sometimes) runs for fun.</p>
      </section>
    </>
  )
}

export default Home
