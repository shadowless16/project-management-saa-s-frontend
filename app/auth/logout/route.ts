import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  // Sign out from Supabase
  await supabase.auth.signOut()

  // Redirect to login page
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/auth/login`)
}
