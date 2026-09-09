'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function testConnection() {
            try {
                const { error } = await supabase.from('_test_connection').select('*').limit(1)

                // Note: _test_connection probably doesn't exist, but we just want to see if the client initializes 
                // and can reach the API. If it's a 404 or empty data, it's still a "success" in terms of connection.
                // PGRST204 / PGRST205 is "relation does not exist" which means we reached the server!
                if (error && error.code !== 'PGRST116' && error.code !== 'PGRST204' && error.code !== 'PGRST205' && error.code !== '42P01') {
                    throw error
                }

                setStatus('success')
                setMessage('Successfully connected to Supabase!')
            } catch (err: unknown) {
                console.error('Supabase connection error:', err)
                setStatus('error')
                setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown Supabase connection error'}`)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-950 text-white">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Supabase Integration Test
            </h1>

            <div className={`p-6 rounded-xl border ${status === 'loading' ? 'border-zinc-800 bg-zinc-900/50' :
                status === 'success' ? 'border-emerald-500/30 bg-emerald-500/10' :
                    'border-red-500/30 bg-red-500/10'
                } max-w-md w-full text-center shadow-2xl backdrop-blur-sm transition-all duration-300`}>
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-zinc-400">Testing connection...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-medium text-emerald-400">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="font-medium text-red-400">{message}</p>
                    </div>
                )}
            </div>

            <div className="mt-12 text-zinc-500 text-sm max-w-lg text-center leading-relaxed">
                This page verifies that the `@supabase/supabase-js` client is correctly initialized with your environment variables and can communicate with your Supabase project.
            </div>

            <Link
                href="/"
                className="mt-8 px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-zinc-300 text-sm font-medium"
            >
                Back to Home
            </Link>
        </div>
    )
}
