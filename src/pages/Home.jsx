import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { FloatingLabel, Button, Alert, Spinner, Label, Textarea } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const [description, setDescription] = useState("")
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
            const { data: { user } } = await supabase.auth.getUsers()
            setUser(user)
            if(!user) {
                navigate("/login")
            }
        }

        getSession()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            if(!session?.user) {
                navigate("/login")
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [navigate])

    useEffect(() => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude)
                setLongitude(position.coords.longitude)
                setLocationLoading(false)
            },
            (error) => {
                setLocationError(error.message)
                setLocationLoading(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
        } else {
            setLocationError('Geolocation is not supported by your browser.')
            setLocationLoading(false)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        setSubmitSuccess(false)

        if(!user) {
            setSubmitError('You must be logged in to report an outage.')
            return
        }

        if (locationError || latitude === null || longitude === null) {
            setSubmitError("Couldn't get your location. PLease enable location services.")
        }

        setSubmitting(true)
        
        const {error} = await supabase.from('outages').insert([{
            latitude,
            longitude,
            description,
            user_id: user.id,
            status: 'unconfirmed'
        }])

        if(error) {
            setSubmitError(error.message)
        } else {
            setSubmitSuccess(true)
            setDescription('')
            setTimeout(() => navigate('/map'), 2000)
        }
        setSubmitting(false)
    }

    if(!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner aria-loading="Loading user session"></Spinner>
                <p className='ml-2'>Checking authentication...</p>
            </div>
        )
    }

    return (
        <div className="flex justify-center p-4">
            <form className="flex max-w-md flex-col gap-4 w-full" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center">Report an Outage</h2>

                {locationLoading && (
                    <Alert color="info" icon={Spinner}>
                        Getting your current location...
                    </Alert>
                )}
                {locationError && (
                    <Alert color="failure">
                        Error getting location: {locationError}. Please enable location services in your browser.
                    </Alert>
                )}
                {submitError && <Alert color="failure">{submitError}</Alert>}
                {submitSuccess && <Alert color="success">Outage reported successfully! Redirecting to map...</Alert>}

                <FloatingLabel variant='standard' color='default' label='Your Latitude' type='text' value={latitude} readOnly disabled />
                <FloatingLabel variant='standard' color='default' label='Your Longitude' type='text' value={longitude} readOnly disabled />
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="description" value="Description (optional)" />
                    </div>
                    <Textarea
                        id="description"
                        placeholder="e.g., Power went out in my area. Estimated time of return: unknown."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={submitting || locationLoading || locationError || !user}>
                    {submitting ? 'Submitting...' : 'Submit Outage Report'}
                </Button>
            </form>
        </div>
    )
}

export default Home