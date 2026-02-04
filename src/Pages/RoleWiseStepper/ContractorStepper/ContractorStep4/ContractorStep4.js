import React, { useMemo, useEffect } from "react";

const ContractorStep4 = ({ formData, handleChange }) => {
  const hourlyRate = Number(formData.hourlyRate) || 55;
  const travelRadius = Number(formData.travelRadius) || 10;

  // 🔑 Normalize to array of 5 (URLs or Files)
  const photos = useMemo(() => {
    const items = Array.isArray(formData.pastJobPhotos)
      ? formData.pastJobPhotos
      : formData.pastJobPhotos
        ? [formData.pastJobPhotos]
        : [];
    return [...items, ...Array(5 - items.length).fill(null)].slice(0, 5);
  }, [formData.pastJobPhotos]);

  // Create preview URLs
  const previewUrls = useMemo(
    () =>
      photos.map((item) => {
        if (!item) return null;
        if (typeof item === "string") return item; // API URL
        return URL.createObjectURL(item); // File object
      }),
    [photos]
  );

  // Cleanup URLs for File objects only
  useEffect(() => {
    return () => {
      previewUrls.forEach((url, i) => {
        if (photos[i] instanceof File) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls, photos]);

  const updateRate = (delta) => {
    handleChange({
      target: {
        name: "hourlyRate",
        value: Math.max(0, hourlyRate + delta),
      },
    });
  };

  // Handle uploading for a specific index
  const handleFileChangeAtIndex = (index) => (e) => {
    const file = e.target.files[0]; // single file per slot
    if (!file || !file.type.startsWith("image/")) return;

    const newPhotos = [...photos];
    newPhotos[index] = file; // replace only this index

    handleChange({
      target: {
        name: "pastJobPhotos",
        files: newPhotos,
      },
    });
  };

  return (
    <div>
      <h4 className="text-center fw-semibold mb-4">Your terms.</h4>

      {/* Hourly Rate */}
      <label className="form-label fw-medium text-start d-block">
        Hourly Rate<span className="text-danger">*</span>
      </label>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => updateRate(-1)}
          className="w-11 h-11 rounded-lg border flex items-center justify-center text-xl"
        >
          −
        </button>

        <div className="text-2xl font-bold">
          ${hourlyRate}
          <span className="text-sm text-gray-500 ml-1">/hr</span>
        </div>

        <button
          type="button"
          onClick={() => updateRate(1)}
          className="w-11 h-11 rounded-lg border flex items-center justify-center text-xl"
        >
          +
        </button>
      </div>

      {/* Travel Radius */}
      <label className="form-label fw-medium text-start d-block">
        Travel Radius<span className="text-danger">*</span>
      </label>
      <div className="flex items-center gap-3 mb-6">
        <input
          type="range"
          min="0"
          max="25"
          value={travelRadius}
          onChange={(e) =>
            handleChange({
              target: {
                name: "travelRadius",
                value: Number(e.target.value),
              },
            })
          }
          className="w-full accent-blue-500"
        />
        <span className="text-sm text-gray-500 min-w-[48px]">
          {travelRadius} km
        </span>
      </div>

      {/* Upload Gallery */}
      <label className="form-label fw-medium text-start d-block">
        Upload Gallery Photos <span>(Optional)</span>
      </label>
      <div className="grid grid-cols-5 gap-3">
        {photos.map((fileOrUrl, i) => (
          <div
            key={i}
            onClick={() => document.getElementById(`file-input-${i}`)?.click()}
            className="h-20 rounded-lg border border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <input
              id={`file-input-${i}`}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChangeAtIndex(i)}
            />
            {previewUrls[i] ? (
              <img
                src={previewUrls[i]}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorStep4;


// import React, { useMemo, useEffect } from "react";

// const ContractorStep4 = ({ formData, handleChange }) => {
//   const hourlyRate = Number(formData.hourlyRate) || 55;
//   const travelRadius = Number(formData.travelRadius) || 10;

//   // 🔑 Normalize to array of 5
//   const photos = useMemo(() => {
//     const files = Array.isArray(formData.pastJobPhotos)
//       ? formData.pastJobPhotos
//       : formData.pastJobPhotos
//         ? [formData.pastJobPhotos]
//         : [];
//     // Always 5 items
//     return [...files, ...Array(5 - files.length).fill(null)].slice(0, 5);
//   }, [formData.pastJobPhotos]);

//   // Create preview URLs
//   const previewUrls = useMemo(
//     () => photos.map((file) => (file ? URL.createObjectURL(file) : null)),
//     [photos]
//   );

//   // Cleanup URLs
//   useEffect(() => {
//     return () => previewUrls.forEach((url) => url && URL.revokeObjectURL(url));
//   }, [previewUrls]);

//   const updateRate = (delta) => {
//     handleChange({
//       target: {
//         name: "hourlyRate",
//         value: Math.max(0, hourlyRate + delta),
//       },
//     });
//   };

//   // Handle uploading for a specific index
//   const handleFileChangeAtIndex = (index) => (e) => {
//     const file = e.target.files[0]; // single file per slot
//     if (!file || !file.type.startsWith("image/")) return;

//     const newPhotos = [...photos];
//     newPhotos[index] = file; // replace only this index

//     handleChange({
//       target: {
//         name: "pastJobPhotos",
//         files: newPhotos,
//       },
//     });
//   };

//   return (
//     <div>
//        <h4 className="text-center fw-semibold mb-4">
//        Your terms.
//       </h4>

//       {/* Hourly Rate */}
//       <label className="form-label fw-medium text-start d-block">
//         Hourly Rate<span className="text-danger">*</span>
//       </label>
//       <div className="flex items-center justify-between mb-6">
//         <button
//           type="button"
//           onClick={() => updateRate(-1)}
//           className="w-11 h-11 rounded-lg border flex items-center justify-center text-xl"
//         >
//           −
//         </button>

//         <div className="text-2xl font-bold">
//           ${hourlyRate}
//           <span className="text-sm text-gray-500 ml-1">/hr</span>
//         </div>

//         <button
//           type="button"
//           onClick={() => updateRate(1)}
//           className="w-11 h-11 rounded-lg border flex items-center justify-center text-xl"
//         >
//           +
//         </button>
//       </div>

//       {/* Travel Radius */}
//       <label className="form-label fw-medium text-start d-block">
//         Travel Radius<span className="text-danger">*</span>
//       </label>
//       <div className="flex items-center gap-3 mb-6">
//         <input
//           type="range"
//           min="0"
//           max="25"
//           value={travelRadius}
//           onChange={(e) =>
//             handleChange({
//               target: {
//                 name: "travelRadius",
//                 value: Number(e.target.value),
//               },
//             })
//           }
//           className="w-full accent-blue-500"
//         />
//         <span className="text-sm text-gray-500 min-w-[48px]">
//           {travelRadius} km
//         </span>
//       </div>

//       {/* Upload Gallery */}
//       <label className="form-label fw-medium text-start d-block">
//         Upload Gallery Photos <span>(Optional)</span>
//       </label>
//       <div className="grid grid-cols-5 gap-3">
//         {photos.map((file, i) => (
//           <div
//             key={i}
//             onClick={() =>
//               document.getElementById(`file-input-${i}`)?.click()
//             }
//             className="h-20 rounded-lg border border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
//           >
//             <input
//               id={`file-input-${i}`}
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleFileChangeAtIndex(i)}
//             />
//             {previewUrls[i] ? (
//               <img
//                 src={previewUrls[i]}
//                 alt={`preview-${i}`}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-2xl text-gray-400">+</span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ContractorStep4;
