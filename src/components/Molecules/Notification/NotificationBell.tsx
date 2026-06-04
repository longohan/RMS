import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  
  const overdueList = useNotificationStore((state) => state.overdueList);
  const count = overdueList.length;

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-btn-glass-bg border border-btn-glass-border text-card-text hover:text-layout-text rounded-xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
      >
        <Bell size={20} />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md animate-bounce">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-card-bg backdrop-blur-xl border border-card-border shadow-2xl p-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-card-title mb-3 flex items-center justify-between">
            Thông báo 
            {count > 0 && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded-full  tracking-wider">Có {count} phòng quá hạn</span>}
          </h3>
          
          {count === 0 ? (
            <p className="text-sm font-medium text-emerald-500 text-center py-4 bg-emerald-500/10 rounded-xl">
              Không có hóa đơn nợ.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto liquid-scrollbar pr-1">
              {overdueList.map((inv) => (
                <div key={inv.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex justify-between items-center transition-all hover:bg-red-500/20">
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">Phòng {inv.roomNumber} - {inv.tenantName}</p>
                    <p className="text-xs font-semibold text-card-text">
                      Còn nợ {new Intl.NumberFormat("vi-VN").format(inv.amount)} VND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}