import { Outlet } from "react-router-dom";
import WorkerNavbar from "./Navbar/Worker/WorkerNavbar";

const WorkerLayout = () => {
  return (
    <>
      <WorkerNavbar />
      <Outlet />
    </>
  );
};

export default WorkerLayout;
