import React, {
  forwardRef,
  useState,
  useRef,
  useEffect
} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { FaBuilding, FaUserCircle } from "react-icons/fa";
import UploadChipBox from "./UploadChipBox";

const containerStyle = {
  width: "100%",
  height: "220px",
  borderRadius: 12,
};

const defaultCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney
const LIBRARIES = ["places", "geocoding"];

const EmployerStep1 = forwardRef(({ formData, handleChange }, ref) => {
  const [showMap, setShowMap] = useState(false);
  const [marker, setMarker] = useState(null);
  const geocoderRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  const setField = (name, value) => {
    handleChange({ target: { name, value } });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });
    setField("lat", lat);
    setField("lng", lng);

    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results?.length) {
          setField("officeAddress", results[0].formatted_address);
          setShowMap(false);
        }
      }
    );
  };

  

  return (
    <div className="d-flex flex-column gap-3">
      {/* Company Name */}
      <div>
        <label className="form-label">
          Company Name <span className="text-danger">*</span>
        </label>
        <input
          className="form-control"
          name="companyName"
          placeholder="Enter Company Name"
          value={formData.companyName || ""}
          onChange={handleChange}
        />
      </div>

      {/* ABN */}
      <div>
        <label className="form-label">
          ABN / ACN <span className="text-danger">*</span>
        </label>
        <input
          className="form-control"
          name="abn"
          placeholder="Enter ABN / ACN"
          value={formData.abn || ""}
          onChange={handleChange}
        />
      </div>

      {/* Pty Ltd / Sole Trader Status */}
      <div>
        <label className="form-label">
          Pty Ltd / Sole Trader Status <span className="text-danger">*</span>
        </label>

        <select
          className="form-select"
          name="ptyLtdStatus"
          value={formData.ptyLtdStatus || ""}
          onChange={handleChange}
        >
          <option value="">Enter Pty Ltd / Sole trader Status</option>
          <option value="Pty Ltd">Pty Ltd</option>
          <option value="Sole Trader">Sole Trader</option>
        </select>
      </div>


   <UploadChipBox
  label="Company Logo"
  name="companyLogo"
  file={formData.companyLogo}
  onChange={handleChange}
  icon={FaBuilding}
/>

<UploadChipBox
  label="Profile Image"
  name="profileImage"
  file={formData.profileImage}
  onChange={handleChange}
  icon={FaUserCircle}
/>
      {/* Office Address */}
      <div>
        <label className="form-label">
          Office Address or Base Location <span className="text-danger">*</span>
        </label>

        <div className="position-relative mb-2">
          <input
            className="form-control pe-5"
            name="officeAddress"
            placeholder="Enter City / Town"
            value={formData.officeAddress || ""}
            onChange={handleChange}
          />

          <span
            onClick={() => setShowMap((s) => !s)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#0d6efd",
              fontSize: 18,
            }}
            title="Pick from map"
          >
            <i className="bi bi-geo-alt-fill" />
          </span>
        </div>

        {showMap && isLoaded && (
          <div className="mb-3">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={marker || defaultCenter}
              zoom={marker ? 15 : 10}
              onClick={handleMapClick}
            >
              {marker && <Marker position={marker} />}
            </GoogleMap>
            <div className="small text-muted mt-1">
              Click on the map to select location
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default EmployerStep1;
