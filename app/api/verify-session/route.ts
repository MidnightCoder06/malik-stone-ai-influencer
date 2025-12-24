import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('chat_session')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.paid) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      valid: true,
      expiresAt: payload.exp 
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Session expired or invalid' },
      { status: 401 }
    )
  }
}

