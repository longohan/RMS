// src/components/Organisms/Sidebar/Sidebar.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Home, Wrench, FileText, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/Atoms/Button/Button";

interface SidebarProps {
    onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: "Tổng quan", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Quản lý Phòng", path: "/room-management", icon: <Home size={20} /> },
        { name: "Dịch vụ", path: "/service-management", icon: <Wrench size={20} /> },
        { name: "Thanh toán / Hóa đơn", path: "/billing-management", icon: <FileText size={20} /> },
    ];

    return (
        <div
            className={`glass-panel h-full bg-white/21 sticky top-4 rounded-lg p-4  flex flex-col gap-6 shadow-2xl select-none
                ${isCollapsed ? "w-20" : "w-69"}`}
        >
            <div className="flex items-center justify-between p-1">
                <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden
        ${isCollapsed ? "w-0 h-0 opacity-0 pointer-events-none hidden" : "w-auto h-auto opacity-100 flex"}`}
                >
                    <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                        RMS
                    </div>
                    <div className="whitespace-nowrap">
                        <h2 className="text-base font-black text-slate-800 dark:text-gray-100">Boarding Hub</h2>
                        <p className="text-[10px] text-slate-700 dark:text-gray-400 font-bold">Management System</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 ml-1 bg-btn-glass-bg border border-btn-glass-border text-card-text hover:text-layout-text rounded-lg cursor-pointer transition-all hover:scale-105"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            title={isCollapsed ? item.name : undefined}
                            className={`flex items-center gap-3 p-4 rounded-xl hover:shadow-sm font-bold text-sm
                                ${isCollapsed ? "justify-center p-4" : "justify-start"}
                                ${isActive
                                    ? "text-blue-700 dark:text-blue-400 bg-white/80 dark:bg-white/10 shadow-xs"
                                    : "text-gray-900 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/40 dark:hover:bg-white/10"
                                }`}
                        >
                            <div className="shrink-0">{item.icon}</div>
                            <span className={`transition-all duration-200 whitespace-nowrap overflow-hidden text-left ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}`}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto border-t border-white/20 pt-4">
                <Button
                    className="flex w-full justify-center"
                    text={isCollapsed ? "" : "Đăng xuất"}
                    variant="glass"
                    size="md"
                    icon={<LogOut size={20} />}
                    iconPosition={isCollapsed ? "left" : "right"}
                    onClick={onLogout}

                />
            </div>
        </div>
    );
}