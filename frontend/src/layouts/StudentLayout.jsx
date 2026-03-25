import StudentNavBar from "@/components/navbar/StudentNavbar";
import StudentFooter from "@/components/student/common/StudentFooter";
import { RouteTransitionWrapper } from "@/components/motion";

export default function StudentLayout() {
 return (
 <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
 <StudentNavBar />
 <main className="flex flex-1 flex-col pt-22">
 <RouteTransitionWrapper />
 </main>
 <StudentFooter />
 </div>
 );
}
