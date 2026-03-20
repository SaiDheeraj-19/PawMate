import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMatchEmail(to: string, ownerName: string, petName: string, matchPetName: string) {
  try {
    await resend.emails.send({
      from: 'PawMate <onboarding@resend.dev>',
      to,
      subject: `It's a Match! ${petName} and ${matchPetName} liked each other`,
      html: `
        <h1>Hi ${ownerName}!</h1>
        <p>Great news! Your pet <strong>${petName}</strong> just matched with <strong>${matchPetName}</strong> on PawMate.</p>
        <p>You can now start chatting and arrange a playdate.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches" style="background: #ef4444; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View Match</a>
      `,
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: 'PawMate <onboarding@resend.dev>',
      to,
      subject: 'Welcome to PawMate!',
      html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining the PawMate community.</p>`,
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}
