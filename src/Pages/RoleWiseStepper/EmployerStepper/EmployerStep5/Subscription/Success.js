// src/pages/employer/SubscriptionSuccess.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ConfirmEmployerSubscriptionAPI } from "../../../../../utils/APIs/EmployerStepperApis";

const EmployerSubscriptionSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    const confirm = async () => {
      try {
        await ConfirmEmployerSubscriptionAPI({ sessionId });
        navigate("/employer-verified");
      } catch (e) {
        console.error("Subscription confirm failed", e);
      }
    };

    confirm();
  }, []);

  return <p>Finalizing your subscription…</p>;
};

export default EmployerSubscriptionSuccess;
