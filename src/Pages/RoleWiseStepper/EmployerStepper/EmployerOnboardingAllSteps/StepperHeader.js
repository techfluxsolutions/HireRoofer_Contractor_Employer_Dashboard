import React from "react";

const StepperHeader = ({ step, stepTitles, jumpTo, progressPercent }) => {
  return (
    <div className="mb-3">
      <div className="d-flex align-items-center justify-content-between">
        {stepTitles.map((title, idx) => {
          const n = idx + 1;
          const isActive = n === step;
          const isCompleted = n < step;
          
          return (
            <div
              key={title}
              className="text-center flex-fill"
              style={{ cursor: "pointer", minWidth: 0 }}
              onClick={() => jumpTo(n)}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: isActive ? "2px solid #0d6efd" : isCompleted ? "2px solid #198754" : "2px solid #ced4da",
                  background: isActive ? "#0d6efd" : isCompleted ? "#198754" : "transparent",
                  color: isActive || isCompleted ? "#fff" : "#495057",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
                aria-current={isActive ? "step" : undefined}
                title={title}
              >
                {n}
              </div>
              <div style={{ 
                fontSize: 12, 
                color: isActive ? "#0d6efd" : "#6c757d", 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis" 
              }}>
                {title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2" style={{ height: 6, background: "#e9ecef", borderRadius: 6 }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          height: "100%", 
          borderRadius: 6, 
          background: "#0d6efd", 
          transition: "width .25s ease" 
        }} />
      </div>
    </div>
  );
};

export default StepperHeader;
