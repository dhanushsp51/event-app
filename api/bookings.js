import nodemailer from 'nodemailer'

function getTransporter() {
  const user = process.env.GMAIL_USER
  const password = process.env.GMAIL_APP_PASSWORD
  if (!user || !password) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password.replace(/\s+/g, '') },
  })
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, date, guests, type } = request.body || {}
  if (!name || !email || !date || !guests || !type || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ message: 'Please provide valid booking details.' })
  }

  const transporter = getTransporter()
  if (!transporter) {
    console.error('Gmail environment variables are not configured in Vercel.')
    return response.status(503).json({ message: 'Booking delivery is temporarily unavailable.' })
  }

  try {
    await transporter.sendMail({
      from: `"Celebration Craft" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.GMAIL_USER,
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
    return response.status(204).end()
  } catch (error) {
    console.error('Booking email failed:', error.message)
    return response.status(502).json({ message: 'Booking delivery is temporarily unavailable.' })
  }
}
