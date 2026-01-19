import { createClient } from './supabase/client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers = new Headers(options.headers)
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }
  headers.set('Content-Type', 'application/json')

  console.log(`[API] Request: ${path}`, options)
  
  // Ensure no double slashes
  const cleanUrl = `${BACKEND_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
  
  const response = await fetch(cleanUrl, {
    ...options,
    headers,
  })

  console.log(`[API] Response: ${response.status} ${response.statusText}`)

  if (!response.ok) {
    const error = await response.json()
    console.error(`[API] Error:`, error)
    throw new Error(error.error || 'API request failed')
  }

  return response.json()
}
