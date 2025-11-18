import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Alert, FloatingLabel, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleRegister = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Registration successful. Confirm via the email we just sent.')
        }
        setLoading(false)
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="glass-panel grid gap-10 px-6 py-10 lg:grid-cols-2">
                <form onSubmit={handleRegister} className="glass-panel border border-white/5 bg-slate-900/60 p-8">
                    <h2 className="text-2xl font-semibold text-white">Create an account</h2>
                    <p className="text-sm text-slate-400">Deploy outage intelligence with a single profile.</p>
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
                            className="w-full rounded-2xl bg-linear-to-r from-emerald-400 via-cyan-500 to-sky-500 text-base font-semibold text-slate-900 transition hover:scale-[1.01] disabled:opacity-60"
                        >
                            {loading ? 'Creating profile...' : 'Launch workspace'}
                        </Button>
                        <p className="text-sm text-slate-400">
                            Already verified?{' '}
                            <Link to="/login" className="text-sky-300 underline underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
                <div className="space-y-6">
                    <div className="accent-pill inline-flex px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
                        Elite tools
                    </div>
                    <h1 className="text-4xl font-semibold text-white">Engineer the brightest energy response network</h1>
                    <p className="text-base text-slate-300">
                        Unlock multi-city coverage, instant verifications, and orchestration-grade analytics with a single command console.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="glow-card p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Cities onboarding</p>
                            <p className="mt-2 text-3xl font-semibold text-white">32</p>
                            <p className="text-sm text-slate-400">Joining this quarter</p>
                        </div>
                        <div className="glow-card p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Trust rating</p>
                            <p className="mt-2 text-3xl font-semibold text-white">99.1%</p>
                            <p className="text-sm text-slate-400">Signal fidelity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
