import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useRegister } from '../hooks/useAuth'
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

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        area: ''
    })
    const [mapPosition, setMapPosition] = useState(null)
    const [showMap, setShowMap] = useState(false)
    const [gettingLocation, setGettingLocation] = useState(false)
    const { loading, register } = useRegister()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

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
                setShowMap(true)
                toast.success('Location detected! Adjust pin on map if needed.')
                setGettingLocation(false)
            },
            (error) => {
                toast.error('Unable to get your location. Use map instead.')
                setShowMap(true)
                setMapPosition([27.7172, 85.3240])
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

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        if (!mapPosition) {
            toast.error('Please set your location on the map')
            return
        }

        const user = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            xCoordinate: mapPosition[1],
            yCoordinate: mapPosition[0],
            area: formData.area
        }

        await register(user)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-8 px-4">
            <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-base-content/60 mt-2">Join PowerTrack today</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    className="input input-bordered w-full"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    className="input input-bordered w-full"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="divider">Set Your Location</div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="btn btn-outline btn-primary flex-1"
                                disabled={gettingLocation || loading}
                            >
                                {gettingLocation ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Getting location
                                    </>
                                ) : (
                                    'Use GPS Location'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMap(true)
                                    if (!mapPosition) {
                                        setMapPosition([27.7172, 85.3240])
                                    }
                                }}
                                className="btn btn-outline flex-1"
                                disabled={loading}
                            >
                                Pick on Map
                            </button>
                        </div>

                        {showMap && (
                            <div className="mt-4">
                                <p className="text-sm text-base-content/60 mb-2">Click on the map to set your exact location</p>
                                <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-base-300">
                                    <MapContainer
                                        center={mapPosition || [27.7172, 85.3240]}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        <LocationMarker position={mapPosition} setPosition={handleMapPositionChange} />
                                    </MapContainer>
                                </div>
                            </div>
                        )}

                        {mapPosition && (
                            <div className="alert alert-success mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Location set: {mapPosition[0].toFixed(4)}, {mapPosition[1].toFixed(4)}</span>
                            </div>
                        )}

                        <div className="form-control mt-2">
                            <label className="label">
                                <span className="label-text">Area Name</span>
                            </label>
                            <input
                                type="text"
                                name="area"
                                placeholder="Eg: Baneshow, Kathmandu"
                                className="input input-bordered w-full"
                                value={formData.area}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating account
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="text-center">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register