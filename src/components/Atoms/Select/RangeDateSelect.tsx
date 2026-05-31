// src/components/Molecules/DatePicker/GlassDateRangePicker.tsx
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon } from "lucide-react";

interface GlassDateRangePickerProps {
    dateRange: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}

export default function GlassDateRangePicker({ dateRange, onChange }: GlassDateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayString = dateRange?.from
        ? dateRange.to
            ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
            : format(dateRange.from, "dd/MM/yyyy")
        : "Chọn khoảng thời gian...";

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 min-w-70
                    p-2 px-4 rounded-2xl 
                    backdrop-blur-md transition-all hover:bg-white/60 dark:hover:bg-black/30
                    text-sm font-medium text-slate-700 dark:text-white/80"
            >
                <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="flex-1 text-left">{displayString}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 z-50 p-6
                        w-max bg-white/40 dark:bg-black/60 
                        rounded-3xl
                        ">
                    <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={onChange}
                        numberOfMonths={2}
                        locale={vi}
                        showOutsideDays
                        captionLayout="dropdown"
                        startMonth={new Date(2010, 0)}
                        classNames={{
                            day_button: "h-10 w-10 p-0 font-normal rounded-full transition-colors ",
                            range_start: "text-white bg-blue-600 rounded-l-lg",
                            range_end: "text-white bg-blue-600 rounded-r-lg",
                            range_middle: "  text-gray-500 bg-gray-500/60",
                        }}
                    />

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white dark:border-black-700">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}