import './IntroTicker.css'

const INTRO_WORDS = ['"Junior."', 'Art Director.', 'Designer.', '+Motion']

function IntroTickerGroup() {
  return (
    <span className="intro-ticker-group">
      {Array.from({ length: 6 }).map((_, repeatIndex) =>
        INTRO_WORDS.map((word, wordIndex) => (
          <span
            className={`intro-ticker-item${word === '"Junior."' ? ' intro-ticker-item-junior' : ''}`}
            key={`${repeatIndex}-${wordIndex}`}
          >
            {word}
            <span className="intro-ticker-dot">&bull;</span>
          </span>
        )),
      )}
    </span>
  )
}

function IntroTicker() {
  return (
    <p className="home-intro-title">
      <span className="visually-hidden">{INTRO_WORDS.join(' ')}</span>
      <span className="intro-ticker" aria-hidden="true">
        <span className="intro-ticker-track">
          <IntroTickerGroup />
          <IntroTickerGroup />
        </span>
      </span>
    </p>
  )
}

export default IntroTicker
