import { useEffect, useState } from "react";
import {
  mapStep5ResponseToForm,
} from "../StepperHelper";
import { useNavigate } from "react-router-dom";
import { CheckoutEmployerSubscriptionAPI, CreateEmployerSubscriptionAPI, GetEmployerStep5API, SaveEmployerStep5API } from "../../../../../utils/APIs/EmployerStepperApis";

export const useStep5Data = (
  step,
  formData,
  updateFormData,
  showSuccess,
  showError
) => {
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  // ============================
  // GET STEP 5 DATA
  // ============================
  useEffect(() => {
    if (step !== 5) return;

    const fetchStep5 = async () => {
      try {
        setLoading(true);
        const res = await GetEmployerStep5API();
        console.log("RESPONSE STEP 5", res?.data);

        if (res?.status === 200 && res?.data?.success) {
          updateFormData(mapStep5ResponseToForm(res?.data?.data));
        }
      } catch (err) {
        console.error("Failed to fetch step 5 data", err);
        showError("Failed to load Step 5 data");
      } finally {
        setLoading(false);
      }
    };

    fetchStep5();
  }, [step]);

  // ============================
  // SAVE STEP 5 DATA (POST)
  // ============================
  const handleSaveStep5 = async () => {
  try {
    setLoading(true);

    // 1️⃣ Save Step 5
    const stepPayload = {
      area: formData.serviceArea,
      subscriberID: formData.selectedPlan,
    };

    const stepRes = await SaveEmployerStep5API(stepPayload);

    if (!stepRes?.data?.success) {
      showError("Failed to save Step 5");
      return false;
    }

    if(step?.data?.onboarding?.completed){
      sessionStorage.setItem("stepperComplete",step?.data?.onboarding?.completed)
    }

    // 2️⃣ Create subscription
    const subRes = await CreateEmployerSubscriptionAPI({
      planId: formData.selectedPlan,
      paymentMethod: "stripe",
    });

    if (!subRes?.data?.success) {
      showError("Failed to create subscription");
      return false;
    }

    // 3️⃣ Create Stripe checkout
    const checkoutRes = await CheckoutEmployerSubscriptionAPI({
      planId: formData.selectedPlan,
      successUrl: `${window.location.origin}/employer/subscription/success`,
      cancelUrl: `${window.location.origin}/employer/subscription/cancel`,
    });

    const checkoutUrl = checkoutRes?.data?.data?.checkout?.url;

    if (!checkoutUrl) {
      showError("Stripe checkout URL not received");
      return false;
    }

    // 4️⃣ REDIRECT TO STRIPE 🔥
    window.location.href = checkoutUrl;
    return true;

  } catch (err) {
    console.error("Step 5 + Stripe failed", err);
    showError("Payment initialization failed");
    return false;
  } finally {
    setLoading(false);
  }
};


  return { loading, handleSaveStep5 };
};
