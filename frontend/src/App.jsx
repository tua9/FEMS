import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/common/theme-provider";
import { useAuthStore } from "./stores/useAuthStore";
import ChatBox from "./components/chat/ChatBox";

export default function App() {
 const { refreshToken } = useAuthStore();

 useEffect(() => {
 refreshToken();
 }, [refreshToken]);

 return (
 <>
 <Toaster richColors />
 <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
 <ChatBox />
 <Outlet />
 </ThemeProvider>
 </>
 );
}
