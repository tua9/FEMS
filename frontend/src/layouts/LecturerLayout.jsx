import Footer from "@/components/common/Footer";
import LecturerNavbar from "@/components/navbar/LecturerNavbar";
import { RouteTransitionWrapper } from "@/components/motion";

export default function LecturerLayout() {
 return (
 <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
 <LecturerNavbar />
 <main className="flex flex-1 flex-col pt-22">
 <RouteTransitionWrapper />
 </main>
 <Footer role="lecturer" />
 </div>
 );
}
