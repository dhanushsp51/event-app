const path = require('path')
const fs = require('fs')
const express = require('express')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = Number(process.env.PORT || 8787)
const requiredEnv = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'OWNER_EMAIL']
let smtpStatus = 'not-configured'

app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (req, res) => {
  res.json({
    emailConfigured: Boolean(createTransporter()),
    smtpStatus,
    queuedBookings: fs.existsSync(path.join(__dirname, 'data', 'bookings.json')),
  })
})

function createTransporter() {
  if (requiredEnv.some((key) => !process.env[key])) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, ''),
    },
  })
}

function saveBooking(booking) {
  const dataDirectory = path.join(__dirname, 'data')
  const bookingsFile = path.join(dataDirectory, 'bookings.json')
  fs.mkdirSync(dataDirectory, { recursive: true })
  let bookings = []
  if (fs.existsSync(bookingsFile)) {
    try {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'))
    } catch {
      bookings = []
    }
  }
  bookings.push({ ...booking, receivedAt: new Date().toISOString() })
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2))
}

app.post('/api/bookings', async (req, res) => {
  const { name, email, date, guests, type } = req.body || {}
  if (!name || !email || !date || !guests || !type || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide valid booking details.' })
  }

  const transporter = createTransporter()
  if (!transporter) {
    saveBooking({ name, email, date, guests, type })
    console.warn('Booking queued locally because email delivery is not configured.')
    return res.status(503).json({ queued: true, message: 'Booking delivery is temporarily unavailable.' })
  }

  try {
    await transporter.sendMail({
      from: `"Celebration Craft" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Celebration Craft booking from ${name}`,
      text: [
        'New booking request',
        `Name: ${name}`,
        `Email: ${email}`,
        `Celebration date: ${date}`,
        `Guests: ${guests}`,
        `Package: ${type}`,
      ].join('\n'),
    })
    return res.status(204).end()
  } catch (error) {
    console.error('Booking email failed:', error.message)
    saveBooking({ name, email, date, guests, type })
    return res.status(503).json({ queued: true, message: 'Booking delivery is temporarily unavailable.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist')
  app.use(express.static(distPath))
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')))
}

app.listen(port, () => {
  console.log(`Celebration Craft email server running on http://localhost:${port}`)
  if (!createTransporter()) {
    smtpStatus = 'not-configured'
    console.warn('Email delivery is disabled: create a private .env file from .env.example.')
  } else {
    createTransporter().verify()
      .then(() => {
        smtpStatus = 'verified'
        console.log('Gmail SMTP connection verified.')
      })
      .catch((error) => {
        smtpStatus = 'authentication-failed'
        console.error('Gmail SMTP verification failed:', error.message)
      })
  }
})
