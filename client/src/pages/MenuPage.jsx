import { useState } from 'react'

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks']

const allMenuItems = [
  // Starters
  {
    name: 'Burrata & Heirloom Tomatoes',
    price: '$14',
    description: 'Creamy burrata over sliced heirloom tomatoes, basil oil, sea salt flakes and toasted pine nuts.',
    category: 'Starters',
    image: '/menu_salad.png',
    tag: 'Vegetarian',
  },
  {
    name: 'Garden Glow Salad',
    price: '$12',
    description: 'Mixed greens, citrus segments, toasted seeds, radish, and a light citrus vinaigrette.',
    category: 'Starters',
    image: '/menu_salad.png',
    tag: 'Vegan',
  },
  {
    name: 'Seared Scallops',
    price: '$19',
    description: 'Pan-seared scallops over pea purée, crispy pancetta, and lemon butter sauce.',
    category: 'Starters',
    image: '/menu_risotto.png',
    tag: 'Signature',
  },

  // Mains
  {
    name: 'Smoked Tomato Pasta',
    price: '$18',
    description: 'Creamy smoked tomato sauce, al dente spaghetti, fresh basil, shaved parmesan and extra virgin olive oil.',
    category: 'Mains',
    image: '/menu_pasta.png',
    tag: 'Vegetarian',
  },
  {
    name: 'Charred Steak',
    price: '$24',
    description: 'Prime cut rib-eye, seared to perfection, served with golden garlic potatoes and herb butter.',
    category: 'Mains',
    image: '/menu_steak.png',
    tag: 'Bestseller',
  },
  {
    name: 'Truffle Mushroom Risotto',
    price: '$22',
    description: 'Wild mushroom risotto with truffle shavings, a parmesan crisp, and fragrant herb oil.',
    category: 'Mains',
    image: '/menu_risotto.png',
    tag: "Chef's Choice",
  },
  {
    name: 'Pan-Roasted Duck Breast',
    price: '$26',
    description: 'Slow-roasted duck breast with cherry jus, dauphinoise potatoes, and wilted greens.',
    category: 'Mains',
    image: '/menu_steak.png',
    tag: 'Seasonal',
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    price: '$11',
    description: 'Warm dark chocolate cake with a molten centre, vanilla bean ice cream, and raspberry coulis.',
    category: 'Desserts',
    image: '/menu_dessert.png',
    tag: 'Must Try',
  },
  {
    name: 'Crème Brûlée',
    price: '$10',
    description: 'Classic vanilla custard with a perfectly caramelised sugar top and fresh berries.',
    category: 'Desserts',
    image: '/menu_dessert.png',
    tag: 'Classic',
  },

  // Drinks
  {
    name: 'House Sangria',
    price: '$9',
    description: 'Red wine, fresh citrus juice, seasonal fruit, brandy and soda. Served chilled.',
    category: 'Drinks',
    image: '/menu_salad.png',
    tag: 'Signature',
  },
  {
    name: 'Sparkling Elderflower',
    price: '$7',
    description: 'Elderflower cordial, sparkling water, cucumber ribbons and mint. Refreshing and elegant.',
    category: 'Drinks',
    image: '/menu_salad.png',
    tag: 'Non-Alcoholic',
  },
]

function MenuPage({ onBookTable }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? allMenuItems
    : allMenuItems.filter(item => item.category === activeCategory)

  return (
    <main className="page-content">
      <div className="page-hero page-hero--menu">
        <div className="page-hero-content">
          <p className="eyebrow">Curated with care</p>
          <h1>Our Menu</h1>
          <p>Seasonal ingredients. Timeless recipes. Every dish tells a story.</p>
        </div>
      </div>

      <section className="section">
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-full-grid">
          {filtered.map((item) => (
            <article className="menu-full-card" key={item.name}>
              <div className="menu-full-img-wrap">
                <img src={item.image} alt={item.name} className="menu-full-img" />
                {item.tag && <span className="menu-tag">{item.tag}</span>}
              </div>
              <div className="menu-full-body">
                <div className="menu-full-header">
                  <h3>{item.name}</h3>
                  <strong className="menu-full-price">{item.price}</strong>
                </div>
                <p className="menu-full-desc">{item.description}</p>
                <span className="menu-category-pill">{item.category}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="menu-cta-row">
        <p>Ready to taste these dishes in person?</p>
        <button onClick={() => onBookTable()} className="button primary">Reserve Your Table</button>
      </div>
    </main>
  )
}

export default MenuPage
