import React, { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const initialEvents = [
  { id: 1, name: 'Golden Birthday Glow', category: 'Birthday', emoji: '🎂', price: 249, description: 'A joyful, color-filled birthday setup with all the little details.', color: 'peach', tags: ['Balloons', 'Cake table'] },
  { id: 2, name: 'Marigold Haldi Soirée', category: 'Haldi', emoji: '🌼', price: 399, description: 'Sunny marigolds, playful florals and a picture-perfect haldi corner.', color: 'yellow', tags: ['Florals', 'Photo wall'] },
  { id: 3, name: 'Forever Starts Here', category: 'Marriage', emoji: '💍', price: 899, description: 'An elegant, romantic celebration designed around your love story.', color: 'lavender', tags: ['Mandap', 'Welcome table'] },
  { id: 4, name: 'Little Love Story', category: 'Baby Shower', emoji: '🧸', price: 349, description: 'A sweet, storybook-inspired shower for the newest little arrival.', color: 'mint', tags: ['Games', 'Dessert bar'] },
  { id: 5, name: 'Rooftop Birthday Club', category: 'Birthday', emoji: '🎈', price: 499, description: 'A vibrant rooftop evening with lights, music and a custom backdrop.', color: 'blue', tags: ['String lights', 'DJ corner'] },
  { id: 6, name: 'Luxe Mehndi Night', category: 'Haldi', emoji: '✨', price: 599, description: 'A lush, modern mehndi setup made for dancing and beautiful photos.', color: 'pink', tags: ['Cushion lounge', 'Live dhol'] },
]

const categories = [
  { name: 'Birthday', emoji: '🎂', blurb: 'Make their day extra sweet', color: 'peach' },
  { name: 'Haldi', emoji: '🌼', blurb: 'A little sunshine & tradition', color: 'yellow' },
  { name: 'Marriage', emoji: '💍', blurb: 'Celebrate your forever', color: 'lavender' },
  { name: 'Baby Shower', emoji: '🧸', blurb: 'Welcome your little wonder', color: 'mint' },
]

function getPath() {
  const path = window.location.pathname.replace(/^\/event-app/, '')
  return path === '/' || path === '' ? 'home' : path.slice(1)
}

function navigate(path) {
  window.history.pushState({}, '', `/event-app${path}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function App() {
  const [page, setPage] = useState(getPath)
  const [events, setEvents] = useState(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState('')

  useEffect(() => {
    const handlePopState = () => setPage(getPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const goToBook = (eventName = '') => {
    setSelectedEvent(eventName)
    navigate('/book')
  }

  return (
    <div className="app-shell">
      <AnimatedEmojis />
      <Header page={page} />
      <main>
        {page === 'home' && <Home onBrowse={() => navigate('/events')} onBook={goToBook} />}
        {page === 'events' && <Events events={events} onBook={goToBook} />}
        {page === 'book' && <Booking events={events} selectedEvent={selectedEvent} onBooked={() => setSelectedEvent('')} />}
        {page === 'create' && <CreateEvent onCreate={(event) => setEvents((current) => [...current, { ...event, id: Date.now() }])} />}
        {!['home', 'events', 'book', 'create'].includes(page) && <NotFound />}
      </main>
      <Footer />
    </div>
  )
}

function AnimatedEmojis() {
  return <div className="emoji-rain" aria-hidden="true">
    <span className="emoji-float e1">🎉</span><span className="emoji-float e2">✨</span>
    <span className="emoji-float e3">💖</span><span className="emoji-float e4">🎈</span>
    <span className="emoji-float e5">🌈</span><span className="emoji-float e6">🪩</span>
  </div>
}

function Header({ page }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('/')} aria-label="Go to home">
        <span className="brand-mark">✦</span>
        <span>celebration<span className="brand-accent">craft</span></span>
      </button>
      <nav className="nav-links" aria-label="Main navigation">
        <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('/')}>Home</button>
        <button className={page === 'events' ? 'active' : ''} onClick={() => navigate('/events')}>Explore events</button>
        <button className={page === 'create' ? 'active' : ''} onClick={() => navigate('/create')}>Create a theme</button>
      </nav>
      <button className="header-cta" onClick={() => navigate('/book')}>Plan my event <span>↗</span></button>
    </header>
  )
}

function Home({ onBrowse, onBook }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Curated celebrations, made personal</div>
          <h1>Big feelings.<br /><em>Beautifully</em> celebrated.</h1>
          <p>From the first idea to the final confetti pop, we craft warm, wonderful moments that feel entirely yours.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={onBrowse}>Explore celebrations <span>→</span></button>
            <button className="text-button" onClick={() => onBook()}>Tell us your dream <span>↗</span></button>
          </div>
          <div className="social-proof"><div className="avatars"><span>👩🏻</span><span>👨🏽</span><span>👩🏾</span><span>👨🏻</span></div><span><strong>4.9/5</strong> from 200+ happy hosts</span></div>
        </div>
        <div className="hero-art" aria-label="Celebration illustration">
          <div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="sparkle s3">✦</div>
          <div className="arch arch-back" /><div className="arch arch-front" />
          <div className="hero-card card-one"><span>🎈</span><strong>the little<br />details</strong></div>
          <div className="hero-card card-two"><span>🌼</span><strong>joy looks<br />good on you</strong></div>
          <div className="hero-note">made with <span>♡</span><br />in every detail</div>
          <div className="confetti">·　✦　·<br />✧　·　✦</div>
        </div>
      </section>
      <section className="category-section">
        <div className="section-heading"><div><p className="eyebrow">Find your moment</p><h2>What are we celebrating?</h2></div><button className="arrow-link" onClick={onBrowse}>See all events <span>→</span></button></div>
        <div className="category-grid">{categories.map((category) => <CategoryCard key={category.name} category={category} onClick={() => { onBrowse(); }} />)}</div>
      </section>
      <section className="quote-strip"><span>“</span><p>We don't just set up a party.<br /><em>We set the feeling.</em></p><span>”</span></section>
    </>
  )
}

function CategoryCard({ category, onClick }) {
  return <button className={`category-card ${category.color}`} onClick={onClick}><span className="category-emoji">{category.emoji}</span><span className="category-name">{category.name}</span><span className="category-blurb">{category.blurb}</span><span className="card-arrow">↗</span></button>
}

function Events({ events, onBook }) {
  const [query, setQuery] = useState('')
  const filtered = events.filter((event) => `${event.name} ${event.category} ${event.description}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="page-section events-page">
    <div className="page-intro"><div><p className="eyebrow">The celebration menu</p><h1>Find your <em>kind</em> of magic.</h1><p>Every package is a starting point. We’ll make it feel like yours.</p></div><div className="page-sticker">✨<small>good vibes<br />only</small></div></div>
    <div className="search-wrap"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search birthdays, florals, cozy..." aria-label="Search events" /></div>
    <div className="results-meta"><span>{filtered.length} celebrations to explore</span>{query && <button onClick={() => setQuery('')}>Clear search ×</button>}</div>
    <div className="event-grid">{filtered.map((event) => <EventCard key={event.id} event={event} onBook={() => onBook(event.name)} />)}</div>
    {!filtered.length && <div className="empty-state">No celebrations found. Try a different little idea ✨</div>}
  </section>
}

function EventCard({ event, onBook }) {
  return <article className={`event-card ${event.color}`}><div className="event-visual"><span>{event.emoji}</span><div className="visual-dots">✦　·　✧</div></div><div className="event-content"><div className="event-topline"><span className="category-label">{event.category}</span><span className="price">from <strong>${event.price}</strong></span></div><h3>{event.name}</h3><p>{event.description}</p><div className="tag-row">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="button button-dark small" onClick={onBook}>Book this feeling <span>→</span></button></div></article>
}

function Booking({ events, selectedEvent, onBooked }) {
  const [form, setForm] = useState({ name: '', email: '', date: '', guests: '', type: selectedEvent || '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Tell us your name'
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Add a valid email'
    if (!form.date) nextErrors.date = 'Pick a date'
    if (!form.guests || Number(form.guests) < 1) nextErrors.guests = 'Add guest count'
    if (!form.type) nextErrors.type = 'Choose a celebration'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSending(true)
    setSendError('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          date: form.date,
          guests: form.guests,
          type: form.type,
        }),
      })
      if (!response.ok) throw new Error('booking-request-failed')
      setSubmitted(true)
    } catch (error) {
      setSendError(error.message === 'booking-request-failed'
        ? 'We could not receive your request right now. Please try again in a moment.'
        : 'Please check your connection and try again.')
    } finally {
      setIsSending(false)
    }
  }
  if (submitted) return <section className="success-panel page-section"><div className="success-confetti">🎉 ✨ 🎊</div><p className="eyebrow">Request received</p><h1>Let the magic <em>begin.</em></h1><p>Thanks, {form.name.split(' ')[0]}! Your booking details were sent to our celebration team. We’ll send a lovingly crafted proposal to <strong>{form.email}</strong> within one business day.</p><button className="button button-dark" onClick={() => { setSubmitted(false); onBooked() }}>Plan another moment <span>→</span></button></section>
  return <section className="page-section booking-page"><div className="form-intro"><p className="eyebrow">Let’s make it real</p><h1>Your dream day,<br /><em>starts here.</em></h1><p>Share a few details and our celebration stylist will be in touch with ideas made just for you.</p><div className="form-aside">“The best parties are the ones where you can feel the love in the room.” <span>— Celebration Craft</span></div></div><form className="booking-form" onSubmit={submit} noValidate><div className="form-row"><Field label="Your name" error={errors.name}><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Maya Sharma" /></Field><Field label="Email address" error={errors.email}><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></Field></div><div className="form-row"><Field label="Celebration date" error={errors.date}><input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></Field><Field label="Number of guests" error={errors.guests}><input type="number" min="1" value={form.guests} onChange={(e) => update('guests', e.target.value)} placeholder="e.g. 50" /></Field></div><Field label="What are we celebrating?" error={errors.type}><select value={form.type} onChange={(e) => update('type', e.target.value)}><option value="">Choose a celebration...</option>{events.map((event) => <option key={event.id} value={event.name}>{event.name} · {event.category}</option>)}</select></Field><button className="button button-dark submit-button" type="submit" disabled={isSending}>{isSending ? 'Sending your celebration brief...' : 'Send my celebration brief'} <span>{isSending ? '⌛' : '↗'}</span></button>{sendError && <p className="send-error" role="alert">{sendError}</p>}<p className="privacy-note">Your details are sent securely. No spam, just good things ♡</p></form></section>
}

