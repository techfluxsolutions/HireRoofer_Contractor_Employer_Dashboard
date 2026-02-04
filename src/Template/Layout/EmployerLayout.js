import { Outlet } from "react-router-dom";
import EmployerNavbar from "./Navbar/Employer/EmployerNavbar";

const EmployerLayout = () => {
  return (
    <>
      <EmployerNavbar />
      <Outlet />
    </>
  );
};

export default EmployerLayout;
