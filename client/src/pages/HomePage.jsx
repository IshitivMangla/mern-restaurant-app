import { useState } from 'react'

function HomePage({ onBookTable }) {
  const featuredDishes = [
    {
      name: 'Smoked Tomato Pasta',
      price: '$18',
      description: 'Creamy tomato sauce with basil and parmesan.',
      image: '/menu_pasta.png',
      badge: "Chef's Favourite",
    },
    {
      name: 'Charred Steak',
      price: '$24',
      description: 'Served with garlic potatoes and herb butter.',
      image: '/menu_steak.png',
      badge: 'Bestseller',
    },
    {
      name: 'Truffle Risotto',
      price: '$22',
      description: 'Wild mushroom risotto with parmesan crisp and herb oil.',
      image: '/menu_risotto.png',
      badge: "Tonight's Special",
    },
  ]

  const testimonials = [
    { name: 'Sophia M.', text: 'An unforgettable evening. Every bite was a masterpiece — the truffle risotto blew my mind.', stars: 5 },
    { name: 'James R.', text: 'The ambiance is gorgeous and the charred steak was cooked to absolute perfection.', stars: 5 },
    { name: 'Priya K.', text: 'Warm service, beautiful plating, and food that actually lives up to its reputation.', stars: 5 },
  ]

  return (
    <>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Seasonal Dining • Downtown</p>
          <h1>Where every plate feels like a celebration.</h1>
          <p className="hero-text">
            Discover handcrafted dishes, warm hospitality, and intimate evenings at our modern restaurant. 
            Locally sourced. Artfully prepared. Unforgettable.
          </p>
          <div className="hero-actions">
            <button onClick={() => onBookTable()} className="button primary">Book a Table</button>
            <a href="#featured" className="button secondary">Explore Dishes</a>
          </div>
        </div>
        <div className="hero-img-wrap">
          <img src="/hero_food.png" alt="Signature restaurant dishes" className="hero-food-img" />
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">12+</span>
          <span className="stat-label">Years of Excellence</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">40+</span>
          <span className="stat-label">Seasonal Dishes</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">98%</span>
          <span className="stat-label">Guest Satisfaction</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">3</span>
          <span className="stat-label">Michelin Stars</span>
        </div>
      </div>

      {/* Featured Dishes */}
      <section className="section" id="featured">
        <div className="section-heading">
          <p className="eyebrow">Signature dishes</p>
          <h2>Fresh ingredients, bold flavor.</h2>
          <p className="section-sub">Our kitchen sources the finest local and seasonal produce to craft every dish.</p>
        </div>
        <div className="featured-grid">
          {featuredDishes.map((dish) => (
            <article className="featured-card" key={dish.name}>
              <div className="featured-img-wrap">
                <img src={dish.image} alt={dish.name} className="featured-img" />
                <span className="featured-badge">{dish.badge}</span>
              </div>
              <div className="featured-body">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="featured-footer">
                  <strong className="featured-price">{dish.price}</strong>
                  <button onClick={() => onBookTable()} className="button primary sm-btn">Reserve</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About Snippet */}
      <section className="section about-snippet">
        <div className="about-snippet-content">
          <div className="about-snippet-text">
            <p className="eyebrow">Our Story</p>
            <h2>A passion for food, a love for people.</h2>
            <p>
              Founded in 2012, L'Ambroisie began as a small neighbourhood bistro with one simple mission: 
              to make people feel genuinely welcomed while eating extraordinary food. 
              Twelve years later, we've grown, earned recognition, and stayed true to that same heart.
            </p>
            <a href="#about" className="button primary" style={{display:'inline-block', marginTop:'18px'}}>Our Full Story</a>
          </div>
          <div className="about-snippet-visual">
            <div className="about-visual-card">
              <p className="quote-mark">"</p>
              <p className="quote-text">We cook with the seasons and serve with the soul.</p>
              <p className="quote-author">— Chef Antoine Beaumont, Executive Chef</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section-heading">
          <p className="eyebrow">Guest Reviews</p>
          <h2>Words from our guests.</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <p className="testimonial-name">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready for an unforgettable evening?</h2>
          <p>Reserve your table today and experience fine dining at its very best.</p>
          <button onClick={() => onBookTable()} className="button primary lg-btn">Book Your Table Now</button>
        </div>
      </section>
    </>
  )
}

export default HomePage
