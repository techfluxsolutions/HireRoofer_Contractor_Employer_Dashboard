import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContractorStep1 from "./ContractorStep1/ContractorStep1";
import ContractorStep2 from "./ContractorStep2/ContractorStep2";
import ContractorStep3 from "./ContractorStep3/ContractorStep3";
import ContractorStep4 from "./ContractorStep4/ContractorStep4";
import ContractorStep5 from "./ContractorStep5/ContractorStep5";
import ContractorStep6 from "./ContractorStep6";
import { GetWorkerStep1API, SaveWorkerStep1API } from "../../../utils/APIs/ContractorStepperApis";
import { useModal } from "../../../Context/ModalContext/ModalContext";
import Loader from "../../../Loader/Loader";

const STEP_TITLES = ["Personal", "Details", "Skills", "Availability", "Docs", "Finish"];

const ContractorStepper = () => {
  const location = useLocation();
  const step1Ref = useRef(null);

  const getInitialStepFromLocation = () => {
    const stateStart = location?.state?.startStep;
    if (typeof stateStart === "number" && !Number.isNaN(stateStart)) {
      return Math.min(Math.max(stateStart, 1), STEP_TITLES.length);
    }
    try {
      const params = new URLSearchParams(location?.search || "");
      const q = params.get("start");
      if (q) {
        const qn = parseInt(q, 10);
        if (!Number.isNaN(qn)) return Math.min(Math.max(qn, 1), STEP_TITLES.length);
      }
    } catch (e) {
      // ignore
    }
    return 1;
  };

  const [step, setStep] = useState(getInitialStepFromLocation());
  const { showSuccess, showError } = useModal();
  const [loading,setLoading]=useState(false)
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    profilePic: null,
    city: "",
    lat: undefined,
    lng: undefined,
    skills: [], // keep as array (even one skill)
    tools: [],          
    experience: "",
    license: null,
    insurance: null,
    abn: "",
    ptyLtd: "",
    pastJobPhotos: [],
    availability: { selectedDates: [], weeklySchedule: {} },
    hourlyRate: "",
    travelRadius: "",
  });





  useEffect(() => {
    const stateStart = location?.state?.startStep;
    if (typeof stateStart === "number" && !Number.isNaN(stateStart)) {
      setStep(() => Math.min(Math.max(stateStart, 1), STEP_TITLES.length));
      return;
    }
    const params = new URLSearchParams(location?.search || "");
    const q = params.get("start");
    if (q) {
      const qn = parseInt(q, 10);
      if (!Number.isNaN(qn)) setStep(() => Math.min(Math.max(qn, 1), STEP_TITLES.length));
    }
  }, [location]);

  // Generic handleChange used by child components via setField() which calls:
  // handleChange({ target: { name, value } })
  const handleChange = (e) => {
    // defensive: if caller passed something that isn't an event-like object, try to handle it
    const target = e?.target ?? e;
    const { name, value, files } = target ?? {};
    const fieldValue = files ? (files.length === 1 ? files[0] : Array.from(files)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

 const handleSaveStep1 = async () => {
  setLoading(true)
  try {
    const payload = new FormData();

    payload.append(
      "firstName",
      `${formData.salutation} ${formData.firstName}`.trim()
    );
    payload.append("lastName", formData.lastName);
    payload.append("city", formData.city);
    payload.append("lat", formData.lat);
    payload.append("lng", formData.lng);

    if (formData.profilePic) {
      payload.append("profileImage", formData.profilePic);
    }

    const response = await SaveWorkerStep1API(payload);

    if (response?.status === 200 && response?.data?.success) {
      showSuccess(response.data.message || "Step 1 saved");
      return true; // ✅ REQUIRED
    }

    showError(response?.data?.message || "Failed to save Step 1");
    return false;
  } catch (err) {
     setLoading(false)
    console.error("Failed to save Step1:", err);
    showError("Something went wrong");
    return false;
  }
  finally{
    setLoading(false)
  }
};



  // handleNext now validates Step 1 via ref before saving + moving forward
const handleNext = async () => {
  if (step === 1) {
    const isValid = await step1Ref.current?.validateStep1();
    if (!isValid) return;

    const saved = await handleSaveStep1();
    if (!saved) return;
  }

  setStep((s) => Math.min(s + 1, STEP_TITLES.length));
};


  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const jumpTo = (n) => setStep(() => Math.min(Math.max(n, 1), STEP_TITLES.length));

  const handleAvailabilityChange = (availabilityPatch) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        selectedDates: availabilityPatch.selectedDates ?? prev.availability.selectedDates,
        weeklySchedule: availabilityPatch.weeklySchedule ?? prev.availability.weeklySchedule,
      },
      hourlyRate: availabilityPatch.hourlyRate ?? prev.hourlyRate,
      travelRadius: availabilityPatch.travelRadius ?? prev.travelRadius,
    }));
  };


  const mapStep1ResponseToForm = (apiData) => {
  if (!apiData) return {};

  const [salutation = "", firstName = ""] =
    apiData.firstName?.split(" ") ?? [];

  return {
    salutation,
    firstName,
    lastName: apiData?.lastName ?? "",
    city: apiData?.city ?? "",
    lat: apiData?.lat ?? undefined,
    lng: apiData?.lng ?? undefined,
    profilePic: apiData?.profileImage ??null, // ❗ don’t prefill file inputs
  };
};


