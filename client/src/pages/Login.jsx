import React, { useState, useTransition } from 'react'
import { useUserLogin } from '../hooks/useUsers'
import { FloatingLabel, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'

const Login = () => {
    const { loading, loginUser } = useUserLogin()

    const [user, setUser] = useState({
        email: '',
        password: '',
    })

    const handleSignIn = async (e) => {
        e.preventDefault()
        await loginUser(user)
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
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Your email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            disabled={loading}
                        />
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
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
