import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import CustomCursor from './CustomCursor'
import KonamiEasterEgg from './KonamiEasterEgg'
import './Layout.css'

const MAGNET_PULL = 0.3
const MAGNET_MAX_OFFSET = 8

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleMenuMagnetMove(e: React.MouseEvent<HTMLButtonElement>) {
    const button = menuButtonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const offsetX = e.clientX - (rect.left + rect.width / 2)
    const offsetY = e.clientY - (rect.top + rect.height / 2)
    const x = Math.max(-MAGNET_MAX_OFFSET, Math.min(MAGNET_MAX_OFFSET, offsetX * MAGNET_PULL))
    const y = Math.max(-MAGNET_MAX_OFFSET, Math.min(MAGNET_MAX_OFFSET, offsetY * MAGNET_PULL))
    button.style.transform = `translate(${x}px, ${y}px)`
  }

  function handleMenuMagnetLeave() {
    menuButtonRef.current?.style.setProperty('transform', 'translate(0, 0)')
  }

  return (
    <div className="site grain-gradient-bg">
      <CustomCursor />
      <KonamiEasterEgg />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <NavLink to="/" className="logo" end>
            Junior.
          </NavLink>
          <button
            ref={menuButtonRef}
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            onMouseMove={handleMenuMagnetMove}
            onMouseLeave={handleMenuMagnetLeave}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            id="site-nav"
            className={`site-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Primary"
          >
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" key={location.pathname} className="page-transition">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <a href="mailto:jruckjr@gmail.com">jruckjr@gmail.com</a>
          <a
            href="https://www.linkedin.com/in/james-ruckdeschell-jr-57040150"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <span className="site-footer-copyright">
            &copy; {new Date().getFullYear()} Junior Ruckdeschell
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
