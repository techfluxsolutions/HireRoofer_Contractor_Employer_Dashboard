import React, { useRef, useState, useEffect } from "react";

const UploadChipBox = ({ label, name, file, onChange, icon: Icon }) => {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);

 useEffect(() => {
  if (!file) {
    setPreviewUrl(null);
    setIsImage(false);
    return;
  }

  let objectUrl;

  if (file instanceof File && file.type.startsWith("image/")) {
    objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsImage(true);
  } else if (typeof file === "string") {
    setPreviewUrl(file);
    setIsImage(true);
  } else {
    setPreviewUrl(null);
    setIsImage(false);
  }

  return () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };
}, [file]);


  const removeFile = (e) => {
    e.stopPropagation();
    onChange({
      target: {
        name,
        value: null,
      },
    });
  };

  return (
    <div
      onClick={() => fileRef.current.click()}
      style={{
        border: "2px dashed #dee2e6",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: "#fff",
        marginBottom: "16px",
      }}
    >
      {/* Image preview or icon */}
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
      ) : Icon ? (
        <Icon size={28} color="#6c757d" style={{ marginBottom: 10 }} />
      ) : null}

      {/* Label */}
      <div style={{ fontWeight: 500, marginBottom: 8 }}>
        {label} <span className="text-danger">*</span>
      </div>

      {/* File Chip */}
      {file && (
        <span
          className="badge d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{
            borderRadius: "20px",
            backgroundColor: "#D6E9F8",
            color: "#333",
            fontSize: "14px",
            cursor: "default",
            marginBottom: 8,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {file instanceof File ? file.name : "Uploaded document"}
          <span
            onClick={removeFile}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginLeft: 6,
            }}
          >
            ✕
          </span>
        </span>
      )}

      {/* Hint text */}
      <div style={{ fontSize: 13, color: "#6c757d" }}>
        {file ? "Tap to change" : "Tap to upload"}
      </div>

      {/* Hidden input */}
      <input
        ref={fileRef}
        hidden
        type="file"
        accept="image/*,.pdf"
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default UploadChipBox;
