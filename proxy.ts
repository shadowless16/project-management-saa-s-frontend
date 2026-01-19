import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  console.log('[Proxy Checking] URL:', request.nextUrl.pathname)
  console.log('[Proxy Config] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[Proxy Config] Key Start:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10))
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
