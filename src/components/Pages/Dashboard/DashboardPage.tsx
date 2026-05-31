// src/components/Pages/Dashboard/DashboardPage.tsx
import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MasterSelect from "@/components/Atoms/Select/MasterSelect";
import GlassDateInput from "@/components/Atoms/Select/RangeDateSelect";

// Dữ liệu giả lập cho biểu đồ (Sau này bạn fetch từ API về)
const mockChartData = [
  { name: 'T1', revenue: 4000, rooms: 24 },
  { name: 'T2', revenue: 3000, rooms: 13 },
  { name: 'T3', revenue: 2000, rooms: 48 },
  { name: 'T4', revenue: 2780, rooms: 39 },
  { name: 'T5', revenue: 1890, rooms: 48 },
  { name: 'T6', revenue: 2390, rooms: 38 },
  { name: 'T7', revenue: 3490, rooms: 43 },
];

const SelectOptions = [
  { value: 'day', label: 'Theo Ngày' },
  { value: 'week', label: 'Theo Tháng' },
  { value: 'month', label: 'Theo Năm' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

export default function DashboardPage() {
  // State quản lý bộ lọc thời gian
  const [timeRange, setTimeRange] = useState("month");

  
  // State mới để lưu trọn bộ 2 ngày (Từ ngày - Đến ngày)
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const cardStats = [
    { title: "Phòng trống", value: "12", icon: <CheckCircle2 size={28} className="text-emerald-500" /> },
    { title: "Phòng đã thuê", value: "45", icon: <XCircle size={28} className="text-red-500" /> },
    { title: "Thanh toán đang chờ", value: "8", icon: <AlertCircle size={28} className="text-orange-500" /> },
    { title: "Thanh toán đã hoàn tất", value: "32", icon: <CheckCircle2 size={28} className="text-emerald-500" /> },
  ];

  return (
    // Bạn sửa lại dòng chứa div bao bọc ngoài cùng (khoảng dòng 26) thành:

<div className="w-full h-full flex flex-col gap-6 pb-6 liquid-scrollbar">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white drop-shadow-sm">
        Tổng quan Hệ thống
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {cardStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 rounded-4xl
                       bg-white/40 dark:bg-white/10 
                       backdrop-blur-xl 
                       border border-white/60 dark:border-white/20 
                       shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none
                       transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <span className="text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                {stat.value}
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center 
                            bg-white/70 dark:bg-white/20 
                            backdrop-blur-md 
                            border border-white/80 dark:border-white/10 shadow-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-100 w-full p-6 rounded-4xl
                      bg-white/40 dark:bg-white/10 
                      backdrop-blur-xl 
                      border border-white/60 dark:border-white/20 
                      shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none
                      flex flex-col gap-6">
        

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Biểu đồ Doanh thu & Lượt thuê
          </h2>
          
          <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-2xl border border-white/50 dark:border-white/10">
            <MasterSelect
              options={SelectOptions}
              value={timeRange}
              onChange={setTimeRange}
              icon={<Calendar size={18} className="text-slate-500 dark:text-slate-400" />}
            />
            {timeRange === "custom" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <GlassDateInput 
                dateRange={customRange} 
                onChange={setCustomRange} 
              />
            </div>
          )}
          </div>
        </div>


        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
              
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
              />
              
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Doanh thu"
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}