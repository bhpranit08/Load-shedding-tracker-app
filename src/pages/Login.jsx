import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Alert, FloatingLabel, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleSignIn = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        const { error, data } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Login successful. Redirecting to your dashboard soon.')
            localStorage.setItem("jwt", data.session.access_token)
        }
        setLoading(false)
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="glass-panel grid gap-10 px-6 py-10 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="accent-pill inline-flex px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
                        Secure access
                    </div>
                    <h1 className="text-4xl font-semibold text-white">Welcome back to the outage command center</h1>
                    <p className="text-base text-slate-300">
                        Authenticate to unlock real-time telemetry, predictive alerts, and responder tools tailored to your grid perimeter.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="glow-card p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Average response</p>
                            <p className="mt-2 text-3xl font-semibold text-white">4.2m</p>
                            <p className="text-sm text-slate-400">From login to dispatch</p>
                        </div>
                        <div className="glow-card p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Coverage</p>
                            <p className="mt-2 text-3xl font-semibold text-white">78%</p>
                            <p className="text-sm text-slate-400">Of national grid</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSignIn} className="glass-panel border border-white/5 bg-slate-900/60 p-8">
                    <h2 className="text-2xl font-semibold text-white">Sign in</h2>
                    <p className="text-sm text-slate-400">Use your verified email credentials.</p>
                    <div className="mt-6 space-y-4">
                        {error && <Alert color="failure">{error}</Alert>}
                        {message && <Alert color="success">{message}</Alert>}
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-linear-to-r from-sky-400 via-cyan-500 to-indigo-600 text-base font-semibold text-slate-900 transition hover:scale-[1.01] disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Access dashboard'}
                        </Button>
                        <p className="text-sm text-slate-400">
                            Need an account?{' '}
                            <Link to="/register" className="text-sky-300 underline underline-offset-4">
                                Create one here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
