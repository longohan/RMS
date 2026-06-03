import { Routes, Route , Navigate } from "react-router-dom";
import DashboardPage from "@/components/Pages/Dashboard/DashboardPage";
import ProtectedLayout from "@/components/Templates/ProtectedLayout";
import { useAuth } from "@/hook/useAuth";
import LoginPage from "@/components/Pages/Login/LoginPage";
import RoomManagementPage from "@/components/Pages/RoomManagement/RoomManagementPage";
import ServiceManagementPage from "@/components/Pages/ServiceManagement/ServiceManagementPage"; 
import BillingManagementPage from "@/components/Pages/BillingManagement/BillingManagementPage";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/room-management" element={<RoomManagementPage />} />
        <Route path="/service-management" element={<ServiceManagementPage />} />
        <Route path="/billing-management" element={<BillingManagementPage />} />
      </Route>
      <Route 
        path="*" 
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} 
      />
    </Routes>
  );
}