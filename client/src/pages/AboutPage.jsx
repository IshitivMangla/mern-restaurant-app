const team = [
  {
    name: 'Chef Antoine Beaumont',
    role: 'Executive Chef',
    bio: "Trained in Lyon and Paris, Antoine brings 20 years of classical French technique combined with bold modern creativity. He personally sources ingredients from local farms each week.",
    emoji: '👨‍🍳',
  },
  {
    name: 'Claire Fontaine',
    role: 'Pastry Chef',
    bio: "Claire's desserts are the stuff of legend. A graduate of Le Cordon Bleu, she believes every meal should end with joy — and a little chocolate.",
    emoji: '🍰',
  },
  {
    name: 'Marco Bellini',
    role: 'Sommelier',
    bio: "Marco curates our wine list with surgical precision and passionate enthusiasm. He can find the perfect pairing for any dish, any guest, any occasion.",
    emoji: '🍷',
  },
  {
    name: 'Aisha Moreau',
    role: 'Restaurant Manager',
    bio: "Aisha ensures every guest feels at home. Her warmth and attention to detail are what make L'Ambroisie truly special beyond the food.",
    emoji: '🌟',
  },
]

const milestones = [
  { year: '2012', event: "L'Ambroisie opens its doors on Gourmet Lane." },
  { year: '2015', event: 'Awarded Best New Restaurant by the City Food Awards.' },
  { year: '2017', event: 'Chef Antoine earns his first Michelin star.' },
  { year: '2020', event: 'Pivoted to community meals during the pandemic, serving over 10,000 meals.' },
  { year: '2022', event: 'Grand renovation and expansion to 120 covers.' },
  { year: '2024', event: 'Awarded three Michelin stars. A dream realized.' },
]

function AboutPage({ onBookTable }) {
  return (
    <main className="page-content">
      <div className="page-hero page-hero--about">
        <div className="page-hero-content">
          <p className="eyebrow">Est. 2012 • New York</p>
          <h1>About L'Ambroisie</h1>
          <p>A story of passion, people, and the pursuit of the perfect plate.</p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="section about-mission">
        <div className="about-mission-grid">
          <div className="about-mission-text">
            <p className="eyebrow">Our Philosophy</p>
            <h2>Food is an act of love.</h2>
            <p>
              At L'Ambroisie, we believe that a great meal is more than sustenance — it's an experience 
              that nourishes the soul. From the first greeting to the last bite of dessert, every moment 
              is crafted with intention and care.
            </p>
            <p>
              We work exclusively with local farmers and sustainable suppliers, changing our menu with 
              the seasons to honour the rhythms of nature and bring you the freshest, most vibrant flavours possible.
            </p>
            <button onClick={() => onBookTable()} className="button primary" style={{marginTop: '24px'}}>Experience It Yourself</button>
          </div>
          <div className="about-values-grid">
            {[
              { icon: '🌱', title: 'Farm to Table', desc: 'Every ingredient is sourced within 100 miles, harvested at peak freshness.' },
              { icon: '♻️', title: 'Sustainable', desc: 'Zero food waste policy. All scraps composted or donated locally.' },
              { icon: '🤝', title: 'Community First', desc: 'We invest in our local community through partnerships and charity events.' },
              { icon: '🏆', title: 'Award-Winning', desc: '3 Michelin stars, Best Restaurant 2024, and countless guest awards.' },
            ].map(v => (
              <div className="about-value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section timeline-section">
        <div className="section-heading">
          <p className="eyebrow">Our Journey</p>
          <h2>Twelve years in the making.</h2>
        </div>
        <div className="timeline">
          {milestones.map((m, i) => (
            <div className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`} key={m.year}>
              <div className="timeline-content">
                <span className="timeline-year">{m.year}</span>
                <p>{m.event}</p>
              </div>
              <div className="timeline-dot" />
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="section team-section">
        <div className="section-heading">
          <p className="eyebrow">Behind the Magic</p>
          <h2>Meet our team.</h2>
          <p className="section-sub">The talented people who make every visit extraordinary.</p>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="team-avatar">{member.emoji}</div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Come and see for yourself.</h2>
          <p>We'd love to welcome you to our table.</p>
          <button onClick={() => onBookTable()} className="button primary lg-btn">Make a Reservation</button>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
