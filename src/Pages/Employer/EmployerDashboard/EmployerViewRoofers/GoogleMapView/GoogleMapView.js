import {
  GoogleMap,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const GoogleMapView = ({
  center,
  searchLocation,
  workers,
  selectedWorker,
  onSelectWorker,
}) => {
  const navigate = useNavigate();
  const [activeWorker, setActiveWorker] = useState(null);

  const handleWorkerClick = (worker) => {
    setActiveWorker(worker);
    onSelectWorker(worker);
  };

  const getInitials = (fullName = "") => {
    if (!fullName) return "";

    const parts = fullName.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };


  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "520px" }}
      center={center}
      zoom={selectedWorker ? 13 : 11}
    >
      {/* 🟢 SEARCH / DEFAULT LOCATION */}
      <Marker
        position={searchLocation}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {/* 👷 CUSTOM ROOFER MARKERS */}
      {workers.map((worker) => (
        <OverlayView
          key={worker._id}
          position={{
            lat: worker.coordinates[1],
            lng: worker.coordinates[0],
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => handleWorkerClick(worker)}
            className={`relative flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg border transition-all duration-200 cursor-pointer hover:shadow-xl ${selectedWorker?._id === worker._id
                ? "border-blue-600 scale-105"
                : "border-gray-200"
              }`}
            style={{
              transform: "translate(-50%, -110%)",
              minWidth: "210px",
            }}
          >
            {/* Profile Image */}
            <div className="relative">
              {worker.profileImage ? (
                <img
                  src={worker.profileImage}
                  alt={worker.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-black font-semibold text-sm shadow">
                  {getInitials(worker.firstName)}
                </div>
              )}

              {/* Status Dot */}
              {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" /> */}
            </div>



            {/* Info */}
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-900">
                {worker.fullName}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                📍 {worker.distance} km away
              </p>
            </div>
          </div>
        </OverlayView>

      ))}

      {/* 🪟 INFO WINDOW */}
      {activeWorker && (
        <InfoWindow
          position={{
            lat: activeWorker.coordinates[1],
            lng: activeWorker.coordinates[0],
          }}
          onCloseClick={() => setActiveWorker(null)}
        >
          <div className="flex gap-3 items-center max-w-[220px]">
            <img
              src={activeWorker.profileImage}
              alt={activeWorker.fullName}
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div className="flex-1">
              <h4 className="text-sm font-semibold">
                {activeWorker.fullName}
              </h4>

              <p className="text-xs text-gray-500">
                📍 {activeWorker.distance} km away
              </p>

              <button
                onClick={() =>
                  navigate(`/employer-dashboard/view-roofer/roofers/${activeWorker._id}`)
                }
                className="mt-1 text-xs text-blue-600 underline"
              >
                View profile
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapView;