function Field({ label, error, children }) { return <label className={`field ${error ? 'has-error' : ''}`}><span>{label}</span>{children}{error && <small>{error}</small>}</label> }

function CreateEvent({ onCreate }) {
  const [form, setForm] = useState({ name: '', category: 'Birthday', price: '', description: '' })
  const [created, setCreated] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => { event.preventDefault(); if (!form.name.trim() || !form.price || !form.description.trim()) return; onCreate({ ...form, price: Number(form.price), emoji: form.category === 'Birthday' ? '🎂' : form.category === 'Haldi' ? '🌼' : form.category === 'Marriage' ? '💍' : '🧸', color: 'peach', tags: ['Your idea', 'Made with love'] }); setForm({ name: '', category: 'Birthday', price: '', description: '' }); setCreated(true); setTimeout(() => setCreated(false), 3500) }
  return <section className="page-section create-page"><div className="create-visual"><div className="big-sticker">🪩</div><span className="orbit orbit-one">✦</span><span className="orbit orbit-two">♡</span><p className="eyebrow">Your imagination, live</p><h1>Make a little<br /><em>magic of your own.</em></h1><p>Have an idea we haven’t thought of? Add it to the menu and make it part of the celebration story.</p></div><form className="create-form" onSubmit={submit}><div className="form-top"><p className="eyebrow">Create a custom package</p><h2>What’s your vibe?</h2></div><Field label="Package name"><input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Sunset Picnic Party" /></Field><div className="form-row"><Field label="Celebration category"><select value={form.category} onChange={(e) => update('category', e.target.value)}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></Field><Field label="Starting price ($)"><input required type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="299" /></Field></div><Field label="Describe the feeling"><textarea required rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell future hosts what makes this celebration special..." /></Field><button className="button button-dark submit-button" type="submit">Add to the celebration menu <span>✦</span></button>{created && <div className="toast">Added! Your idea is now live in Explore events 🎉</div>}</form></section>
}

function NotFound() { return <section className="page-section not-found"><div className="big-sticker">🫧</div><h1>Oops, that moment<br /><em>hasn't arrived yet.</em></h1><button className="button button-dark" onClick={() => navigate('/')}>Back to home <span>→</span></button></section> }
function Footer() { return <footer><button className="brand" onClick={() => navigate('/')}><span className="brand-mark">✦</span><span>celebration<span className="brand-accent">craft</span></span></button><span>Made for moments that matter ♡</span><span>© 2024 Celebration Craft</span></footer> }

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
