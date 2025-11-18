import { useState, useEffect, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { Spinner } from 'flowbite-react'
import { supabase } from '../supabaseClient'

const nepalCenter = [28.3949, 84.124]

const markerPositions = [
    { top: '18%', left: '24%' },
    { top: '42%', left: '58%' },
    { top: '65%', left: '38%' },
    { top: '30%', left: '72%' },
    { top: '55%', left: '18%' }
]

const Map = () => {
    const [outages, setOutages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOutages = async () => {
            setLoading(true)
            const { data, error } = await supabase.from('outages').select('*').order('created_at', { ascending: false })
            if (error) {
                setError(error.message)
            } else {
                setOutages(data || [])
            }
            setLoading(false)
        }

        fetchOutages()

        const subscription = supabase
            .channel('outages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'outages' }, (payload) => {
                setOutages((currentOutages) => [payload.new, ...currentOutages])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const createCustomIcon = (status) =>
        divIcon({
            html: `<span class="marker-pin ${status ?? 'pending'}"></span>`,
            iconSize: [36, 36],
            className: 'leaflet-div-icon'
        })

    const stats = useMemo(() => {
        const active = outages.filter((o) => o.status !== 'resolved').length
        const confirmed = outages.filter((o) => o.status === 'confirmed').length
        return [
            { label: 'Active outages', value: String(active).padStart(2, '0') },
            { label: 'Confirmed today', value: String(confirmed).padStart(2, '0') },
            { label: 'Awaiting review', value: String(outages.length - confirmed).padStart(2, '0') }
        ]
    }, [outages])

    return (
        <div className="space-y-10">
            <section className="glass-panel relative overflow-hidden p-8">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-cyan-500/20 via-sky-500/10 to-transparent blur-3xl md:block" />
                <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <div className="accent-pill inline-flex px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                            Live grid intelligence
                        </div>
                        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Visualize incidents as they unfold</h1>
                        <p className="text-base text-slate-300">
                            Monitor rolling blackouts, verify submissions, and anticipate areas at risk with a cinematic dashboard built for field teams.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {stats.map((item) => (
                                <div key={item.label} className="glow-card p-5 text-center">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-200">{item.label}</p>
                                    <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-panel bg-linear-to-br from-slate-900/60 via-slate-900/30 to-slate-900/80 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Status window</p>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-baseline justify-between">
                                <p className="text-5xl font-semibold text-white">{outages.length.toString().padStart(2, '0')}</p>
                                <p className="text-sm text-slate-400">Signals in view</p>
                            </div>
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <p className="text-sm text-slate-400">Refresh cadence</p>
                                <p className="text-lg font-medium text-white">45 seconds</p>
                            </div>
                            <div className="rounded-3xl bg-slate-900/80 p-4">
                                <p className="text-sm text-slate-400">Mode</p>
                                <p className="text-lg font-medium text-white">Predictive overlay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Geo canvas</p>
                            <p className="text-lg font-semibold text-white">Aggregated outage map</p>
                        </div>
                        <div className="accent-pill px-4 py-1 text-xs text-sky-200">Layered view</div>
                    </div>
                    <div className="relative mt-6 h-[480px] overflow-hidden rounded-3xl border border-white/5 bg-slate-950/80">
                        <MapContainer center={nepalCenter} zoom={7} scrollWheelZoom className="h-full w-full">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {outages.map((outage) => (
                                <Marker key={outage.id} position={[outage.latitude, outage.longitude]} icon={createCustomIcon(outage.status)}>
                                    <Popup>
                                        <div className="space-y-1 text-slate-800">
                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Status</p>
                                            <p className="text-base font-bold capitalize">
                                                {outage.status ?? 'pending'}
                                            </p>
                                            <p className="text-sm">{outage.description || 'No description provided.'}</p>
                                            <p className="text-xs text-slate-500">{new Date(outage.created_at).toLocaleString()}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70 text-center">
                                <Spinner size="xl" color="info" />
                                <p className="text-sm text-slate-300">Syncing outage coordinates...</p>
                            </div>
                        )}
                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 text-center text-red-300">{error}</div>
                        )}
                    </div>
                </div>
                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Incident feed</p>
                            <p className="text-lg font-semibold text-white">Most recent submissions</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Sorted by time</p>
                            <p className="text-sm font-medium text-white">Newest first</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-5">
                        {outages.length === 0 && !loading && !error && (
                            <p className="text-sm text-slate-400">No outage reports yet. Submit one from the home screen.</p>
                        )}
                        {outages.slice(0, 8).map((outage, index) => (
                            <div key={outage.id ?? index} className="flex items-start justify-between rounded-3xl border border-white/5 bg-slate-900/60 p-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Report #{String(index + 1).padStart(2, '0')}</p>
                                    <p className="mt-1 text-lg font-semibold text-white">{outage.description || 'No description provided'}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {outage.latitude?.toFixed(3)}, {outage.longitude?.toFixed(3)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
                                    <p className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${outage.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-200' : outage.status === 'resolved' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-amber-500/20 text-amber-200'}`}>
                                        {outage.status ?? 'pending'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="glass-panel p-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {markerPositions.map((marker, index) => (
                        <div key={index} className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Signal wave #{index + 1}</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{Math.round(Math.random() * 40 + 60)}%</p>
                            <p className="text-sm text-slate-400">Predictive confidence</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Map

