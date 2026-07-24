import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="site grain-gradient-bg">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <NavLink to="/" className="logo" end>
            Junior.
          </NavLink>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
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

      <main id="main-content">
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
