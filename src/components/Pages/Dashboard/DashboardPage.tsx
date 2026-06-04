import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { CheckCircle2, Clock, Users, Home } from "lucide-react";
import { PieChart, Pie, Sector, Rectangle, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MasterSelect from "@/components/Atoms/Select/MasterSelect";
import GlassDateInput from "@/components/Atoms/Select/RangeDateSelect";
import {formatCurrency} from "@/utils/helperformat";
// import Room3DViewer from "@/components/Organisms/Room3DViewer/Room3DViewer";

const mockBarChartData = {
  day: [
    { name: 'Tiền phòng', amount: 5000000 },
    { name: 'Tiền điện', amount: 450000 },
    { name: 'Tiền nước', amount: 150000 },
    { name: 'Tiền rác', amount: 50000 },
    { name: 'Internet', amount: 100000 },
  ],
  week: [
    { name: 'Tiền phòng', amount: 120000000 },
    { name: 'Tiền điện', amount: 8500000 },
    { name: 'Tiền nước', amount: 3200000 },
    { name: 'Tiền rác', amount: 1200000 },
    { name: 'Internet', amount: 4500000 },
  ],
  month: [
    { name: 'Tiền phòng', amount: 1440000000 },
    { name: 'Tiền điện', amount: 102000000 },
    { name: 'Tiền nước', amount: 38400000 },
    { name: 'Tiền rác', amount: 14400000 },
    { name: 'Internet', amount: 54000000 },
  ],
  custom: [
    { name: 'Tiền phòng', amount: 360000000 },
    { name: 'Tiền điện', amount: 25500000 },
    { name: 'Tiền nước', amount: 9600000 },
    { name: 'Tiền rác', amount: 3600000 },
    { name: 'Internet', amount: 13500000 },
  ]
};

const roomStats = {
  vacant: 12,
  rented: 45,
  pending: 8,
  completed: 32
};

const roomStatusData = [
  { name: "Phòng trống", value: roomStats.vacant, color: 'color-mix(in srgb, var(--color-chart-accent) 100%, transparent)' },
  { name: "Phòng đã thuê", value: roomStats.rented, color: 'color-mix(in srgb, var(--color-chart-accent) 80%, transparent)' },
];

const SelectOptions = [
  { value: 'day', label: 'Theo Ngày' },
  { value: 'week', label: 'Theo Tháng' },
  { value: 'month', label: 'Theo Năm' },
  // { value: 'custom', label: 'Tùy chỉnh' },
];
const CHART_COLORS = [
  '#10b981',
  '#3b82f6', 
  '#f97316', 
  '#059669', 
  '#8b5cf6', 
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const currentBarData = mockBarChartData[timeRange as keyof typeof mockBarChartData] || mockBarChartData.month;

  const cardStats = [
    { title: "Phòng trống", value: roomStats.vacant.toString(), icon: <Home size={28} className="text-emerald-500" /> },
    { title: "Phòng đã thuê", value: roomStats.rented.toString(), icon: <Users size={28} className="text-blue-500" /> },
    { title: "Thanh toán đang chờ", value: roomStats.pending.toString(), icon: <Clock size={28} className="text-orange-500" /> },
    { title: "Thanh toán đã hoàn tất", value: roomStats.completed.toString(), icon: <CheckCircle2 size={28} className="text-emerald-500" /> },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 pb-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-card-title drop-shadow-sm">
          Tổng quan Hệ thống
        </h1>

        <div >
          <MasterSelect
            options={SelectOptions}
            value={timeRange}
            onChange={(val) => setTimeRange(val.toString())}
          />
          {timeRange === "custom" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <GlassDateInput dateRange={customRange} onChange={setCustomRange} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {cardStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 rounded-4xl
                       bg-card-bg border border-card-border dark:shadow-none
                       transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-card-text">
                {stat.title}
              </span>
              <span className="text-4xl font-bold text-card-title tracking-tight">
                {stat.value}
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center 
                            bg-card-icon-bg backdrop-blur-md 
                            border border-card-icon-border shadow-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* khu vực biểu đồ  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-100">
        <div className="p-6 rounded-4xl bg-card-bg border border-card-border flex flex-col gap-4">
          <h2 className="text-xl font-bold text-card-title">Trạng thái Phòng hiện tại</h2>
          <div className="flex-1 w-full h-full flex items-center justify-center min-h-75">
            <ResponsiveContainer width="100%" height="100%" >
              <PieChart>
                <Pie
                  data={roomStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  cornerRadius={8}
                  shape={(props: any) => {
                    const { index } = props;
                    return (
                      <Sector
                        {...props}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        stroke="var(--color-chart-grid)"
                        strokeWidth={1.5}
                      />
                    );
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-card-bg)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid var(--color-card-border)' }}
                  itemStyle={{ color: 'var(--color-card-title)', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--color-chart-text)', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-4xl bg-card-bg backdrop-blur-xl border border-card-border flex flex-col gap-4">
          <h2 className="text-xl font-bold text-card-title">Chi tiết Khoản thu Hệ thống</h2>
          <div className="flex-1 w-full h-full min-h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentBarData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fill: 'var(--color-chart-text)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-chart-text)', fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip
                  cursor={{ fill: 'var(--color-chart-grid)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--color-card-bg)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid var(--color-card-border)' }}
                  itemStyle={{ color: 'var(--color-card-title)', fontWeight: 600 }}
                  formatter={(value) => {
                    if (value === undefined || value === null) return ['0 VNĐ', 'Doanh thu'];
                    return [`${Number(value).toLocaleString()} VNĐ`, 'Doanh thu'];
                  }}
                />
                <Bar
                  dataKey="amount"
                  maxBarSize={45}
                  shape={(props: any) => {
                    const { index } = props;
                    return (
                      <Rectangle
                        {...props}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        radius={[8, 8, 0, 0]}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

       {/* <div className="p-6 rounded-4xl bg-card-bg backdrop-blur-xl border border-card-border flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-card-title">Mô hình Thực tế ảo (VR)</h2>
          <p className="text-sm font-medium text-card-text">
            Trải nghiệm không gian nội thất phòng trọ mẫu.
          </p>
        </div>
        
        <Room3DViewer modelUrl="src/models/4_6_2026.glb" />
      </div> */}
  

    </div>
  );
}