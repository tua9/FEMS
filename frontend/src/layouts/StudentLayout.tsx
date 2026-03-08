import Footer from "@/components/common/Footer";
import StudentNavBar from "@/components/StudentNavbar";
import { RouteTransitionWrapper } from "@/components/motion";

export default function StudentLayout() {
  return (
    <div className="student-layout">
      <StudentNavBar />
      <main className="flex flex-1 flex-col pt-28">
        <RouteTransitionWrapper />
      </main>
      <Footer role="student" />
    </div>
  );
}
