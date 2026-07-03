import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import BookTablePage from './pages/BookTablePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// ── Simple hash-based router ─────────────────────────────────────────────────
const getPage = () => {
  const hash = window.location.hash.replace('#', '') || 'home'
  return hash
}

function App() {
  const [page, setPage] = useState(getPage())
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Listen to hash changes for routing
  useEffect(() => {
    const onHash = () => {
      const newPage = getPage()
      setPage(newPage)
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Verify token on mount
  useEffect(() => {
    if (!token) return
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(userData => setUser(userData))
      .catch(() => { setUser(null); setToken(''); localStorage.removeItem('token') })
  }, [token])

  const navigate = (p) => {
    window.location.hash = p
    setPage(p)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('token')
  }

  const openBookTable = () => {
    navigate('book')
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)
    const url = authTab === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = authTab === 'login'
      ? { email: authForm.email, password: authForm.password }
      : { username: authForm.username, email: authForm.email, password: authForm.password }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setIsAuthModalOpen(false)
        setAuthForm({ username: '', email: '', password: '' })
      } else {
        setAuthError(data.message || 'Authentication failed. Please check your credentials.')
      }
    } catch {
      setAuthError('Unable to connect to the server. Please try again later.')
    } finally {
      setAuthLoading(false)
    }
  }

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'book', label: 'Book Table' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

  const renderPage = () => {
    switch (page) {
      case 'menu':
        return <MenuPage onBookTable={openBookTable} />
      case 'book':
        return <BookTablePage user={user} token={token} />
      case 'about':
        return <AboutPage onBookTable={openBookTable} />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage onBookTable={openBookTable} />
    }
  }

  return (
    <div className="restaurant-app">
      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-container">
          <button onClick={() => navigate('home')} className="navbar-logo">
            <span className="logo-accent">L'</span>Ambroisie
          </button>

          {/* Desktop Links */}
          <ul className="navbar-links desktop-links">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  className={`nav-link-btn ${page === link.id ? 'active' : ''}`}
                  onClick={() => navigate(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="navbar-right">
            {user ? (
              <div className="user-profile">
                <span className="user-welcome">Hello, <strong>{user.username}</strong></span>
                <button onClick={handleLogout} className="button secondary nav-btn">Logout</button>
              </div>
            ) : (
              <button
                onClick={() => { setIsAuthModalOpen(true); setAuthTab('login'); setAuthError('') }}
                className="button primary nav-btn"
              >
                Sign In
              </button>
            )}

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map(link => (
              <button
                key={link.id}
                className={`mobile-link ${page === link.id ? 'active' : ''}`}
                onClick={() => navigate(link.id)}
              >
                {link.label}
              </button>
            ))}
            {user ? (
              <button onClick={handleLogout} className="mobile-link mobile-link-auth">Logout ({user.username})</button>
            ) : (
              <button
                onClick={() => { setIsAuthModalOpen(true); setMenuOpen(false); setAuthError('') }}
                className="mobile-link mobile-link-auth"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ── Auth Modal ─────────────────────────────────────────────────── */}
      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAuthModalOpen(false)}>×</button>

            <div className="modal-brand">
              <span className="logo-accent">L'</span>Ambroisie
            </div>

            <div className="modal-tabs">
              <button
                type="button"
                className={`tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthError('') }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setAuthError('') }}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authTab === 'register' && (
                <div className="form-group">
                  <label htmlFor="auth-username">Username</label>
                  <input
                    type="text"
                    id="auth-username"
                    placeholder="Choose a username"
                    value={authForm.username}
                    onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  type="email"
                  id="auth-email"
                  placeholder="your@email.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  type="password"
                  id="auth-password"
                  placeholder="Enter your password"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>
              {authError && <div className="auth-error">{authError}</div>}
              <button type="submit" className="button primary auth-submit-btn" disabled={authLoading}>
                {authLoading ? 'Please wait...' : authTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Page Content ──────────────────────────────────────────────── */}
      <div className="page-wrapper">
        {renderPage()}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo"><span className="logo-accent">L'</span>Ambroisie</span>
            <p>Fine dining with heart and soul since 2012.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="social-icon">📷</a>
              <a href="#" aria-label="Facebook" className="social-icon">📘</a>
              <a href="#" aria-label="Twitter/X" className="social-icon">🐦</a>
            </div>
          </div>
          <div className="footer-links-group">
            <h4>Explore</h4>
            <ul>
              {navLinks.map(l => (
                <li key={l.id}><button className="footer-link" onClick={() => navigate(l.id)}>{l.label}</button></li>
              ))}
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li>48 Gourmet Lane, New York</li>
              <li><a href="tel:+15552345678">+1 (555) 234-5678</a></li>
              <li><a href="mailto:hello@lambroisie.com">hello@lambroisie.com</a></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Hours</h4>
            <ul>
              <li>Mon – Thu: 5 PM – 10 PM</li>
              <li>Fri – Sat: 5 PM – 11 PM</li>
              <li>Sunday: 5 PM – 9:30 PM</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} L'Ambroisie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
