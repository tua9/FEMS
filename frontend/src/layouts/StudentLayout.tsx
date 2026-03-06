import Footer from "@/components/common/Footer";
import StudentNavBar from "@/components/StudentNavbar";
import { Outlet } from "react-router";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <StudentNavBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer role="student" />
    </div>
  );
}
