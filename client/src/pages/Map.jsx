import React, { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useGetOutages } from "../hooks/useReportOutage"
import { useLocation } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 30px;
                height: 30px;
                background-color: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
            "></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    })
}

const statusConfig = {
    unverified: { color: '#94a3b8', label: 'Unverified', badge: 'badge-ghost' },
    likely: { color: '#f59e0b', label: 'Likely', badge: 'badge-warning' },
    confirmed: { color: '#ef4444', label: 'Confirmed', badge: 'badge-error' },
    resolved: { color: '#10b981', label: 'Resolved', badge: 'badge-success' },
    'false': { color: '#6b7280', label: 'False Report', badge: 'badge-neutral' }
}

const Map = () => {
    const [selectedOutage, setSelectedOutage] = useState(null)
    const { allReports } = useGetOutages()
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const location = useLocation()

    const outages = useMemo(() => {
        const reports = allReports ?? []
        if (!from && !to) return reports
        return reports.filter((report) => {
            const reportedAt = report.reportedAt ? new Date(report.reportedAt).getTime() : 0
            const fromTime = from ? new Date(from + 'T00:00:00.000Z').getTime() : null
            const toTime = to ? new Date(to + 'T23:59:59.999Z').getTime() : null
            if (fromTime !== null && reportedAt < fromTime) return false
            if (toTime !== null && reportedAt > toTime) return false
            return true
        })
    }, [from, to, allReports])

    // If we navigated here with a selected outage ID in route state,
    // automatically select that outage once reports are loaded.
    useEffect(() => {
        const selectedOutageIdFromNav =
            location.state?.selectedOutageId ?? location.state?.selectedOutage

        if (!selectedOutageIdFromNav || !outages || outages.length === 0) return

        const match = outages.find((report) => report._id === selectedOutageIdFromNav)
        if (match) {
            setSelectedOutage(match)
        }
    }, [location.state, outages])

    const kathmanduCenter = [27.7172, 85.3240]

    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A'
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
            <div className="flex-1 relative min-w-0 min-h-[50vh] md:min-h-0">
                <MapContainer
                    center={kathmanduCenter}
                    zoom={13}
                    className="h-full w-full"
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {outages?.map((outage) => {
                        const [lng, lat] = outage.location.coordinates
                        const config = statusConfig[outage.status]

                        return (
                            <Marker
                                key={outage._id}
                                position={[lat, lng]}
                                icon={createCustomIcon(config.color)}
                                eventHandlers={{
                                    click: () => setSelectedOutage(outage)
                                }}
                            >
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <div className="font-bold text-base mb-1">{outage.area}</div>
                                        <div className={`badge ${config.badge} badge-sm`}>
                                            {config.label}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>

                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-base-100 rounded-lg shadow-lg p-3 md:p-4 z-1000 max-w-[calc(100vw-2rem)]">
                    <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 uppercase tracking-wide">Status Legend</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 md:block md:space-y-2">
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <div key={status} className="flex items-center gap-2 md:gap-3">
                                <div
                                    className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-sm shrink-0"
                                    style={{ backgroundColor: config.color }}
                                />
                                <span className="text-xs md:text-sm">{config.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2 md:gap-3 z-1000 max-w-[calc(100vw-2rem)]">
                    <div className="stats shadow bg-base-100">
                        <div className="stat py-2 px-3 md:py-3 md:px-4">
                            <div className="stat-title text-[10px] md:text-xs">Total</div>
                            <div className="stat-value text-lg md:text-2xl">{outages?.length}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat py-2 px-3 md:py-3 md:px-4">
                            <div className="stat-title text-[10px] md:text-xs">Confirmed</div>
                            <div className="stat-value text-lg md:text-2xl text-error">
                                {outages?.filter(o => o.status === 'confirmed').length}
                            </div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat py-2 px-3 md:py-3 md:px-4">
                            <div className="stat-title text-[10px] md:text-xs">Resolved</div>
                            <div className="stat-value text-lg md:text-2xl text-success">
                                {outages?.filter(o => o.status === 'resolved').length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col sm:flex-row gap-2 md:gap-3 z-1000 bg-base-100 rounded-lg shadow-lg p-3 md:p-4 max-w-[calc(100vw-2rem)]">
                    <label className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-semibold text-base-content">From</span>
                        <input
                            type="date"
                            className="input input-bordered input-sm bg-base-100 min-h-10"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-semibold text-base-content">To</span>
                        <input
                            type="date"
                            className="input input-bordered input-sm bg-base-100 min-h-10"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {selectedOutage ? (
                <>
                    <div className="fixed inset-0 bg-black/40 z-1000 md:hidden" onClick={() => setSelectedOutage(null)} aria-hidden />
                    <div className="fixed inset-x-0 bottom-0 z-1001 md:relative md:inset-auto flex flex-col bg-base-200 border-l border-base-300 w-full md:w-96 md:shrink-0 h-[85vh] max-h-[85vh] md:h-full md:max-h-none rounded-t-2xl md:rounded-none shadow-2xl md:shadow-none overflow-hidden">
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-base-300 shrink-0">
                            <h2 className="text-lg md:text-xl font-bold">Outage Details</h2>
                            <button
                                className="btn btn-sm btn-ghost btn-circle min-h-10 min-w-10"
                                onClick={() => setSelectedOutage(null)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 overscroll-contain">
                        <div>
                            <div className={`badge ${statusConfig[selectedOutage.status].badge} badge-lg`}>
                                {statusConfig[selectedOutage.status].label}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-60">Location</h3>
                            <div className="bg-base-100 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm opacity-70">Area</span>
                                    <span className="font-medium">{selectedOutage.area}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm opacity-70">Coordinates</span>
                                    <span className="font-mono text-xs">
                                        {selectedOutage.location.coordinates[1].toFixed(4)}, {selectedOutage.location.coordinates[0].toFixed(4)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-60">Timeline</h3>
                            <div className="bg-base-100 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm opacity-70">Reported</span>
                                    <span className="font-medium text-sm">{formatDate(selectedOutage.reportedAt)}</span>
                                </div>
                                {selectedOutage.resolvedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Resolved</span>
                                        <span className="font-medium text-sm">{formatDate(selectedOutage.resolvedAt)}</span>
                                    </div>
                                )}
                                {selectedOutage.outageDuration && (
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Duration</span>
                                        <span className="font-medium">{formatDuration(selectedOutage.outageDuration)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-60">Community Verification</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                                    <div className="text-3xl mb-1">👍</div>
                                    <div className="text-2xl font-bold">{selectedOutage.upvotes}</div>
                                    <div className="text-xs uppercase tracking-wide opacity-60">Upvotes</div>
                                </div>
                                <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-center">
                                    <div className="text-3xl mb-1">👎</div>
                                    <div className="text-2xl font-bold">{selectedOutage.downvotes}</div>
                                    <div className="text-xs uppercase tracking-wide opacity-60">Downvotes</div>
                                </div>
                            </div>
                            {selectedOutage.verifications && selectedOutage.verifications.length > 0 && (
                                <div className="bg-base-100 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Total Votes</span>
                                        <span className="font-medium">{selectedOutage.verifications.length}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedOutage.description && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-60">Description</h3>
                                <div className="bg-base-100 rounded-lg p-4 border-l-4 border-primary">
                                    <p className="text-sm leading-relaxed">{selectedOutage.description}</p>
                                </div>
                            </div>
                        )}

                        {selectedOutage.resolutionConfirmations && selectedOutage.resolutionConfirmations.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-60">Resolution Confirmations</h3>
                                <div className="bg-base-100 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Confirmations</span>
                                        <span className="font-medium">{selectedOutage.resolutionConfirmations.length}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            ) : (
                <div className="hidden md:flex w-96 bg-base-200 border-l border-base-300 items-center justify-center p-8 shrink-0">
                    <div className="text-center space-y-4">
                        <div className="text-6xl opacity-30">📍</div>
                        <h3 className="text-xl font-bold">Select an Outage</h3>
                        <p className="text-sm opacity-70 max-w-xs">
                            Click on any marker on the map to view detailed information about the outage
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Map
