// ============================================================
// 9. MAIN: ContractorStepper.jsx (Refactored)
// ============================================================
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useModal } from "../../../../Context/ModalContext/ModalContext";
import { useFormData } from "./useFormdata";
import { useStepNavigation } from "./Hooks/useStepNavigation";
import { STEP_TITLES, TOTAL_STEPS } from "./stepConfig";
import { useStep1Data } from "./Hooks/useStep1Data";
import { calculateProgressPercent } from "./StepperHelper";
import Loader from "../../../../Loader/Loader";
import StepperHeader from "./StepperHeader";
import StepContent from "./StepContent";
import NavigationButtons from "./NavigationButtons";
import { useStep2Data } from "./Hooks/useStep2Data";
import { useStep3Data } from "./Hooks/useStep3Data";
import { useStep5Data } from "./Hooks/useStep5Data";
import { useStep4Data } from "./Hooks/useStep4Data";
const EmployerOnboardingAllSteps = () => {
    const location = useLocation();
    const step1Ref = useRef(null);
    const { showSuccess, showError } = useModal();
    const { formData, handleChange, handleAvailabilityChange, updateFormData } = useFormData();
    const { step, handleNext: navNext, handleBack, jumpTo } = useStepNavigation(location, TOTAL_STEPS);
    const { loading, handleSaveStep1 } = useStep1Data(step, formData, updateFormData, showSuccess, showError);
    const { loading: step2Loading, handleSaveStep2 } = useStep2Data(
        step,
        formData,
        updateFormData,
        showSuccess,
        showError
    );
    const {
        loading: step3Loading,
        handleSaveStep3
    } = useStep3Data(step, formData, updateFormData, showSuccess,
        showError);

    const { loading: step4Loading, handleSaveStep4 } = useStep4Data(
        step,
        formData,
        updateFormData,
        showSuccess,
        showError
    );

    const { loading: step5Loading, handleSaveStep5 } = useStep5Data(
        step,
        formData,
        updateFormData,
        showSuccess,
        showError
    );




    const handleNext = async () => {
        if (step === 1) {
             if (!formData.companyName) {
                showError("Company Name is required");
                return;
            }
             if (!formData.abn) {
                showError("ABN is required");
                return;
            }
             if (!formData.ptyLtdStatus) {
                showError("Pty Ltd / Sole Trader Status is required");
                return;
            }
             if (!formData.companyLogo) {
                showError("Company Logo is required");
                return;
            }
             if (!formData.profileImage) {
                showError("Profile Image is required");
                return;
            }
             if (!formData.officeAddress) {
                showError("Office Address is required");
                return;
            }
     

            const saved = await handleSaveStep1();
            if (!saved) return;
        }

        if (step === 2) {
               if (!formData.roofingLicence) {
                showError("Please Upload Roofing Licence");
                return;
            }
             if (!formData.licenceNumber) {
                showError("Licence Number is required");
                return;
            }
             if (!formData.expirationDate) {
                showError("Licence Expiration is required");
                return;
            }
             if (!formData.proofOfInsurance) {
                showError("Please Upload Roofing Insurance");
                return;
            }
     
            const saved = await handleSaveStep2();
            if (!saved) return;
        }
        if (step === 3) {
            if (!formData.contactPersonName) {
                showError("Contact Person is required");
                return;
            }
            if (!formData.position) {
                showError("Role is required");
                return;
            }
            if (!formData.phoneNumber) {
                showError("Phone Number is required");
                return;
            }
            if (!formData.email) {
                showError("Email is required");
                return;
            }
            const saved = await handleSaveStep3();
            if (!saved) return;
        }


       if (step === 4) {
  if (!formData.workAreas || formData.workAreas.length === 0) {
    showError("Please select at least one service area");
    return;
  }

  if (!formData.roofingTypes || formData.roofingTypes.length === 0) {
    showError("Please select at least one project type");
    return;
  }

  if (!formData.hireOwnCrew) {
    showError("Please select hiring preference");
    return;
  }

  if (!formData.numberOfEmployees) {
    showError("Please select number of employees");
    return;
  }

 
  const saved = await handleSaveStep4();
  if (!saved) return;
}


       



        navNext();
    };

    const handleSubmit = async() => {
         if (step === 5) {
            if (!formData.serviceArea
            ) {
                showError("Please select service Area");
                return;
            }

             if (!formData.selectedPlan
            ) {
                showError("Please select Package");
                return;
            }

            const saved = await handleSaveStep5();
            if (!saved) return;
        }
    };

    const progressPercent = calculateProgressPercent(step, TOTAL_STEPS);

    if (loading || step2Loading || step3Loading || step4Loading || step5Loading)
        return <Loader />;


    return (
          <div className="container-fluid px-4 mb-4">
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <StepperHeader
                    step={step}
                    stepTitles={STEP_TITLES}
                    jumpTo={jumpTo}
                    progressPercent={progressPercent}
                />

                <div className="card p-4 shadow-sm" style={{ margin: "auto", maxWidth: 1400 }}>
                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div>
                            <strong>Step {step} of {TOTAL_STEPS}</strong>
                        </div>
                        <div style={{ fontSize: 14, color: "#6c757d" }}>
                            {STEP_TITLES[step - 1]}
                        </div>
                    </div>

                    <StepContent
                        step={step}
                        formData={formData}
                        handleChange={handleChange}
                        handleAvailabilityChange={handleAvailabilityChange}
                        step1Ref={step1Ref}
                    />

                    <NavigationButtons
                        step={step}
                        totalSteps={TOTAL_STEPS}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployerOnboardingAllSteps;