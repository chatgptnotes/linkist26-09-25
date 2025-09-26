import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/auth-middleware'

const ADMIN_PIN = process.env.ADMIN_PIN || '1234'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin) {
      return NextResponse.json(
        { success: false, error: 'PIN is required' },
        { status: 400 }
      )
    }

    // Verify admin PIN
    if (pin !== ADMIN_PIN) {
      console.log(`❌ Invalid admin PIN attempt: ${pin}`)
      return NextResponse.json(
        { success: false, error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Create admin session token
    const sessionToken = await createAdminSession()
    
    console.log('✅ Admin login successful')

    // Set secure cookie with the session token
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful'
    })

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    console.log('🚪 Admin logout requested')
    
    // Clear admin session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}