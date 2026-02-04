import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";

// Move static constants outside component to prevent recreation
const containerStyle = {
  width: "100%",
  height: "220px",
  borderRadius: 12,
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };
const LIBRARIES = ["places", "geocoding"]; // Add geocoding library

const ContractorStep1 = forwardRef(({ formData, handleChange }, ref) => {
  const [errors, setErrors] = useState({});
  const [marker, setMarker] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const fileInputRef = useRef(null);
  const geocoderRef = useRef(null);
  const mapRef = useRef(null);
  const [geocodingStatus, setGeocodingStatus] = useState("idle"); // For debugging

  /* ---------------- Google Maps Loader ---------------- */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  console.log("=== DEBUG INFO ===");
  console.log("API Key exists:", !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  console.log("API Key (first 10 chars):", process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.substring(0, 10) + "...");
  console.log("Is maps loaded?", isLoaded);
  console.log("Load error:", loadError);
  console.log("Window.google exists:", !!window.google);
  console.log("Window.google.maps exists:", !!window.google?.maps);
  console.log("===================");

  /* ---------------- Initialize Geocoder after API loads ---------------- */
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      console.log("Initializing geocoder...");
      try {
        geocoderRef.current = new window.google.maps.Geocoder();
        console.log("Geocoder initialized successfully");
      } catch (error) {
        console.error("Failed to initialize geocoder:", error);
      }
    }
  }, [isLoaded]);

  /* ---------------- helpers ---------------- */
  const setField = (name, value) => {
    handleChange({ target: { name, value } });
    setErrors((p) => ({ ...p, [name]: null }));
  };

  /* ---------------- validation ---------------- */
  const validateStep1 = () => {
  const e = {};

  if (!formData.firstName) e.firstName = "Required";
  if (!formData.lastName) e.lastName = "Required";
  if (!formData.salutation) e.salutation = "Required";
  if (!formData.city) e.city = "Required";

  if (!formData.lat || !formData.lng) {
    e.city = "Please pick your city using the map icon";
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};


  useImperativeHandle(ref, () => ({ validateStep1 }));

  /* ---------------- image upload ---------------- */
  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setField("profilePic", file);
  };

  const getProfilePreview = () => {
    if (!formData.profilePic) return null;
    if (formData.profilePic instanceof File) {
      return URL.createObjectURL(formData.profilePic);
    }
    if (typeof formData.profilePic === "string") {
      return formData.profilePic;
    }
    return null;
  };

  const preview = getProfilePreview();

  /* ---------------- map ---------------- */
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  /* ---------------- Simplified Geocoding ---------------- */
  const handleMapClick = async (e) => {
    console.log("Map clicked");
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });
    setField("lat", lat);
    setField("lng", lng);
    setGeocodingStatus("starting");

    // Option 1: Use Google Geocoder if available
    if (window.google && window.google.maps) {
      try {
        setGeocodingStatus("geocoding_with_google");
        console.log("Attempting Google geocoding...");
        
        // Create a new geocoder instance each time to ensure it's fresh
        const geocoder = new window.google.maps.Geocoder();
        
        // Try without result_type first (it might be causing issues)
        const request = { location: { lat, lng } };
        console.log("Geocoding request:", request);
        
        const results = await new Promise((resolve, reject) => {
          geocoder.geocode(request, (results, status) => {
            console.log("Geocoding callback - Status:", status, "Results:", results);
            if (status === "OK") {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        setGeocodingStatus("google_success");
        console.log("Google geocoding successful:", results);

        if (results && results.length > 0) {
          // Simple city extraction
          const result = results[0];
          
          // Look for city in components
          for (const component of result.address_components) {
            if (component.types.includes("locality")) {
              setField("city", component.long_name);
              setShowMap(false);
              setGeocodingStatus("complete");
              return;
            }
            if (component.types.includes("postal_town")) {
              setField("city", component.long_name);
              setShowMap(false);
              setGeocodingStatus("complete");
              return;
            }
            if (component.types.includes("administrative_area_level_2")) {
              setField("city", component.long_name);
              setShowMap(false);
              setGeocodingStatus("complete");
              return;
            }
          }
          
          // Fallback to formatted address
          if (result.formatted_address) {
            const parts = result.formatted_address.split(',');
            if (parts.length > 1) {
              setField("city", parts[1].trim());
            } else {
              setField("city", parts[0].trim());
            }
            setShowMap(false);
            setGeocodingStatus("complete");
            return;
          }
        }
      } catch (googleError) {
        console.error("Google geocoding error:", googleError);
        setGeocodingStatus("google_failed");
      }
    }

    // Option 2: Fallback to OpenStreetMap Nominatim (free, no API key needed)
    try {
      setGeocodingStatus("trying_openstreetmap");
      console.log("Trying OpenStreetMap fallback...");
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourAppName/1.0' // Required by Nominatim
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("OpenStreetMap response:", data);
        
        setGeocodingStatus("openstreetmap_success");
        
        // Extract city from OpenStreetMap response
        const city = data.address?.city || 
                     data.address?.town || 
                     data.address?.village || 
                     data.address?.county || 
                     data.address?.state;
        
        if (city) {
          setField("city", city);
          setShowMap(false);
          setGeocodingStatus("complete");
          return;
        }
      }
    } catch (osmError) {
      console.error("OpenStreetMap error:", osmError);
      setGeocodingStatus("openstreetmap_failed");
    }

    // Option 3: Ultimate fallback - use coordinates
    setGeocodingStatus("using_coordinates_fallback");
    setField("city", `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    setShowMap(false);
    
    // Show user-friendly message
    setTimeout(() => {
      alert("City name could not be determined automatically. Please enter it manually in the text field above.");
    }, 100);
  };

  // Add error handling for map loading
  if (loadError) {
    console.error("Google Maps failed to load:", loadError);
    return (
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div className="alert alert-danger">
          <strong>Map Error:</strong> Failed to load Google Maps. 
          {loadError.message && <div>{loadError.message}</div>}
          <div className="small mt-2">
            Please check your API key and internet connection.
          </div>
        </div>
        {/* Rest of your form without map */}
        {/* ... your form fields ... */}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      {/* Header */}
      <h4 className="text-center fw-semibold mb-4">
        Welcome! Let's get you set up.
      </h4>

      {/* Profile Image */}
      <div className="text-center mb-4">
        <div
          onClick={() => fileInputRef.current.click()}
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#e9ecef",
            margin: "0 auto",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {formData.profilePic ? (
            <img
              src={preview}
              alt="profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <i className="bi bi-camera" style={{ fontSize: 26, color: "#6c757d" }} />
          )}
        </div>
        <div className="text-muted small mt-2">
          Tap to upload profile photo
        </div>
        <input
          hidden
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
      </div>

      {/* First Name */}
      <label className="form-label fw-medium text-start d-block">
        Workers First Name <span className="text-danger">*</span>
      </label>
      <div className="d-flex gap-2 mb-3">
        <select
          className={`form-select ${errors.salutation && "is-invalid"}`}
          style={{ maxWidth: 80 }}
          value={formData.salutation || ""}
          onChange={(e) => setField("salutation", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Mr">Mr.</option>
          <option value="Mrs">Mrs.</option>
          <option value="Miss">Miss</option>
        </select>
        <input
          className={`form-control ${errors.firstName && "is-invalid"}`}
          placeholder="Enter First Name"
          value={formData.firstName || ""}
          onChange={(e) => setField("firstName", e.target.value)}
        />
      </div>

      {/* Last Name */}
      <label className="form-label fw-medium text-start d-block">
        Workers Last Name <span className="text-danger">*</span>
      </label>
      <input
        className={`form-control mb-3 ${errors.lastName && "is-invalid"}`}
        placeholder="Enter Last Name"
        value={formData.lastName || ""}
        onChange={(e) => setField("lastName", e.target.value)}
      />

      <label className="form-label fw-medium text-start d-block">
        City/Town <span className="text-danger">*</span>
      </label>

      <div className="position-relative mb-3">
        <input
          className={`form-control pe-5 ${errors.city && "is-invalid"}`}
          placeholder="Enter City / Town"
          value={formData.city || ""}
          onChange={(e) => setField("city", e.target.value)}
        />

        {/* Map Icon */}
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
          <i className="bi bi-geo-alt-fill"></i>
        </span>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="small text-muted mb-2">
          Geocoding status: {geocodingStatus}
        </div>
      )}

      {/* Instructions */}
      {showMap && (
        <div className="alert alert-info small mb-2">
          <i className="bi bi-info-circle me-2"></i>
          Click on the map to select your city. For best results, click on general city areas (not specific buildings).
        </div>
      )}

      {/* Map Section */}
      {showMap && !isLoaded && (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading map...</span>
          </div>
          <div className="mt-2">Loading Google Maps...</div>
        </div>
      )}

      {showMap && isLoaded && (
        <div className="mb-3">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={marker || defaultCenter}
            zoom={marker ? 14 : 10}
            onClick={handleMapClick}
            onLoad={onMapLoad}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
          <div className="small text-muted mt-1">
            Click anywhere on the map to select location
          </div>
        </div>
      )}
    </div>
  );
});

export default ContractorStep1;


// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import { LoadScript, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "220px",
//   borderRadius: 12,
// };

// const defaultCenter = { lat: 37.7749, lng: -122.4194 };
// const libraries = ["places"];

// const ContractorStep1 = forwardRef(({ formData, handleChange }, ref) => {
//   const [errors, setErrors] = useState({});
//   const [marker, setMarker] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const fileInputRef = useRef(null);
//   const geocoderRef = useRef(null);

//   /* ---------------- helpers ---------------- */
//   const setField = (name, value) => {
//     handleChange({ target: { name, value } });
//     setErrors((p) => ({ ...p, [name]: null }));
//   };

//   /* ---------------- validation ---------------- */
//   const validateStep1 = () => {
//     const e = {};
//     if (!formData.firstName) e.firstName = "Required";
//     if (!formData.lastName) e.lastName = "Required";
//     if (!formData.salutation) e.salutation = "Required";
//     if (!formData.city) e.city = "Required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   useImperativeHandle(ref, () => ({ validateStep1 }));

//   /* ---------------- image upload ---------------- */
//   const onImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) setField("profilePic", file);
//   };

//   const getProfilePreview = () => {
//     if (!formData.profilePic) return null;

//     // Case 1: File (user selected new image)
//     if (formData.profilePic instanceof File) {
//       return URL.createObjectURL(formData.profilePic);
//     }

//     // Case 2: URL from backend
//     if (typeof formData.profilePic === "string") {
//       return formData.profilePic;
//     }

//     return null;
//   };


//   const preview = getProfilePreview();


//   /* ---------------- map ---------------- */
// const { isLoaded, loadError } = useJsApiLoader({
//   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//   libraries: ["places"],
// });


//   const onMapLoad = useCallback(() => {
//     if (window.google) {
//       geocoderRef.current = new window.google.maps.Geocoder();
//     }
//   }, []);


//   const handleMapClick = (e) => {
//     if (!geocoderRef.current) return;

//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();

//     setMarker({ lat, lng });
//     setField("lat", lat);
//     setField("lng", lng);

//     geocoderRef.current.geocode(
//       { location: { lat, lng } },
//       (res, status) => {
//         if (status === "OK" && res?.[0]) {
//           const cityComponent = res[0].address_components.find(c =>
//             c.types.includes("locality")
//           );

//           setField(
//             "city",
//             cityComponent?.long_name || res[0].formatted_address
//           );
//           setShowMap(false);
//         }
//       }
//     );
//   };



//   return (
//     <div style={{ maxWidth: 420, margin: "0 auto" }}>
//       {/* Header */}
//       <h4 className="text-center fw-semibold mb-4">
//         Welcome! Let’s get you set up.
//       </h4>

//       {/* Profile Image */}
//       <div className="text-center mb-4">
//         <div
//           onClick={() => fileInputRef.current.click()}
//           style={{
//             width: 96,
//             height: 96,
//             borderRadius: "50%",
//             background: "#e9ecef",
//             margin: "0 auto",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             overflow: "hidden",
//           }}
//         >
//           {formData.profilePic ? (
//             <img
//               src={preview}
//               alt="profile"
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           ) : (
//             <i className="bi bi-camera" style={{ fontSize: 26, color: "#6c757d" }} />
//           )}
//         </div>

//         <div className="text-muted small mt-2">
//           Tap to upload profile photo
//         </div>

//         <input
//           hidden
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={onImageChange}
//         />
//       </div>

//       {/* First Name */}
//       <label className="form-label fw-medium text-start d-block">
//         Workers First Name <span className="text-danger">*</span>
//       </label>
//       <div className="d-flex gap-2 mb-3">
//         <select
//           className={`form-select ${errors.salutation && "is-invalid"}`}
//           style={{ maxWidth: 80 }}
//           value={formData.salutation || ""}
//           onChange={(e) => setField("salutation", e.target.value)}
//         >
//           <option value="">Select</option>
//           <option value="Mr">Mr.</option>
//           <option value="Mrs">Mrs.</option>
//           <option value="Miss">Miss</option>

//         </select>

//         <input
//           className={`form-control ${errors.firstName && "is-invalid"}`}
//           placeholder="Enter First Name"
//           value={formData.firstName || ""}
//           onChange={(e) => setField("firstName", e.target.value)}
//         />
//       </div>

//       {/* Last Name */}
//       <label className="form-label fw-medium text-start d-block">
//         Workers Last Name <span className="text-danger">*</span>
//       </label>
//       <input
//         className={`form-control mb-3 ${errors.lastName && "is-invalid"}`}
//         placeholder="Enter Last Name"
//         value={formData.lastName || ""}
//         onChange={(e) => setField("lastName", e.target.value)}
//       />
//       <label className="form-label fw-medium text-start d-block">
//         City/Town <span className="text-danger">*</span>
//       </label>

//       <div className="position-relative mb-3">
//         <input
//           className={`form-control pe-5 ${errors.city && "is-invalid"}`}
//           placeholder="Enter City / Town"
//           value={formData.city || ""}
//           onChange={(e) => setField("city", e.target.value)}
//         />

//         {/* Map Icon */}
//         <span
//           onClick={() => setShowMap((s) => !s)}
//           style={{
//             position: "absolute",
//             right: 12,
//             top: "50%",
//             transform: "translateY(-50%)",
//             cursor: "pointer",
//             color: "#0d6efd",
//             fontSize: 18,
//           }}
//           title="Pick from map"
//         >
//           <i className="bi bi-geo-alt-fill"></i>
//         </span>
//       </div>



//       <LoadScript
//         googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//         libraries={libraries}
//       >
//         {/* {showMap && (
//     <div className="mb-3">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={marker || defaultCenter}
//         zoom={marker ? 14 : 10}
//         onClick={handleMapClick}
//         onLoad={(map) => {
//           geocoderRef.current = new window.google.maps.Geocoder();
//         }}
//       >
//         {marker && <Marker position={marker} />}
//       </GoogleMap>
//     </div>
//   )} */}

//        {showMap && isLoaded && (
//   <div className="mb-3">
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={marker || defaultCenter}
//       zoom={marker ? 14 : 10}
//       onClick={handleMapClick}
//       onLoad={onMapLoad}
//     >
//       {marker && <Marker position={marker} />}
//     </GoogleMap>
//   </div>
// )}

//       </LoadScript>

//     </div>
//   );
// });

// export default ContractorStep1;



