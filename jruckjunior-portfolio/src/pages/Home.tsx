import ClientTicker from '../components/ClientTicker'
import IntroTicker from '../components/IntroTicker'
import CheckerStripe from '../components/CheckerStripe'
import './Home.css'

function Home() {
  return (
    <>
      <section className="container home-hero">
        <h1 className="home-hero-wordmark">JUNIOR.</h1>
        <p className="home-hero-subhead">Art Director. Designer. [+Motion]</p>
      </section>

      <section className="home-intro">
        <IntroTicker />
      </section>

      <section className="container home-brands-intro">
        <p className="home-brands-label">Brands I&rsquo;ve worked with:</p>
        <div className="home-brands-box" aria-hidden="true" />
      </section>

      <section className="home-clients">
        <ClientTicker />
      </section>

      <section className="container home-showreel">
        <div className="home-showreel-media">
          <span className="home-showreel-play" aria-hidden="true">
            &#9654;
          </span>
          <span className="home-showreel-caption">Showreel</span>
        </div>
      </section>

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
