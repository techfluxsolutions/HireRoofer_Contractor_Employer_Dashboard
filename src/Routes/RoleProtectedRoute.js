import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({
  allowedRoles,
  children,
  requireStepper = false,
  requireVerification = false,
}) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const role = sessionStorage.getItem("userRole");
  const stepperComplete = sessionStorage.getItem("stepperComplete") === "true";
  const isVerified = sessionStorage.getItem("isVerified") === "true";

  // 🔴 Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // 🔴 Role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 🟡 Stepper required but not completed
  if (requireStepper && !stepperComplete) {
    return (
      <Navigate
        to={role === "employer" ? "/employer-stepper" : "/contractor-stepper"}
        replace
      />
    );
  }

  // 🟡 Verification required but not done
  if (requireVerification && !isVerified) {
    return (
      <Navigate
        to={role === "employer"
          ? "/employer-verified"
          : "/contractor-verified"}
        replace
      />
    );
  }

  return children;
};

export default RoleProtectedRoute;