useEffect(() => {
  const fetchStep1 = async () => {
    try {
      setLoading(true);
      const response = await GetWorkerStep1API();

      if (response?.status === 200 && response?.data?.success) {
        const mappedData = mapStep1ResponseToForm(response?.data?.data);

        setFormData((prev) => ({
          ...prev,
          ...mappedData,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch Step 1:", err);
      showError("Failed to load Step 1 data");
    } finally {
      setLoading(false);
    }
  };

  // fetch only when user is on Step 1
  if (step === 1) {
    fetchStep1();
  }
}, [step]);



  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ContractorStep1
            ref={step1Ref}
            formData={formData}
            handleChange={handleChange}
            skillsMulti={true} // enable multi-select
          />
        );
      case 2:
        return <ContractorStep2 formData={formData} handleChange={handleChange} />;
      case 3:
        return <ContractorStep3 formData={formData} handleChange={handleChange} />;
      case 4:
        return <ContractorStep4 formData={{ availability: formData.availability }} onChange={handleAvailabilityChange} />;
      case 5:
        return <ContractorStep5 formData={formData} handleChange={handleChange} />;
      case 6:
        return <ContractorStep6 formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  const progressPercent = ((step - 1) / (STEP_TITLES.length - 1)) * 100;

  if(loading){
    return <Loader/>
  }

  return (
    <div className="d-flex justify-content-center py-5">
      <div style={{ width: "100%", maxWidth: 720, padding: 16 }}>
        {/* Stepper */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            {STEP_TITLES.map((title, idx) => {
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
                  <div style={{ fontSize: 12, color: isActive ? "#0d6efd" : "#6c757d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thin progress bar */}
          <div className="mt-2" style={{ height: 6, background: "#e9ecef", borderRadius: 6 }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 6, background: "#0d6efd", transition: "width .25s ease" }} />
          </div>
        </div>

        {/* Main card */}
        <div className="card p-4 shadow-sm" style={{ margin: "auto", maxWidth: 600 }}>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <div><strong>Step {step} of {STEP_TITLES.length}</strong></div>
            <div style={{ fontSize: 14, color: "#6c757d" }}>{STEP_TITLES[step - 1]}</div>
          </div>

          {/* Step component */}
          <div>{renderStep()}</div>

          <div className="d-flex justify-content-between mt-4">
            <div>{step > 1 && <button className="btn btn-outline-secondary" onClick={handleBack}>Back</button>}</div>

            <div>
              {step < STEP_TITLES.length ? (
                <button className="btn btn-primary" onClick={handleNext}>Next</button>
              ) : (
                <button className="btn btn-success" onClick={() => alert("Form submitted!")}>Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorStepper;




// import React, { useState } from 'react'
// import ContractorStep1 from './ContractorStep1/ContractorStep1';
// import ContractorStep2 from './ContractorStep2/ContractorStep2';
// import ContractorStep3 from './ContractorStep3/ContractorStep3';
// import ContractorStep4 from './ContractorStep4/ContractorStep4';
// import ContractorStep5 from './ContractorStep5/ContractorStep5';

// const ContractorStepper = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     gender: "",
//     location: "",
//     postalCode: "",
//     skills: "",
//     experience: "",
//     license: null,
//     insurance: null,
//     abn: "",
//     ptyLtd: "",
//     tools: "",
//     pastJobPhotos: [],
//       availability: {
//     selectedDates: [],
//     weeklySchedule: {}, // default structure
//   },
//   hourlyRate: "",
//   travelRadius: "",

//     hourlyRate: "",
//     travelRadius: "",
//     profilePic: null,
//   });

//   const handleNext = () => setStep((prev) => prev + 1);
//   const handleBack = () => setStep((prev) => prev - 1);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files : value,
//     });
//   };

//   const handleAvailabilityChange = (availabilityPatch) => {
//   // availabilityPatch may include selectedDates, weeklySchedule, hourlyRate, travelRadius
//   setFormData(prev => ({
//     ...prev,
//     availability: {
//       ...prev.availability,
//       selectedDates: availabilityPatch.selectedDates ?? prev.availability.selectedDates,
//       weeklySchedule: availabilityPatch.weeklySchedule ?? prev.availability.weeklySchedule,
//     },
//     hourlyRate: availabilityPatch.hourlyRate ?? prev.hourlyRate,
//     travelRadius: availabilityPatch.travelRadius ?? prev.travelRadius,
//   }));
// };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return <ContractorStep1 formData={formData} handleChange={handleChange} />;
//       case 2:
//         return <ContractorStep2 formData={formData} handleChange={handleChange} />;
//       case 3:
//         return <ContractorStep3 formData={formData} handleChange={handleChange} />;
//       case 4:
//         return <ContractorStep4 formData={{ hourlyRate: formData.hourlyRate, travelRadius: formData.travelRadius, availability: formData.availability }}
//                                  onChange={handleAvailabilityChange} />;
//       case 5:
//         return <ContractorStep5 formData={formData} handleChange={handleChange} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container py-5">
//       <div className="card p-4 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
//         <div className="mb-4 text-center">
//           <strong>Step {step} of 5</strong>
//         </div>

//         {renderStep()}

//         <div className="d-flex justify-content-between mt-4">
//           {step > 1 && <button className="btn btn-secondary" onClick={handleBack}>Back</button>}
//           {step < 5 ? (
//             <button className="btn btn-primary ms-auto" onClick={handleNext}>Next</button>
//           ) : (
//             <button
//               className="btn btn-success ms-auto"
//               onClick={() => alert("Form submitted!")}
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContractorStepper