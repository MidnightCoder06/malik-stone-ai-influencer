import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY || '', {
  apiVersion: '2023-10-16',
})

// Secret for signing session tokens
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Create a session token (valid for 24 hours)
    const token = await new SignJWT({ 
      sessionId: session.id,
      paid: true,
      createdAt: Date.now()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Redirect to chat page with session cookie
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = NextResponse.redirect(new URL('/chat', baseUrl))
    
    // Set HTTP-only cookie for security
    response.cookies.set('chat_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

