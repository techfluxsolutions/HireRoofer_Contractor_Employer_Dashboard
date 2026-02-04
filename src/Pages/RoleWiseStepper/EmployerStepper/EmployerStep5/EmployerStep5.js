import React, { useEffect, useState } from "react";
import {
  GetEmployerSubscriptionPlansAPI,
  GetAreaStep4API,
} from "../../../../utils/APIs/EmployerStepperApis";

const EmployerStep5 = ({ formData, handleChange }) => {
  const [plans, setPlans] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔹 Fetch Areas
        // 🔹 Fetch Areas
const areaRes = await GetAreaStep4API();

const areaList = Array.isArray(areaRes?.data?.data?.workAreas)
  ? areaRes?.data?.data?.workAreas
  : [];

setAreas(areaList);

        // 🔹 Fetch Plans
        const planRes = await GetEmployerSubscriptionPlansAPI();
        const planList = Array.isArray(planRes?.data?.data)
          ? planRes.data.data
          : [];
        planList.sort((a, b) => a.priority - b.priority);
        setPlans(planList);

      } catch (err) {
        console.error("Step 5 load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectPlan = (planId) => {
    handleChange({
      target: {
        name: "selectedPlan",
        value: planId,
      },
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading…</div>;
  }

  return (
    <div>
      {/* ================= AREA SELECT ================= */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          Identity Check For Account Owner
        </label>

        <select
          className="form-select"
          name="serviceArea"
          value={formData.serviceArea || ""}
          onChange={handleChange}
        >
          <option value="">Enter Area</option>
          {areas.map((area) => (
            <option key={area._id} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TITLE ================= */}
      <h5 className="text-center fw-semibold mb-4">
        Select the perfect plan for your needs.
      </h5>

      {/* ================= PLANS ================= */}
      <div className="row g-4 mb-4">
        {plans.map((plan) => {
          const isSelected = formData.selectedPlan === plan._id;

          return (
            <div key={plan._id} className="col-md-4">
              <div
                className={`border rounded p-4 h-100 cursor-pointer
                  ${isSelected ? "border-primary" : ""}
                `}
                onClick={() => selectPlan(plan._id)}
              >
                {plan.name === "professional" && (
                  <div className="text-center mb-2">
                    <span className="badge bg-warning text-dark">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>{plan.displayName}</strong>
                  <input type="radio" checked={isSelected} readOnly />
                </div>

                <div className="fs-4 fw-bold mb-3">
                  {plan.price === 0 ? "Free" : `$${plan.price}/month`}
                </div>

                <ul className="list-unstyled small text-muted">
                  {plan.features.map((f, i) => (
                    <li key={i} className="mb-2">
                      ✔ {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default EmployerStep5;
