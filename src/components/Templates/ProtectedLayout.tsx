import Sidebar from "@/components/Organisms/SideBar/SideBar";
import ThemeSwitcher from "@/components/Atoms/ThemeMode/ThemeSwitch";
import { useAuth } from "@/hook/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardPage() {
  const { logout, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (

    <div className="flex w-full h-screen p-4 gap-6 overflow-hidden bg-linear-to-tr from-bg-start via-bg-middle to-bg-end">
      
      <div className="shrink-0">
        <Sidebar onLogout={logout} />
      </div>

      <main className="flex-1 h-full overflow-y-auto pr-2 pt-1 flex flex-col gap-6 fade-edge-top liquid-scrollbar text-layout-text">
        <div>
          <ThemeSwitcher />
        </div>
        <Outlet />
      </main>

    </div>
  );
}