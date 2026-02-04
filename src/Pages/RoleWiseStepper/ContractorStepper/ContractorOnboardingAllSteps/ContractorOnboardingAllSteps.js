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
import { useStep4Data } from "./Hooks/useStep4Data";
import { useStep5Data } from "./Hooks/useStep5Data";
const ContractorOnboardingAllSteps = () => {
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
            const isValid = await step1Ref.current?.validateStep1();
            if (!isValid) return;

            const saved = await handleSaveStep1();
            if (!saved) return;
        }

        if (step === 2) {
            if (!formData.experience) {
                showError("Experience is required");
                return;
            }
            if (formData.skills.length === 0) {
                showError("At least one skill is required");
                return;
            }
            if (formData.tools.length === 0) {
                showError("At least one tool is required");
                return;
            }


            const saved = await handleSaveStep2();
            if (!saved) return;
        }
        if (step === 3) {
            if (!formData.abn) {
                showError("ABN is required");
                return;
            }
            if (!formData.ptyLtd) {
                showError("ptyLtd is required");
                return;
            }
            if (!formData.insurance) {
                showError("Insurance is required");
                return;
            }
            if (!formData.license) {
                showError("License is required");
                return;
            }
            const saved = await handleSaveStep3();
            if (!saved) return;
        }


        if (step === 4) {
            if (!formData.hourlyRate) {
                showError("Hourly Rate is required");
                return;
            }
            if (!formData.travelRadius) {
                showError("Travel radius is required");
                return;
            }

            const saved = await handleSaveStep4();
            if (!saved) return;
        }

       



        navNext();
    };

    const handleSubmit = async() => {
         if (step === 5) {
            if (
                !formData.availability?.selectedDates ||
                formData.availability.selectedDates.length === 0
            ) {
                showError("Please select at least one availability date");
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
        <div className="d-flex justify-content-center py-5">
            <div style={{ width: "100%", maxWidth: 720, padding: 16 }}>
                <StepperHeader
                    step={step}
                    stepTitles={STEP_TITLES}
                    jumpTo={jumpTo}
                    progressPercent={progressPercent}
                />

                <div className="card p-4 shadow-sm" style={{ margin: "auto", maxWidth: 600 }}>
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

export default ContractorOnboardingAllSteps;