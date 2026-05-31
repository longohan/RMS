import { Routes, Route , Navigate } from "react-router-dom";
import DashboardPage from "@/components/Pages/Dashboard/DashboardPage";
import ProtectedLayout from "@/components/Templates/ProtectedLayout";
import { useAuth } from "@/hook/useAuth";
import LoginPage from "@/components/Pages/Login/LoginPage";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route element={<ProtectedLayout />}>
        
        {/* Khi gõ /dashboard -> React sẽ lấy DashboardPage nhét vào <Outlet /> của ProtectedLayout */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Tương tự, sau này bạn có trang Quản lý phòng thì cứ ném vào đây */}
        {/* <Route path="/rooms" element={<RoomsPage />} /> */}

      </Route>
      <Route 
        path="*" 
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} 
      />
    </Routes>
  );
}