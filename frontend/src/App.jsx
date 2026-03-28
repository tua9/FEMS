import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/features/shared/components/theme-provider";
import { useAuthStore } from "./stores/useAuthStore";
import ChatBox from "./components/chat/ChatBox";

export default function App() {
    const { refreshToken, user } = useAuthStore();

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    return (
        <>
            <Toaster richColors />
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                {user && <ChatBox />}
                <Outlet />
            </ThemeProvider>
        </>
    );
}
