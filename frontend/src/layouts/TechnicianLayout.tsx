import TechnicianNavbar from "@/components/technician/navbar/TechnicianNavbar";
import TechnicianFooter from "@/components/technician/TechnicianFooter";
import { Outlet } from "react-router";

export default function TechnicianLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
      <TechnicianNavbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <TechnicianFooter />
    </div>
  );
}
