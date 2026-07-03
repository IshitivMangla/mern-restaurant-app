import { useState } from 'react'

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate a message send (no dedicated backend endpoint needed)
    await new Promise(r => setTimeout(r, 1200))
    setStatusType('success')
    setStatus('Thank you for reaching out! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const faqs = [
    { q: 'Do you cater for dietary requirements?', a: 'Absolutely. We offer vegetarian, vegan, gluten-free and nut-free options. Please mention this when booking.' },
    { q: 'Can I host a private event?', a: 'Yes! We offer exclusive hire for up to 80 guests. Contact us for a custom quote.' },
    { q: 'Is there parking nearby?', a: 'Valet parking is available Thursday through Sunday. Free street parking is available on Maple Ave.' },
    { q: 'What\'s your cancellation policy?', a: 'We require 24 hours notice for cancellations. Last-minute cancellations may incur a fee for large groups.' },
  ]

  return (
    <main className="page-content">
      <div className="page-hero page-hero--contact">
        <div className="page-hero-content">
          <p className="eyebrow">We'd love to hear from you</p>
          <h1>Contact Us</h1>
          <p>Questions, feedback, or private dining enquiries — we're here to help.</p>
        </div>
      </div>

      <section className="section contact-section">
        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-form-wrap">
            <h2 className="form-section-title">Send a Message</h2>
            <form className="book-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                >
                  <option value="">Select a topic...</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Private Dining">Private Dining / Events</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Press">Press &amp; Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  placeholder="Write your message here..."
                  value={form.message}
                  rows={5}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="button primary book-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {status && <div className={`book-status ${statusType}`}>{status}</div>}
          </div>

          {/* Contact Info Sidebar */}
          <aside className="book-sidebar">
            <div className="sidebar-card">
              <h3>📍 Visit Us</h3>
              <p>48 Gourmet Lane<br />Downtown District<br />New York, NY 10001</p>
            </div>
            <div className="sidebar-card">
              <h3>📞 Call Us</h3>
              <a href="tel:+15552345678" className="sidebar-phone">+1 (555) 234-5678</a>
              <p className="sidebar-note">Mon–Sun, 3:00 PM – 11:00 PM</p>
            </div>
            <div className="sidebar-card">
              <h3>✉️ Email Us</h3>
              <a href="mailto:hello@lambroisie.com" className="sidebar-phone">hello@lambroisie.com</a>
              <p className="sidebar-note">We reply within 24 hours</p>
            </div>
            <div className="sidebar-card">
              <h3>🕐 Opening Hours</h3>
              <ul className="hours-list">
                <li><span>Mon – Thu</span><span>5 PM – 10 PM</span></li>
                <li><span>Fri – Sat</span><span>5 PM – 11 PM</span></li>
                <li><span>Sunday</span><span>5 PM – 9:30 PM</span></li>
              </ul>
            </div>

            {/* Map Placeholder */}
            <div className="map-placeholder">
              <div className="map-pin-icon">📍</div>
              <p>48 Gourmet Lane, NY 10001</p>
              <a
                href="https://maps.google.com/?q=48+Gourmet+Lane+New+York"
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary map-btn"
              >
                Open in Google Maps
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="section-heading">
          <p className="eyebrow">Common Questions</p>
          <h2>Frequently Asked</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <div className="faq-card" key={faq.q}>
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ContactPage
