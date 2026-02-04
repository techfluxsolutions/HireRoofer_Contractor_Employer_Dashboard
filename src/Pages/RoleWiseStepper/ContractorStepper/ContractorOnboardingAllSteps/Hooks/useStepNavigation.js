// ============================================================
// 4. hooks/useStepNavigation.js
// ============================================================
import { useState, useEffect } from "react";
import { getInitialStepFromLocation } from "../StepperHelper";

export const useStepNavigation = (location, totalSteps) => {
  const [step, setStep] = useState(() => getInitialStepFromLocation(location));

  useEffect(() => {
    const stateStart = location?.state?.startStep;
    if (typeof stateStart === "number" && !Number.isNaN(stateStart)) {
      setStep(() => Math.min(Math.max(stateStart, 1), totalSteps));
      return;
    }
    
    const params = new URLSearchParams(location?.search || "");
    const q = params.get("start");
    if (q) {
      const qn = parseInt(q, 10);
      if (!Number.isNaN(qn)) setStep(() => Math.min(Math.max(qn, 1), totalSteps));
    }
  }, [location, totalSteps]);

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const jumpTo = (n) => setStep(() => Math.min(Math.max(n, 1), totalSteps));

  return {
    step,
    handleNext,
    handleBack,
    jumpTo,
  };
};