import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "220px",
  borderRadius: 12,
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };
const LIBRARIES = ["places", "geocoding"];

export default function MapCityPicker({ onSelect }) {
  const [marker, setMarker] = useState(null);
  const geocoderRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });

    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (res, status) => {
          status === "OK" ? resolve(res) : reject(status);
        });
      });

      const cityComponent = results?.[0]?.address_components?.find((c) =>
        c.types.includes("locality") ||
        c.types.includes("postal_town") ||
        c.types.includes("administrative_area_level_2")
      );

      const postalCodeComponent = results?.[0]?.address_components?.find((c) =>
        c.types.includes("postal_code")
      );

      onSelect({
        city:
          cityComponent?.long_name ||
          results?.[0]?.formatted_address ||
          `(${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        postalCode: postalCodeComponent?.long_name || "",
        lat,
        lng,
      });
    } catch {
      onSelect({
        city: `(${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        postalCode: "",
        lat,
        lng,
      });
    }
  };


  if (loadError) {
    return (
      <div className="alert alert-danger small">
        Failed to load map. Please enter city manually.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border text-primary" />
        <div className="small mt-2">Loading map…</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={marker || defaultCenter}
      zoom={marker ? 14 : 10}
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
