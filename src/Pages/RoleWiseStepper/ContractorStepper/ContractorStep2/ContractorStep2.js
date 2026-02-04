import React, { useEffect, useState } from "react";
import {
  GetExperienceAPI,
  GetSkillsAPI,
  GetToolsAPI,
} from "../../../../utils/APIs/ContractorStepperApis";

/* ---------- Reusable Chip Component ---------- */
const ChipWithDuration = ({ item, onRemove }) => {
  return (
    <span
      className="badge d-inline-flex align-items-center gap-2 px-3 py-2"
      style={{
        borderRadius: "20px",
        backgroundColor: "#D6E9F8",
        color: "#333",
        fontSize: "14px",
        fontWeight: "normal",
      }}
    >
      <span>{item.name}</span>

      <span
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          marginLeft: "4px",
        }}
        onClick={onRemove}
      >
        ✕
      </span>
    </span>
  );
};

/* ---------- Main Component ---------- */
const ContractorStep2 = ({ formData, handleChange }) => {
  const [skillsList, setSkillsList] = useState([]);
  const [toolsList, setToolsList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [skillSearchInput, setSkillSearchInput] = useState("");
  const [toolSearchInput, setToolSearchInput] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  /* ---------- Fetch Dropdown Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      const skillsRes = await GetSkillsAPI();
      const toolsRes = await GetToolsAPI();
      const expRes = await GetExperienceAPI();

      setSkillsList(
        Array.isArray(skillsRes?.data?.data?.skills)
          ? skillsRes.data.data.skills
          : []
      );

      setToolsList(
        Array.isArray(toolsRes?.data?.data?.tools)
          ? toolsRes.data.data.tools
          : []
      );

      const expData = expRes?.data?.data?.experiences || expRes?.data || [];
      setExperienceList(Array.isArray(expData) ? expData : []);
    };

    fetchData();
  }, []);

  /* ---------- Helpers ---------- */
  const addItem = (field, item) => {
    // Check if item already exists by name
    if (formData[field].some((i) => i.name.toLowerCase() === item.name.toLowerCase())) {
      return;
    }

    handleChange({
      target: {
        name: field,
        value: [...formData[field], { ...item, duration: "" }],
      },
    });
  };

  const addManualItem = (field, name) => {
    if (!name.trim()) return;

    // Check if already exists by name
    if (formData[field].some((i) => i.name.toLowerCase() === name.toLowerCase().trim())) {
      return;
    }

    // Create a new item with a unique ID
    const newItem = {
      _id: `manual_${Date.now()}_${Math.random()}`,
      name: name.trim(),
      duration: "",
    };

    handleChange({
      target: {
        name: field,
        value: [...formData[field], newItem],
      },
    });
  };

  const handleSkillInputChange = (value) => {
    setSkillSearchInput(value);
    setShowSkillDropdown(true);
  };

  const handleToolInputChange = (value) => {
    setToolSearchInput(value);
    setShowToolDropdown(true);
  };

  const selectSkill = (skill) => {
    addItem("skills", skill);
    setSkillSearchInput("");
    setShowSkillDropdown(false);
  };

  const selectTool = (tool) => {
    addItem("tools", tool);
    setToolSearchInput("");
    setShowToolDropdown(false);
  };

  const addCustomSkill = () => {
    if (skillSearchInput.trim()) {
      addManualItem("skills", skillSearchInput);
      setSkillSearchInput("");
      setShowSkillDropdown(false);
    }
  };

  const addCustomTool = () => {
    if (toolSearchInput.trim()) {
      addManualItem("tools", toolSearchInput);
      setToolSearchInput("");
      setShowToolDropdown(false);
    }
  };

  const filteredSkills = skillsList.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearchInput.toLowerCase())
  );

  const filteredTools = toolsList.filter((tool) =>
    tool.name.toLowerCase().includes(toolSearchInput.toLowerCase())
  );

  const removeItem = (field, id) => {
    handleChange({
      target: {
        name: field,
        value: formData[field].filter((i) => i._id !== id),
      },
    });
  };

  const updateDuration = (field, id, duration) => {
    handleChange({
      target: {
        name: field,
        value: formData[field].map((i) =>
          i._id === id ? { ...i, duration } : i
        ),
      },
    });
  };

  return (
    <div>

      <h4 className="text-center fw-semibold mb-4">
        What do you bring to the table?
      </h4>
      {/* ---------- Experience ---------- */}
      <div className="mb-4">
        {/* <label className="form-label" style={{ fontWeight: "500" }}>
          Experience *
        </label> */}
        <label className="form-label fw-medium text-start d-block">
          Experience <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="">Select Duration</option>
          {experienceList.map((exp, idx) => (
            <option key={idx} value={exp?.name}>
              {exp.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- Skills ---------- */}
      <div className="mb-4">

        <label className="form-label fw-medium text-start d-block">
          Skills <span className="text-danger">*</span>
        </label>

        {/* Container box for chips */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            minHeight: "80px",
            backgroundColor: "#fff",
            marginBottom: "12px",
          }}
        >
          <div className="d-flex flex-wrap gap-2">
            {formData.skills.length === 0 ? (
              <span style={{ color: "#999", fontSize: "14px" }}>
                Add skill/tool
              </span>
            ) : (
              formData.skills.map((skill) => (
                <ChipWithDuration
                  key={skill._id}
                  item={skill}
                  onRemove={() => removeItem("skills", skill._id)}
                  onDurationChange={(duration) =>
                    updateDuration("skills", skill._id, duration)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Combined Searchable Dropdown */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Add skill/tool"
            value={skillSearchInput}
            onChange={(e) => handleSkillInputChange(e.target.value)}
            onFocus={() => setShowSkillDropdown(true)}
            onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
            onClick={() => setShowSkillDropdown(true)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (skillSearchInput.trim() && filteredSkills.length === 0) {
                  addCustomSkill();
                } else if (filteredSkills.length > 0) {
                  selectSkill(filteredSkills[0]);
                }
              }
            }}
            style={{
              padding: "10px",
              paddingRight: "35px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />

          {/* Dropdown Icon */}
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#666",
            }}
          >
            ▼
          </span>

          {showSkillDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Show filtered or all skills */}
              {(skillSearchInput ? filteredSkills : skillsList).length > 0 ? (
                (skillSearchInput ? filteredSkills : skillsList).map((skill) => (
                  <div
                    key={skill._id}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSkill(skill);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#fff";
                    }}
                  >
                    {skill.name}
                  </div>
                ))
              ) : skillSearchInput ? (
                <div
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    color: "#0d6efd",
                    fontWeight: "500",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addCustomSkill();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  + Add "{skillSearchInput}"
                </div>
              ) : (
                <div style={{ padding: "10px", color: "#999" }}>
                  No skills available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Tools ---------- */}
      <div className="mb-4">
        <label className="form-label fw-medium text-start d-block">
          Tools <span className="text-danger">*</span>
        </label>

        {/* Container box for chips */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            minHeight: "80px",
            backgroundColor: "#fff",
            marginBottom: "12px",
          }}
        >
          <div className="d-flex flex-wrap gap-2">
            {formData.tools.length === 0 ? (
              <span style={{ color: "#999", fontSize: "14px" }}>
                Add skill/tool
              </span>
            ) : (
              formData.tools.map((tool) => (
                <ChipWithDuration
                  key={tool._id}
                  item={tool}
                  onRemove={() => removeItem("tools", tool._id)}
                  onDurationChange={(duration) =>
                    updateDuration("tools", tool._id, duration)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Combined Searchable Dropdown */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Add skill/tool"
            value={toolSearchInput}
            onChange={(e) => handleToolInputChange(e.target.value)}
            onFocus={() => setShowToolDropdown(true)}
            onBlur={() => setTimeout(() => setShowToolDropdown(false), 200)}
            onClick={() => setShowToolDropdown(true)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (toolSearchInput.trim() && filteredTools.length === 0) {
                  addCustomTool();
                } else if (filteredTools.length > 0) {
                  selectTool(filteredTools[0]);
                }
              }
            }}
            style={{
              padding: "10px",
              paddingRight: "35px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />

          {/* Dropdown Icon */}
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#666",
            }}
          >
            ▼
          </span>

          {showToolDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Show filtered or all tools */}
              {(toolSearchInput ? filteredTools : toolsList).length > 0 ? (
                (toolSearchInput ? filteredTools : toolsList).map((tool) => (
                  <div
                    key={tool._id}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectTool(tool);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#fff";
                    }}
                  >
                    {tool.name}
                  </div>
                ))
              ) : toolSearchInput ? (
                <div
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    color: "#0d6efd",
                    fontWeight: "500",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addCustomTool();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  + Add "{toolSearchInput}"
                </div>
              ) : (
                <div style={{ padding: "10px", color: "#999" }}>
                  No tools available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorStep2;