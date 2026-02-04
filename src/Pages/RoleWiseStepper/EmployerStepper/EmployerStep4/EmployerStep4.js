import React, { useState, useEffect, useRef } from "react";
import {
  GetAreaStep4API,
  GetHiringPreferenceStep4API,
  GetNumberOfEmployeesStep4API,
  GetProjectTypesStep4API,
} from "../../../../utils/APIs/EmployerStepperApis";

/* ---------- Modern Chip Component ---------- */
const ModernChip = ({ item, onRemove, isCustom = false }) => (
  <div
    className="d-inline-flex align-items-center gap-2 px-3 py-2 me-2 mb-2"
    style={{
      borderRadius: "24px",
      backgroundColor: isCustom ? "#F0F9F0" : "#F0F7FF",
      color: isCustom ? "#059669" : "#2563EB",
      fontSize: "14px",
      fontWeight: 500,
      border: `1px solid ${isCustom ? "#D1FAE5" : "#DBEAFE"}`,
      transition: "all 0.2s ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }}
  >
    {item.name}
    {isCustom && (
      <span className="ms-1" style={{ fontSize: "10px", opacity: 0.7 }}>
        (custom)
      </span>
    )}
    <button
      className="border-0 bg-transparent p-0 d-flex align-items-center justify-content-center"
      onClick={onRemove}
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        color: isCustom ? "#059669" : "#6B7280",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginLeft: "4px",
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#DC2626";
        e.target.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = isCustom ? "#059669" : "#6B7280";
      }}
    >
      ✕
    </button>
  </div>
);

