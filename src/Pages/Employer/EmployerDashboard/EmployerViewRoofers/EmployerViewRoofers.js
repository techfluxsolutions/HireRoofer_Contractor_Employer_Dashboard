import React, { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  GetBoostedWorkerAPI,
  GetNearbyWorkersAPI,
} from "../../../../utils/APIs/Employer/EmployerViewRoofers";
import Loader from "../../../../Loader/Loader";
import LocationSearch from "./GoogleMapView/LocationSearch";
import GoogleMapView from "./GoogleMapView/GoogleMapView";
import RoofersListView from "./EmployerListView/EmployerListView";

const DEFAULT_LOCATION = {
  lat: -33.8688,
  lng: 151.2093,
};

const EmployerViewRoofers = () => {
  // 🟢 green pin (default / search)
  const [searchLocation, setSearchLocation] = useState(DEFAULT_LOCATION);

  // 🗺 map camera center
  const [mapCenter, setMapCenter] = useState(DEFAULT_LOCATION);

  const [workers, setWorkers] = useState([]);
  const [boostedWorkers, setBoostedWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [view, setView] = useState("list");
  const [searchText, setSearchText] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    fetchWorkers(searchLocation);
  }, [searchLocation]);

  useEffect(() => {
    fetchBoostedWorker();
  }, []);

  const fetchWorkers = async ({ lat, lng }) => {
    setLoading(true);
    try {
      const res = await GetNearbyWorkersAPI({
        latitude: lat,
        longitude: lng,
        radius: 25,
      });
      setWorkers(res.data?.data?.workers || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoostedWorker = async () => {
    setLoading(true);
    try {
      const res = await GetBoostedWorkerAPI();
      setBoostedWorkers(res.data?.data?.workers || []);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 search → move green pin + map
  const handleSearchLocation = (loc) => {
    setSelectedWorker(null);
    setSearchLocation({ lat: loc.lat, lng: loc.lng });
    setMapCenter({ lat: loc.lat, lng: loc.lng });
  };

  // 👷 roofer click → move map ONLY
  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    setMapCenter({
      lat: worker.coordinates[1],
      lng: worker.coordinates[0],
    });
  };

  if (!isLoaded) return <Loader />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* SEARCH */}
      <div className="mb-4">
        {view === "map" ? (
          <LocationSearch onSelect={handleSearchLocation} />
        ) : (
          <input
            type="text"
            placeholder="Search roofers or services"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        )}
      </div>

      {/* VIEW TOGGLE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("list")}
          className={`px-3 py-1 border rounded ${
            view === "list" ? "bg-blue-600 text-white" : ""
          }`}
        >
          📋 List View
        </button>

        <button
          onClick={() => setView("map")}
          className={`px-3 py-1 border rounded ${
            view === "map" ? "bg-blue-600 text-white" : ""
          }`}
        >
          🗺 Map View
        </button>
      </div>

      {view === "map" ? (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* MAP */}
          <div className="flex-1 lg:flex-[2] rounded-lg overflow-hidden border bg-white h-[300px] sm:h-[400px] lg:h-auto">
            <GoogleMapView
              center={mapCenter}
              searchLocation={searchLocation}
              workers={workers}
              selectedWorker={selectedWorker}
              onSelectWorker={handleSelectWorker}
            />
          </div>

          {/* RIGHT SIDE LIST (UNCHANGED UI) */}
          <div className="flex-1 space-y-3 max-h-[400px] overflow-y-auto lg:max-h-full">
            {loading && <Loader />}

            {workers.map((worker) => (
              <div
                key={worker._id}
                className={`flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer transition-shadow hover:shadow-sm ${
                  selectedWorker?._id === worker._id
                    ? "border-blue-500"
                    : ""
                }`}
                onClick={() => handleSelectWorker(worker)}
              >
                <img
                  src={worker.profileImage}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {worker.fullName}
                  </h4>

                  <div className="text-xs text-gray-500 truncate">
                    ⭐ {worker.averageRating || 0} · {worker.distance} km
                  </div>

                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-[2px] rounded">
                    {worker.availabilityStatus}
                  </span>
                </div>

                <button className="text-xs px-3 py-1 border rounded shrink-0">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <RoofersListView
          workers={boostedWorkers}
          selectedWorker={selectedWorker}
          onSelectWorker={handleSelectWorker}
        />
      )}
    </div>
  );
};

export default EmployerViewRoofers;



// // EmployerViewRoofers.js
// import React, { useEffect, useState } from "react";
// import { useJsApiLoader } from "@react-google-maps/api";
// import { GetBoostedWorkerAPI, GetNearbyWorkersAPI } from "../../../../utils/APIs/Employer/EmployerViewRoofers";
// import Loader from "../../../../Loader/Loader";
// import LocationSearch from "./GoogleMapView/LocationSearch";
// import GoogleMapView from "./GoogleMapView/GoogleMapView";
// import RoofersListView from "./EmployerListView/EmployerListView";

// const DEFAULT_LOCATION = {
//   lat: -33.8688,
//   lng: 151.2093,
// };

// const EmployerViewRoofers = () => {
//   const [location, setLocation] = useState(DEFAULT_LOCATION);
//   const [workers, setWorkers] = useState([]);
//    const [boostedWorkers, setBoostedWorkers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedWorker, setSelectedWorker] = useState(null);
//   const [view, setView] = useState("list"); // "map" | "list"
//   const [searchText, setSearchText] = useState("");

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"], // ✅ required for Autocomplete
//   });

//   useEffect(() => {
//     fetchWorkers(location);
//   }, [location]);

  
//   useEffect(() => {
//     fetchBoostedWorker()
//   }, []);

//   const fetchWorkers = async ({ lat, lng }) => {
//     setLoading(true);
//     try {
//       const res = await GetNearbyWorkersAPI({
//         latitude: lat,
//         longitude: lng,
//         radius: 25,
//       });
//       setWorkers(res.data?.data?.workers || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//     const fetchBoostedWorker = async () => {
//     setLoading(true);
//     try {
//       const res = await GetBoostedWorkerAPI();
//       setBoostedWorkers(res.data?.data?.workers || []);
//     } finally {
//       setLoading(false);
//     }
//   };



  

//   if (!isLoaded) return <Loader />;

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       {/* SEARCH */}
//       <div className="mb-4">
//         {view === "map" ? (
//           <LocationSearch onSelect={setLocation} />
//         ) : (
//           <input
//             type="text"
//             placeholder="Search roofers or services"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//         )}
//       </div>

//       {/* VIEW TOGGLE */}
//       <div className="flex flex-wrap items-center gap-2 mb-4">
//         <button
//           onClick={() => setView("list")}
//           className={`px-3 py-1 text-sm rounded border ${
//             view === "list"
//               ? "bg-blue-600 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           📋 List View
//         </button>

//         <button
//           onClick={() => setView("map")}
//           className={`px-3 py-1 text-sm rounded border ${
//             view === "map"
//               ? "bg-blue-600 text-white"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           🗺 Map View
//         </button>
//       </div>

//       {/* CONTENT */}
//       {view === "map" ? (
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* MAP */}
//           <div className="flex-1 lg:flex-[2] rounded-lg overflow-hidden border bg-white h-[300px] sm:h-[400px] lg:h-auto">
//             <GoogleMapView
//               center={location}
//               workers={workers}
//               selectedWorker={selectedWorker}
//               onSelectWorker={setSelectedWorker}
//             />
//           </div>

//           {/* SIDE LIST */}
//           <div className="flex-1 space-y-3 max-h-[400px] overflow-y-auto lg:max-h-full">
//             {loading && <Loader />}

//             {workers.map((worker) => (
//               <div
//                 key={worker._id}
//                 className={`flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer transition-shadow hover:shadow-sm ${
//                   selectedWorker?._id === worker._id
//                     ? "border-blue-500"
//                     : ""
//                 }`}
//                 onClick={() => setSelectedWorker(worker)}
//               >
//                 <img
//                   src={worker.profileImage}
//                   className="w-12 h-12 rounded-full object-cover"
//                   alt=""
//                 />

//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-sm truncate">
//                     {worker.fullName}
//                   </h4>
//                   <div className="text-xs text-gray-500 truncate">
//                     ⭐ {worker.averageRating || 0} · {worker.distance} km
//                   </div>

//                   <span className="text-xs bg-blue-100 text-blue-600 px-2 py-[2px] rounded">
//                     {worker.availabilityStatus}
//                   </span>
//                 </div>

//                 <button className="text-xs px-3 py-1 border rounded shrink-0">
//                   View
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <RoofersListView
//           workers={boostedWorkers}
//           selectedWorker={selectedWorker}
//           onSelectWorker={setSelectedWorker}
//         />
//       )}
//     </div>
//   );
// };

// export default EmployerViewRoofers;


