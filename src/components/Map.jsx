import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const MapComponent = ({ location }) => {
    if (!location) return null;

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} // Zameniti sa tvojim API ključem
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={12}
            >
                <Marker position={location} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