/* ---------- Main Component ---------- */
const EmployerStep4 = ({ formData, handleChange }) => {
  const [areaInput, setAreaInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customAreas, setCustomAreas] = useState([]);
  const [customProjects, setCustomProjects] = useState([]);

  const [areasList, setAreasList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [hirePreferenceOptions, setHirePreferenceOptions] = useState([]);

  // Refs for dropdown containers
  const areaDropdownRef = useRef(null);
  const projectDropdownRef = useRef(null);
  const areaInputRef = useRef(null);
  const projectInputRef = useRef(null);

  const safeFormData = {
    workAreas: Array.isArray(formData.workAreas) ? formData.workAreas : [],
    roofingTypes: Array.isArray(formData.roofingTypes)
      ? formData.roofingTypes
      : [],
    hireOwnCrew: formData.hireOwnCrew ?? "",
    numberOfEmployees: formData.numberOfEmployees ?? "",
  };

  /* ---------- Fetch dropdown data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [areas, projects, employees, hirePrefs] = await Promise.all([
          GetAreaStep4API(),
          GetProjectTypesStep4API(),
          GetNumberOfEmployeesStep4API(),
          GetHiringPreferenceStep4API(),
        ]);

        setAreasList(areas?.data?.data?.workAreas || []);
        setProjectsList(projects?.data?.data?.projectTypes || []);
        setEmployeeOptions(employees?.data?.data?.companySizes || []);
        setHirePreferenceOptions(
          hirePrefs?.data?.data?.hiringPreferences || []
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Click outside handler ---------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setShowAreaDropdown(false);
      }
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setShowProjectDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------- Helpers ---------- */
  const addItem = (field, item, isCustom = false) => {
    const currentList = safeFormData[field];
    
    // For custom items, check by name instead of _id
    if (isCustom) {
      if (currentList.some(i => i.name.toLowerCase() === item.name.toLowerCase())) return;
      
      const customItem = {
        _id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        isCustom: true
      };
      
      handleChange({
        target: {
          name: field,
          value: [...currentList, customItem],
        },
      });

      // Store custom item in separate state
      if (field === 'workAreas') {
        setCustomAreas(prev => [...prev, customItem]);
      } else if (field === 'roofingTypes') {
        setCustomProjects(prev => [...prev, customItem]);
      }
    } else {
      if (!item || !item._id) return;
      if (currentList.some((i) => i._id === item._id)) return;

      handleChange({
        target: {
          name: field,
          value: [...currentList, item],
        },
      });
    }
  };

  const removeItem = (field, id) => {
    handleChange({
      target: {
        name: field,
        value: safeFormData[field].filter((i) => i._id !== id),
      },
    });
  };

  // Combine API data with custom items
  const allAreas = [...areasList, ...customAreas];
  const allProjects = [...projectsList, ...customProjects];

  const filteredAreas = areaInput 
    ? allAreas.filter((a) =>
        a.name.toLowerCase().includes(areaInput.toLowerCase())
      )
    : allAreas;

  const filteredProjects = projectInput
    ? allProjects.filter((p) =>
        p.name.toLowerCase().includes(projectInput.toLowerCase())
      )
    : allProjects;

  const isAreaInList = allAreas.some(a => 
    a.name.toLowerCase() === areaInput.trim().toLowerCase()
  );

  const isProjectInList = allProjects.some(p => 
    p.name.toLowerCase() === projectInput.trim().toLowerCase()
  );

  const handleAreaInputChange = (e) => {
    setAreaInput(e.target.value);
    if (!showAreaDropdown) {
      setShowAreaDropdown(true);
    }
  };

  const handleProjectInputChange = (e) => {
    setProjectInput(e.target.value);
    if (!showProjectDropdown) {
      setShowProjectDropdown(true);
    }
  };

  const handleAreaSelect = (area) => {
    addItem("workAreas", area, area.isCustom);
    setAreaInput("");
    setShowAreaDropdown(false);
  };

  const handleProjectSelect = (project) => {
    addItem("roofingTypes", project, project.isCustom);
    setProjectInput("");
    setShowProjectDropdown(false);
  };

  const handleAreaKeyDown = (e) => {
    if (e.key === 'Enter' && areaInput.trim() && !isAreaInList) {
      e.preventDefault();
      handleAreaSelect({ name: areaInput.trim(), isCustom: true });
    }
  };

  const handleProjectKeyDown = (e) => {
    if (e.key === 'Enter' && projectInput.trim() && !isProjectInList) {
      e.preventDefault();
      handleProjectSelect({ name: projectInput.trim(), isCustom: true });
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 p-md-4">
      {/* ---------- Areas ---------- */}
      <div className="mb-5">
        <label className="form-label fw-semibold mb-3" style={{ color: "#1F2937", fontSize: "15px" }}>
          Areas Where the Company Usually Works
          <span className="text-danger ms-1">*</span>
        </label>

        <div 
          className="border rounded-3 p-3 mb-3"
          style={{
            borderColor: "#E5E7EB",
            backgroundColor: safeFormData.workAreas.length > 0 ? "#F9FAFB" : "transparent",
            minHeight: "56px",
            transition: "all 0.3s ease",
          }}
        >
          {safeFormData.workAreas.length > 0 ? (
            <div className="d-flex flex-wrap">
              {safeFormData.workAreas.map((area) => (
                <ModernChip
                  key={area._id}
                  item={area}
                  isCustom={area.isCustom}
                  onRemove={() => removeItem("workAreas", area._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-muted" style={{ fontSize: "14px" }}>
              No areas selected yet. Type to search or add custom areas...
            </div>
          )}
        </div>

        <div className="position-relative">
          <input
            ref={areaInputRef}
            className="form-control form-control-lg"
            placeholder="Search or type custom area and press Enter..."
            value={areaInput}
            onChange={handleAreaInputChange}
            onFocus={() => setShowAreaDropdown(true)}
            onKeyDown={handleAreaKeyDown}
            style={{
              borderRadius: "12px",
              borderColor: showAreaDropdown ? "#3B82F6" : "#D1D5DB",
              padding: "12px 16px",
              fontSize: "15px",
              transition: "all 0.3s ease",
            }}
          />
          <span className="position-absolute" style={{ right: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
            ⌄
          </span>
        </div>

        {showAreaDropdown && (
          <div 
            ref={areaDropdownRef}
            className="border rounded-3 mt-2 shadow-sm bg-white"
            style={{
              zIndex: 1000,
              maxHeight: "250px",
              overflowY: "auto",
              borderColor: "#E5E7EB",
              position: "relative",
            }}
          >
            {filteredAreas.length > 0 ? (
              <>
                {filteredAreas.map((area) => (
                  <div
                    key={area._id}
                    className="p-3 cursor-pointer hover-effect"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAreaSelect(area);
                    }}
                    style={{
                      borderBottom: "1px solid #F3F4F6",
                      transition: "all 0.2s ease",
                      backgroundColor: safeFormData.workAreas.some(a => a._id === area._id) ? "#F0F9FF" : "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F0F9FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = safeFormData.workAreas.some(a => a._id === area._id) ? "#F0F9FF" : "white";
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ 
                          color: safeFormData.workAreas.some(a => a._id === area._id) ? "#2563EB" : "#1F2937", 
                          fontWeight: 500 
                        }}>
                          {area.name}
                        </span>
                        {area.isCustom && (
                          <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: "10px", padding: "2px 6px" }}>
                            Custom
                          </span>
                        )}
                      </div>
                      {safeFormData.workAreas.some(a => a._id === area._id) && (
                        <span className="text-success" style={{ fontSize: "12px" }}>
                          ✓ Added
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-3">
                <div className="text-muted text-center mb-2" style={{ fontSize: "14px" }}>
                  No matching areas found
                </div>
                {areaInput.trim() && !isAreaInList && (
                  <button
                    className="btn btn-outline-primary w-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAreaSelect({ name: areaInput.trim(), isCustom: true });
                    }}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                    }}
                  >
                    + Add "{areaInput}" as custom area
                  </button>
                )}
              </div>
            )}
            
            {areaInput.trim() && !isAreaInList && filteredAreas.length > 0 && (
              <div className="border-top p-3">
                <button
                  className="btn btn-outline-success w-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAreaSelect({ name: areaInput.trim(), isCustom: true });
                  }}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                  }}
                >
                  + Add "{areaInput}" as custom area
                </button>
              </div>
            )}
          </div>
        )}
        
        {areaInput.trim() && !isAreaInList && (
          <div className="mt-2 text-muted" style={{ fontSize: "13px" }}>
            Press Enter or click the button above to add "{areaInput}" as a custom area
          </div>
        )}
      </div>

      {/* ---------- Roofing Projects ---------- */}
      <div className="mb-5">
        <label className="form-label fw-semibold mb-3" style={{ color: "#1F2937", fontSize: "15px" }}>
          Types of Roofing Projects
          <span className="text-danger ms-1">*</span>
        </label>

        <div 
          className="border rounded-3 p-3 mb-3"
          style={{
            borderColor: "#E5E7EB",
            backgroundColor: safeFormData.roofingTypes.length > 0 ? "#F9FAFB" : "transparent",
            minHeight: "56px",
            transition: "all 0.3s ease",
          }}
        >
          {safeFormData.roofingTypes.length > 0 ? (
            <div className="d-flex flex-wrap">
              {safeFormData.roofingTypes.map((project) => (
                <ModernChip
                  key={project._id}
                  item={project}
                  isCustom={project.isCustom}
                  onRemove={() => removeItem("roofingTypes", project._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-muted" style={{ fontSize: "14px" }}>
              No project types selected yet. Type to search or add custom projects...
            </div>
          )}
        </div>

        <div className="position-relative">
          <input
            ref={projectInputRef}
            className="form-control form-control-lg"
            placeholder="Search or type custom project and press Enter..."
            value={projectInput}
            onChange={handleProjectInputChange}
            onFocus={() => setShowProjectDropdown(true)}
            onKeyDown={handleProjectKeyDown}
            style={{
              borderRadius: "12px",
              borderColor: showProjectDropdown ? "#3B82F6" : "#D1D5DB",
              padding: "12px 16px",
              fontSize: "15px",
              transition: "all 0.3s ease",
            }}
          />
          <span className="position-absolute" style={{ right: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
            ⌄
          </span>
        </div>

        {showProjectDropdown && (
          <div 
            ref={projectDropdownRef}
            className="border rounded-3 mt-2 shadow-sm bg-white"
            style={{
              zIndex: 1000,
              maxHeight: "250px",
              overflowY: "auto",
              borderColor: "#E5E7EB",
              position: "relative",
            }}
          >
            {filteredProjects.length > 0 ? (
              <>
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-3 cursor-pointer hover-effect"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleProjectSelect(project);
                    }}
                    style={{
                      borderBottom: "1px solid #F3F4F6",
                      transition: "all 0.2s ease",
                      backgroundColor: safeFormData.roofingTypes.some(p => p._id === project._id) ? "#F0F9FF" : "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F0F9FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = safeFormData.roofingTypes.some(p => p._id === project._id) ? "#F0F9FF" : "white";
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ 
                          color: safeFormData.roofingTypes.some(p => p._id === project._id) ? "#2563EB" : "#1F2937", 
                          fontWeight: 500 
                        }}>
                          {project.name}
                        </span>
                        {project.isCustom && (
                          <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: "10px", padding: "2px 6px" }}>
                            Custom
                          </span>
                        )}
                      </div>
                      {safeFormData.roofingTypes.some(p => p._id === project._id) && (
                        <span className="text-success" style={{ fontSize: "12px" }}>
                          ✓ Added
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-3">
                <div className="text-muted text-center mb-2" style={{ fontSize: "14px" }}>
                  No matching projects found
                </div>
                {projectInput.trim() && !isProjectInList && (
                  <button
                    className="btn btn-outline-primary w-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleProjectSelect({ name: projectInput.trim(), isCustom: true });
                    }}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                    }}
                  >
                    + Add "{projectInput}" as custom project
                  </button>
                )}
              </div>
            )}
            
            {projectInput.trim() && !isProjectInList && filteredProjects.length > 0 && (
              <div className="border-top p-3">
                <button
                  className="btn btn-outline-success w-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleProjectSelect({ name: projectInput.trim(), isCustom: true });
                  }}
                  style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                  }}
                >
                  + Add "{projectInput}" as custom project
                </button>
              </div>
            )}
          </div>
        )}
        
        {projectInput.trim() && !isProjectInList && (
          <div className="mt-2 text-muted" style={{ fontSize: "13px" }}>
            Press Enter or click the button above to add "{projectInput}" as a custom project
          </div>
        )}
      </div>

      {/* ---------- Hire Own Crew (Full Width) ---------- */}
      <div className="mb-4">
        <label className="form-label fw-semibold mb-2" style={{ color: "#1F2937", fontSize: "15px" }}>
          Whether They Hire Out Their Own Crew
          <span className="text-danger ms-1">*</span>
        </label>
        <select
          className="form-select form-select-lg"
          name="hireOwnCrew"
          value={safeFormData.hireOwnCrew}
          onChange={handleChange}
          style={{
            borderRadius: "12px",
            borderColor: safeFormData.hireOwnCrew ? "#3B82F6" : "#D1D5DB",
            padding: "12px 16px",
            fontSize: "15px",
            color: safeFormData.hireOwnCrew ? "#1F2937" : "#6B7280",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          <option value="">Select an option</option>
          {hirePreferenceOptions.map((pref) => (
            <option key={pref.id} value={pref.value}>
              {pref.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- Number of Employees (Full Width) ---------- */}
      <div className="mb-4">
        <label className="form-label fw-semibold mb-2" style={{ color: "#1F2937", fontSize: "15px" }}>
          Number of Employees
          <span className="text-danger ms-1">*</span>
        </label>
        <select
          className="form-select form-select-lg"
          name="numberOfEmployees"
          value={safeFormData.numberOfEmployees}
          onChange={handleChange}
          style={{
            borderRadius: "12px",
            borderColor: safeFormData.numberOfEmployees ? "#3B82F6" : "#D1D5DB",
            padding: "12px 16px",
            fontSize: "15px",
            color: safeFormData.numberOfEmployees ? "#1F2937" : "#6B7280",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          <option value="">Select number</option>
          {employeeOptions.map((emp) => (
            <option key={emp._id} value={emp.number}>
              {emp.name} ({emp.range})
            </option>
          ))}
        </select>
      </div>

      {/* Add some custom CSS for hover effects */}
      <style jsx>{`
        .hover-effect:hover {
          background-color: #F0F9FF !important;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          border-color: #3B82F6 !important;
        }
        ::placeholder {
          color: #9CA3AF !important;
        }
      `}</style>
    </div>
  );
};

export default EmployerStep4;


// import React, { useState } from "react";

// /* ---------- Reusable Chip ---------- */
// const Chip = ({ item, onRemove }) => (
//   <span
//     className="badge d-inline-flex align-items-center gap-2 px-3 py-2"
//     style={{
//       borderRadius: "20px",
//       backgroundColor: "#D6E9F8",
//       color: "#333",
//       fontSize: "14px",
//     }}
//   >
//     {item.name}
//     <span
//       style={{ cursor: "pointer", fontWeight: "bold" }}
//       onClick={onRemove}
//     >
//       ✕
//     </span>
//   </span>
// );

// /* ---------- Main Component ---------- */
// const EmployerStep4 = ({ formData, handleChange }) => {
//   const [areaInput, setAreaInput] = useState("");
//   const [projectInput, setProjectInput] = useState("");
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showProjectDropdown, setShowProjectDropdown] = useState(false);
// const safeFormData = {
//   areas: formData.areas || [],
//   projects: formData.projects || [],
//   hireOwnCrew: formData.hireOwnCrew || "",
//   numberOfEmployees: formData.numberOfEmployees || "",
// };

//   /* Static dropdown data (replace with API if needed) */
//   const areasList = [
//     { _id: "1", name: "Residential" },
//     { _id: "2", name: "Commercial" },
//     { _id: "3", name: "Industrial" },
//   ];

//   const projectsList = [
//     { _id: "1", name: "Roof Installation" },
//     { _id: "2", name: "Roof Repair" },
//     { _id: "3", name: "Roof Replacement" },
//   ];

//   /* ---------- Helpers ---------- */
//   const addItem = (field, name) => {
//     if (!name.trim()) return;

//     if (safeFormData[field].some(i => i.name.toLowerCase() === name.toLowerCase())) {
//       return;
//     }

//     handleChange({
//       target: {
//         name: field,
//         value: [...safeFormData[field], { _id: Date.now(), name }],
//       },
//     });
//   };

//   const removeItem = (field, id) => {
//     handleChange({
//       target: {
//         name: field,
//         value: safeFormData[field].filter(i => i._id !== id),
//       },
//     });
//   };

//   const filteredAreas = areasList.filter(a =>
//     a.name.toLowerCase().includes(areaInput.toLowerCase())
//   );

//   const filteredProjects = projectsList.filter(p =>
//     p.name.toLowerCase().includes(projectInput.toLowerCase())
//   );

//   return (
//     <div>
//       {/* ---------- Areas ---------- */}
//       <div className="mb-4">
//         <label className="form-label fw-medium">
//           Areas Where the Company Usually Works
//         </label>

//         <div className="border rounded p-2 mb-2">
//           <div className="d-flex flex-wrap gap-2">
//             {safeFormData.areas.map(area => (
//               <Chip
//                 key={area._id}
//                 item={area}
//                 onRemove={() => removeItem("areas", area._id)}
//               />
//             ))}
//           </div>
//         </div>

//         <input
//           className="form-control"
//           placeholder="Enter Area"
//           value={areaInput}
//           onChange={e => {
//             setAreaInput(e.target.value);
//             setShowAreaDropdown(true);
//           }}
//           onFocus={() => setShowAreaDropdown(true)}
//           onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
//           onKeyDown={e => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               addItem("areas", areaInput);
//               setAreaInput("");
//             }
//           }}
//         />

//         {showAreaDropdown && (
//           <div className="border rounded mt-1 bg-white">
//             {(areaInput ? filteredAreas : areasList).map(area => (
//               <div
//                 key={area._id}
//                 className="p-2 cursor-pointer"
//                 onMouseDown={() => {
//                   addItem("areas", area.name);
//                   setAreaInput("");
//                 }}
//               >
//                 {area.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ---------- Roofing Projects ---------- */}
//       <div className="mb-4">
//         <label className="form-label fw-medium">
//           Types of Roofing Projects
//         </label>

//         <div className="border rounded p-2 mb-2">
//           <div className="d-flex flex-wrap gap-2">
//             {safeFormData.projects.map(project => (
//               <Chip
//                 key={project._id}
//                 item={project}
//                 onRemove={() => removeItem("projects", project._id)}
//               />
//             ))}
//           </div>
//         </div>

//         <input
//           className="form-control"
//           placeholder="Enter Types Of Roofing Projects"
//           value={projectInput}
//           onChange={e => {
//             setProjectInput(e.target.value);
//             setShowProjectDropdown(true);
//           }}
//           onFocus={() => setShowProjectDropdown(true)}
//           onBlur={() => setTimeout(() => setShowProjectDropdown(false), 200)}
//           onKeyDown={e => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               addItem("projects", projectInput);
//               setProjectInput("");
//             }
//           }}
//         />

//         {showProjectDropdown && (
//           <div className="border rounded mt-1 bg-white">
//             {(projectInput ? filteredProjects : projectsList).map(project => (
//               <div
//                 key={project._id}
//                 className="p-2 cursor-pointer"
//                 onMouseDown={() => {
//                   addItem("projects", project.name);
//                   setProjectInput("");
//                 }}
//               >
//                 {project.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ---------- Hire Own Crew ---------- */}
//       <div className="mb-4">
//         <label className="form-label fw-medium">
//           Whether They Hire Out Their Own Crew
//         </label>
//         <select
//           className="form-select"
//           name="hireOwnCrew"
//           value={safeFormData.hireOwnCrew}
//           onChange={handleChange}
//         >
//           <option value="">Select</option>
//           <option value="yes">Yes</option>
//           <option value="no">No</option>
//         </select>
//       </div>

//       {/* ---------- Number of Employees ---------- */}
//       <div className="mb-4">
//         <label className="form-label fw-medium">
//           Number of Employees
//         </label>
//         <select
//           className="form-select"
//           name="numberOfEmployees"
//           value={safeFormData.numberOfEmployees}
//           onChange={handleChange}
//         >
//           <option value="">Select Number</option>
//           <option value="1-5">1–5</option>
//           <option value="6-10">6–10</option>
//           <option value="11-25">11–25</option>
//           <option value="25+">25+</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default EmployerStep4;
