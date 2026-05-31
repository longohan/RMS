
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Home, Wrench, FileText, Plus, LogOut } from "lucide-react";
import Button from "@/components/Atoms/Button/Button";

interface SidebarProps {
    onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    // Danh sách các mục menu điều hướng
    const menuItems = [
        { name: "Tổng quan", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Quản lý Phòng", path: "/rooms", icon: <Home size={20} /> },
        { name: "Dịch vụ", path: "/services", icon: <Wrench size={20} /> },
        { name: "Thanh toán / Hóa đơn", path: "/billing", icon: <FileText size={20} /> },
    ];

    return (
        <div className="glass-panel w-69 h-full bg-white/21 sticky top-4 rounded-lg p-4 flex flex-col gap-6 shadow-2xl">
            <div className="flex p-3 items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                    RMS
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 leading-tight">Boarding Hub</h2>
                    <p className="text-xs text-slate-700 dark:text-gray-400 font-medium">Management System</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 p-4 rounded-xl hover:shadow-sm font-medium 
                                ${isActive
                                    ? 'text-blue-700 dark:text-blue-400 bg-white/80 dark:bg-white/10'
                                    : 'text-gray-900 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/40 dark:hover:bg-white/10'}`}
                        >
                            {item.icon} {item.name}
                        </button>
                    )
                })}
            </div>
            <div>
                <Button
                    className="flex w-full"
                    text="Thêm Phòng"
                    variant="solid"
                    size="md"
                    icon={<Plus size={20} />}
                    iconPosition="right"

                />
            </div>
            <div className="border-t border-white/20 pt-4">
                <Button
                    className="flex w-full"
                    text="Đăng xuất"
                    variant="glass"
                    size="md"
                    icon={<LogOut size={20} />}
                    iconPosition="right"
                    onClick={onLogout}
                />
            </div>

        </div>
    );
}