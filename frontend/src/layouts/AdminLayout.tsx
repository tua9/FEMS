import AdminFooter from "@/components/admin/common/AdminFooter";
import AdminNavbar from "@/components/admin/common/AdminNavbar";
import { RouteTransitionWrapper } from "@/components/motion";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
      <AdminNavbar />
      <main className="flex flex-1 flex-col pt-28">
        <RouteTransitionWrapper />
      </main>
      <AdminFooter />
    </div>
  );
}
