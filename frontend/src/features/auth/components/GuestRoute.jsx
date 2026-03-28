import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const ROLE_HOME = {
    student: "/student/dashboard",
    lecturer: "/lecturer/dashboard",
    technician: "/technician/dashboard",
    admin: "/admin/dashboard",
};

export default function GuestRoute() {
    const { user, isInitialized } = useAuthStore();
    console.log('user: ', user)
    console.log('isInitialized: ', isInitialized)

    // Not yet determined — show loader (null was a blank screen while refresh runs)
    if (!isInitialized) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#e0eafc] dark:bg-[#0f172a]">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1E2B58] border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
            </div>
        );
    }

    if (user) {
        const home = ROLE_HOME[user.role] ?? "/";
        return <Navigate to={home} replace />;
    }

    return <Outlet />;
}
