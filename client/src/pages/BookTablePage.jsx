import { useState } from 'react'

function BookTablePage({ user, token, onFetchReservations }) {
  const [form, setForm] = useState({
    name: user ? user.username : '',
    date: '',
    guests: '2',
    time: '19:00',
    occasion: '',
    request: '',
  })
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('') // 'success' | 'error'
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        setStatusType('success')
        setStatus(`🎉 Thank you, ${data.name}! Your table for ${data.guests} is confirmed. We'll see you soon!`)
        setForm({ name: user ? user.username : '', date: '', guests: '2', time: '19:00', occasion: '', request: '' })
        if (onFetchReservations) onFetchReservations()
      } else {
        setStatusType('error')
        setStatus(data.message || 'Reservation failed. Please call us directly.')
      }
    } catch {
      setStatusType('error')
      setStatus('The server is currently unavailable. Please call us directly at +1 (555) 234-5678.')
    } finally {
      setLoading(false)
    }
  }

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00',
    '19:30', '20:00', '20:30', '21:00', '21:30',
  ]

  const occasions = ['', 'Birthday', 'Anniversary', 'Business Dinner', 'Romantic Evening', 'Other']

  return (
    <main className="page-content">
      <div className="page-hero page-hero--book">
        <div className="page-hero-content">
          <p className="eyebrow">Reserve Your Seat</p>
          <h1>Book a Table</h1>
          <p>We'd love to have you. Reserve your table in minutes.</p>
        </div>
      </div>

      <section className="section book-section">
        <div className="book-layout">
          {/* Booking Form */}
          <div className="book-form-wrap">
            <h2 className="form-section-title">Make a Reservation</h2>
            <form className="book-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="book-name">Full Name</label>
                  <input
                    type="text"
                    id="book-name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="book-guests">Number of Guests</label>
                  <select
                    id="book-guests"
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="book-date">Date</label>
                  <input
                    type="date"
                    id="book-date"
                    value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="book-time">Preferred Time</label>
                  <select
                    id="book-time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="book-occasion">Special Occasion (optional)</label>
                <select
                  id="book-occasion"
                  value={form.occasion}
                  onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                >
                  {occasions.map(o => (
                    <option key={o} value={o}>{o || 'No special occasion'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="book-request">Special Requests</label>
                <textarea
                  id="book-request"
                  placeholder="Allergies, dietary requirements, seating preferences..."
                  value={form.request}
                  onChange={(e) => setForm({ ...form, request: e.target.value })}
                />
              </div>

              <button type="submit" className="button primary book-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Confirm Reservation'}
              </button>
            </form>

            {status && (
              <div className={`book-status ${statusType}`}>
                {status}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="book-sidebar">
            <div className="sidebar-card">
              <h3>🕐 Opening Hours</h3>
              <ul className="hours-list">
                <li><span>Monday – Thursday</span><span>5:00 PM – 10:00 PM</span></li>
                <li><span>Friday – Saturday</span><span>5:00 PM – 11:00 PM</span></li>
                <li><span>Sunday</span><span>5:00 PM – 9:30 PM</span></li>
              </ul>
            </div>
            <div className="sidebar-card">
              <h3>📞 Contact Us</h3>
              <p>For large groups (9+) or private dining, please call us directly.</p>
              <a href="tel:+15552345678" className="sidebar-phone">+1 (555) 234-5678</a>
            </div>
            <div className="sidebar-card">
              <h3>📍 Find Us</h3>
              <p>48 Gourmet Lane, Downtown District<br />New York, NY 10001</p>
              <p className="sidebar-note">Valet parking available Thursday–Sunday</p>
            </div>
            <div className="sidebar-card sidebar-policy">
              <h3>📋 Reservation Policy</h3>
              <p>We hold reservations for 15 minutes. To cancel or modify, call us at least 24 hours in advance.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default BookTablePage
