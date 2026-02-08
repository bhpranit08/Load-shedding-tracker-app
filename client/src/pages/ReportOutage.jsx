import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useReportOutage, useGetOutages } from '../hooks/useReportOutage'
import { toast } from 'react-toastify'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng])
            toast.success('Location selected!')
        },
    })

    return position ? <Marker position={position} /> : null
}

const ReportOutage = () => {
    const [mapPosition, setMapPosition] = useState(null)
    const { getOutages } = useGetOutages()
    const [area, setArea] = useState('')
    const [description, setDescription] = useState('')
    const [gettingLocation, setGettingLocation] = useState(false)
    const { loading, reportOutage } = useReportOutage(getOutages)

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser')
            return
        }

        setGettingLocation(true)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lng = position.coords.longitude
                const lat = position.coords.latitude

                setMapPosition([lat, lng])
                toast.success('Location detected!')
                setGettingLocation(false)
            },
            (error) => {
                toast.error('Unable to get your location')
                setGettingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    const handleMapPositionChange = (newPosition) => {
        setMapPosition(newPosition)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!mapPosition) {
            toast.error('Please select your location on the map')
            return
        }

        if (!area || area.trim() === '') {
            toast.error('Please enter your area name')
            return
        }

        const outageData = {
            xCoordinate: mapPosition[1],
            yCoordinate: mapPosition[0],
            area: area.trim(),
            description: description.trim()
        }

        const success = await reportOutage(outageData)

        if (success) {
            setMapPosition(null)
            setArea('')
            setDescription('')
        }
    }

    return (
        <div className="min-h-screen bg-base-200 py-8 px-4 w-full">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">Report Power Outage</h1>
                    <p className="text-base-content/60 mt-2">Help your community stay informed</p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">Select Location</h3>

                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className="btn btn-primary w-full mb-4"
                                    disabled={gettingLocation || loading}
                                >
                                    {gettingLocation ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Getting location
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Use My Current Location
                                        </>
                                    )}
                                </button>

                                <p className="text-sm text-base-content/60 mb-3">Or click on the map to select location</p>

                                <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-base-300">
                                    <MapContainer
                                        center={mapPosition || [27.7172, 85.3240]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap'
                                        />
                                        <LocationMarker position={mapPosition} setPosition={handleMapPositionChange} />
                                    </MapContainer>
                                </div>

                                {mapPosition && (
                                    <div className="alert alert-success mt-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Location selected</span>
                                    </div>
                                )}
                            </div>

                            <div className="divider"></div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">Outage Details</h3>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Area Name <span className='text-error'>*</span></legend>
                                    <input
                                        type="text"
                                        placeholder="e.g., Baneshwor, Kathmandu"
                                        className="input input-bordered w-full"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        disabled={loading}
                                    />
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Description</legend>
                                    <textarea
                                        className="textarea textarea-bordered h-28 w-full"
                                        placeholder="Additional details about the outage..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={loading}
                                        maxLength={200}
                                    ></textarea>
                                    <span className="label">{description.length}/200 characters</span>
                                </fieldset>
                            </div>

                            <div className="divider"></div>

                            <button
                                type="submit"
                                className="btn btn-error w-full btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Submitting Report
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Submit Outage Report
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>

                <div className="alert alert-info mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Your report will be verified by other users nearby before being confirmed</span>
                </div>
            </div>
        </div>
    )
}

export default ReportOutage