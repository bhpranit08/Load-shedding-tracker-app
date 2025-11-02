import React, { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { supabase } from '../supabaseClient';

const Map = () => {
    const position = [51.505, -0.09]

    const [outages, setOutages] = useState([])

    useEffect(() => {
        async function getOutages() {
            const { data, error } = await supabase.from("outages").select("*")

            if(error) {
                console.error('Error fetching outages: ', error)
            } else {
                setOutages(data)
            }
        }

        getOutages()
    }, [])

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100vh', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map