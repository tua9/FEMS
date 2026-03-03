import { Outlet } from "react-router-dom";
import TechnicianNavbar from "./navbar/TechnicianNavbar";
import TechnicianFooter from "./TechnicianFooter";

export default function TechnicianLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#E0EAFC] dark:bg-[#0f172a]">
      <TechnicianNavbar />
      <main className="grow">
        <Outlet />
      </main>
      <TechnicianFooter />
    </div>
  );
}
