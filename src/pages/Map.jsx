
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { supabase } from '../supabaseClient'; // Adjusted path
import { Link } from 'react-router-dom';

export function Map() { // Renamed to Map
    const [outages, setOutages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nepalCenter = [28.3949, 84.1240];

    useEffect(() => {
        const fetchOutages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('outages')
                .select('*');

            if (error) {
                setError(error.message);
                console.error('Error fetching outages:', error);
            } else {
                setOutages(data);
            }
            setLoading(false);
        };

        fetchOutages();

        const subscription = supabase.channel('outages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'outages' }, (payload) => {
                setOutages((currentOutages) => [...currentOutages, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const createCustomIcon = (status) => {
        return divIcon({
            html: `<span class="marker-pin ${status}" />`,
            iconSize: [30, 30],
            className: 'leaflet-div-icon'
        });
    };

    if (loading) {
        return <div>Loading map and outages...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-4">Outage Map of Nepal</h2>
            <MapContainer center={nepalCenter} zoom={7} scrollWheelZoom={true} style={{ height: '70vh', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {outages.map(outage => (
                    <Marker
                        key={outage.id}
                        position={[outage.latitude, outage.longitude]}
                        icon={createCustomIcon(outage.status)}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">Status: <span className={`capitalize text-${outage.status === 'confirmed' ? 'green' : outage.status === 'unconfirmed' ? 'yellow' : 'red'}-500`}>{outage.status}</span></h3>
                                <p>{outage.description || 'No description provided.'}</p>
                                <p className="text-xs text-gray-500">Reported at: {new Date(outage.created_at).toLocaleString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map; // Added default export
