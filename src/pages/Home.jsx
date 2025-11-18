import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { FloatingLabel, Button, Alert, Spinner, Label, Textarea } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const [description, setDescription] = useState('')
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [locationLoading, setLocationLoading] = useState(true)
    const [locationError, setLocationError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUsers()
            setUser(user)
            if (!user) {
                navigate('/login')
            }
        }

        getSession()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            if (!session?.user) {
                navigate('/login')
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [navigate])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                    setLocationLoading(false)
                },
                (error) => {
                    setLocationError(error.message)
                    setLocationLoading(false)
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            )
        } else {
            setLocationError('Geolocation is not supported by your browser.')
            setLocationLoading(false)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        setSubmitSuccess(false)

        if (!user) {
            setSubmitError('You must be logged in to report an outage.')
            return
        }

        if (locationError || latitude === null || longitude === null) {
            setSubmitError("Couldn't get your location. Please enable location services.")
        }

        setSubmitting(true)

        const { error } = await supabase.from('outages').insert([
            {
                latitude,
                longitude,
                description,
                user_id: user.id,
                status: 'unconfirmed'
            }
        ])

        if (error) {
            setSubmitError(error.message)
        } else {
            setSubmitSuccess(true)
            setDescription('')
            setTimeout(() => navigate('/map'), 2000)
        }
        setSubmitting(false)
    }

    if (!user) {
        return (
            <div className="glass-panel mx-auto flex h-[320px] max-w-md flex-col items-center justify-center gap-4 text-center">
                <Spinner aria-label="Loading user session" color="info" size="xl" />
                <div>
                    <p className="text-lg font-semibold text-white">Checking your session</p>
                    <p className="text-sm text-slate-300">Authenticating with Supabase</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="glass-panel relative overflow-hidden p-8">
                    <div className="floating-badge absolute right-8 top-8 rounded-full bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
                        Live
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="accent-pill inline-flex px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
                                Smart outage desk
                            </div>
                            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                                Pinpoint outages in seconds and keep your city powered
                            </h1>
                            <p className="text-base text-slate-300">
                                Capture hyperlocal reports with auto-detected coordinates, pulse updates, and predictive insights for operations teams.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="glow-card p-4 text-center">
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Your coords</p>
                                <p className="mt-2 text-lg font-semibold text-white">{latitude ? latitude.toFixed(4) : '--'}</p>
                            </div>
                            <div className="glow-card p-4 text-center">
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Signal</p>
                                <p className="mt-2 text-lg font-semibold text-white">{locationLoading ? 'Scanning' : locationError ? 'Blocked' : 'Locked'}</p>
                            </div>
                            <div className="glow-card p-4 text-center">
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Queue</p>
                                <p className="mt-2 text-lg font-semibold text-white">{submitSuccess ? 'Scheduled' : 'Awaiting'}</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="glass-panel border border-white/5 bg-white/5 p-5">
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Response target</p>
                                <p className="mt-2 text-3xl font-bold text-white">07m 42s</p>
                                <p className="text-sm text-slate-400">Average verification turnaround</p>
                            </div>
                            <div className="glass-panel border border-white/5 bg-white/5 p-5">
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Coverage</p>
                                <p className="mt-2 text-3xl font-bold text-white">124 districts</p>
                                <p className="text-sm text-slate-400">Synced with municipal watchers</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="glass-panel relative p-8">
                    <div className="absolute inset-x-6 top-6 z-0 h-32 rounded-3xl bg-linear-to-r from-cyan-500/20 via-sky-500/20 to-indigo-500/20 blur-3xl" />
                    <form className="relative z-10 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-semibold text-white">Report an outage</h2>
                        <p className="text-sm text-slate-300">
                            We attach your coordinates and deliver them to grid administrators instantly.
                        </p>
                        {locationLoading && (
                            <Alert color="info" icon={Spinner}>
                                Getting your current location...
                            </Alert>
                        )}
                        {locationError && (
                            <Alert color="failure">Error getting location: {locationError}. Please enable location services.</Alert>
                        )}
                        {submitError && <Alert color="failure">{submitError}</Alert>}
                        {submitSuccess && <Alert color="success">Outage reported successfully. Redirecting to map...</Alert>}
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Your Latitude"
                            type="text"
                            value={latitude ?? ''}
                            readOnly
                            disabled
                        />
                        <FloatingLabel
                            variant="standard"
                            color="default"
                            label="Your Longitude"
                            type="text"
                            value={longitude ?? ''}
                            readOnly
                            disabled
                        />
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description (optional)" className="text-slate-200" />
                            </div>
                            <Textarea
                                id="description"
                                placeholder="e.g., Power outage with fluctuating voltage on Riverside block B."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={submitting || locationLoading || locationError || !user}
                            className="relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-500 text-base font-semibold text-slate-900 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" />
                            {submitting ? 'Submitting...' : 'Submit outage report'}
                        </Button>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Home

