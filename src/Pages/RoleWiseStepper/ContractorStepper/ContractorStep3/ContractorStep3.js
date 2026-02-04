import React, { useEffect, useState } from "react";
import { FaIdCard, FaFileAlt } from "react-icons/fa";

// const UploadCard = ({ label, name, icon: Icon, onChange, file }) => {
//   const isImage = file && file.type?.startsWith("image/");
//   const previewUrl = isImage ? URL.createObjectURL(file) : null;

//   return (
//     <label
//       style={{
//         border: "2px dashed #dee2e6",
//         borderRadius: "12px",
//         padding: "28px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//         marginBottom: "16px",
//         background: "#fff",
//       }}
//     >
//       {previewUrl ? (
//         <img
//           src={previewUrl}
//           alt="preview"
//           style={{
//             width: 120,
//             height: 120,
//             objectFit: "cover",
//             borderRadius: 8,
//             marginBottom: 12,
//           }}
//         />
//       ) : (
//         <Icon size={28} color="#6c757d" style={{ marginBottom: 10 }} />
//       )}

//       <div style={{ fontWeight: 500 }}>
//         {label} <span className="text-danger">*</span>
//       </div>

//       {file && !isImage && (
//         <div style={{ fontSize: 12, color: "#495057", marginTop: 6 }}>
//           {file.name}
//         </div>
//       )}

//       <div style={{ fontSize: 13, color: "#6c757d" }}>
//         {file ? "Tap to change" : "Tap to upload"}
//       </div>

//       <input type="file" name={name} onChange={onChange} hidden />
//     </label>
//   );
// };
const UploadCard = ({ label, name, icon: Icon, onChange, file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setPreviewUrl(null);
      setIsImage(false);
      return;
    }

    // Image File
    if (file instanceof File && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsImage(true);
      return;
    }

    // Image URL (API)
    if (typeof file === "string" && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
      setPreviewUrl(file);
      setIsImage(true);
      return;
    }

    // PDF (no preview image)
    setPreviewUrl(null);
    setIsImage(false);
  }, [file]);

  return (
    <label
      style={{
        border: "2px dashed #dee2e6",
        borderRadius: "12px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        marginBottom: "16px",
        background: "#fff",
      }}
    >
      {previewUrl && isImage ? (
        <img
          src={previewUrl}
          alt="preview"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
      ) : (
        <Icon size={28} color="#6c757d" style={{ marginBottom: 10 }} />
      )}

      <div style={{ fontWeight: 500 }}>
        {label} <span className="text-danger">*</span>
      </div>

      {file && !isImage && (
        <div style={{ fontSize: 12, color: "#495057", marginTop: 6 }}>
          {file instanceof File ? file.name : "Uploaded document"}
        </div>
      )}

      <div style={{ fontSize: 13, color: "#6c757d" }}>
        {file ? "Tap to change" : "Tap to upload"}
      </div>

      {/* ✅ ACCEPT ONLY IMAGE + PDF */}
      <input
        type="file"
        name={name}
        accept="image/*,.pdf"
        onChange={onChange}
        hidden
      />
    </label>
  );
};


const ContractorStep3 = ({ formData, handleChange }) => {
  return (
    <div>
      {/* <h5 className="mb-4">Documents</h5> */}

       <h4 className="text-center fw-semibold mb-4">
        Let’s get Verified.
      </h4>
      {/* ABN */}
      <div className="mb-3">
        {/* <label className="form-label fw-medium">
          ABN <span className="text-danger">*</span>
        </label> */}
        <label className="form-label fw-medium text-start d-block">
          ABN <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="abn"
          value={formData.abn}
          onChange={handleChange}
          placeholder="79 123 456 789"
          style={{ borderRadius: 8, padding: "10px" }}
        />
      </div>

      {/* Pty Ltd */}
      <div className="mb-3">
        {/* <label className="form-label fw-medium">
          Pty. Ltd <span className="text-danger">*</span>
        </label> */}
        <label className="form-label fw-medium text-start d-block">
          Pty. Ltd <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="ptyLtd"
          value={formData.ptyLtd}
          onChange={handleChange}
          placeholder="Company Name"
          style={{ borderRadius: 8, padding: "10px" }}
        />
      </div>

      {/* License Upload */}
      <UploadCard
  label="Upload License"
  name="license"
  icon={FaIdCard}
  onChange={handleChange}
  file={formData.license}
/>


      {/* Insurance Upload */}
    <UploadCard
  label="Upload Insurance"
  name="insurance"
  icon={FaFileAlt}
  onChange={handleChange}
  file={formData.insurance}
/>

    </div>
  );
};

export default ContractorStep3;
