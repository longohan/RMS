import Sidebar from "@/components/Organisms/SideBar/SideBar";
import ThemeSwitcher from "@/components/Atoms/ThemeMode/ThemeSwitch";
import {  useAuth } from "@/hook/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useTheme } from "next-themes";


export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {logout , isLoggedIn} = useAuth();

  if(!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`flex w-full h-screen p-4 gap-6 overflow-hidden transition-colors duration-500 ${isDark
      ? "bg-linear-to-tr from-slate-900 via-slate-800 to-slate-950"
      : "bg-linear-to-tr from-[#E0C3FC] via-[#8EC5FC] to-[#E2F0D9]"
      }`}>
      <div className="shrink-0">
        <Sidebar onLogout={logout} />
      </div>
      <main className={`flex-1 h-full overflow-y-auto pr-2 flex flex-col gap-6 transition-colors duration-500 ${isDark ? "text-gray-100" : "text-gray-900"
        }`}>
        <div>
          <ThemeSwitcher />
        </div>
        <Outlet />
      </main>
    </div>
  );
}