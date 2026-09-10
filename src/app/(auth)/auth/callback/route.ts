import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    // if "next" is in param, use it as the redirect URL
    // Default to business-info to ensure newly confirmed users start there
    const next = searchParams.get('next') ?? '/onboarding/business-info'

    if (error) {
        const params = new URLSearchParams({
            error: 'oauth_callback',
            message: errorDescription ?? error,
        })
        return NextResponse.redirect(`${origin}/login?${params.toString()}`)
    }

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        )
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (!exchangeError) {
            return NextResponse.redirect(`${origin}${next}`)
        }

        const params = new URLSearchParams({
            error: 'oauth_callback',
            message: exchangeError.message,
        })
        return NextResponse.redirect(`${origin}/login?${params.toString()}`)
    }

    const params = new URLSearchParams({
        error: 'oauth_callback',
        message: 'No authorization code was returned by the provider.',
    })
    return NextResponse.redirect(`${origin}/login?${params.toString()}`)
}
