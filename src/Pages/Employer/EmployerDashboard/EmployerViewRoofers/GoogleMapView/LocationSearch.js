import React, { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { MapPin, X } from "lucide-react";

const LocationSearch = ({ onSelect }) => {
  const autoRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  const handlePlaceChanged = () => {
    if (!autoRef.current) return;

    const place = autoRef.current.getPlace();
    if (!place || !place.geometry) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address,
    };

    setValue(place.formatted_address || "");
    onSelect(location);
  };

  const clearInput = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <Autocomplete
      onLoad={(auto) => (autoRef.current = auto)}
      onPlaceChanged={handlePlaceChanged}
    >
      <div className="relative">
        {/* Left Icon */}
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search city, suburb or address"
          className="
            w-full pl-10 pr-10 py-2.5
            border border-gray-300 rounded-xl
            bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition
          "
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </Autocomplete>
  );
};

export default LocationSearch;
