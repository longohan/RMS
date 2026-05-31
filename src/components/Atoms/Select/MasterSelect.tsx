// src/components/Atoms/Select/MasterSelect.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface GlassDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: React.ReactNode;
  className?: string;
}

export default function MasterSelect({ value, onChange, options, icon, className = "" }: GlassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "Chọn...";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // 2. Chèn className vào thẻ bọc ngoài cùng
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // 3. Xóa min-w-[140px] đi, thay bằng w-full
        className="flex items-center justify-between gap-3 w-full
                   bg-white/50 dark:bg-black/20 p-2 px-3 rounded-2xl 
                   border border-white/50 dark:border-white/10 
                   backdrop-blur-md transition-all 
                   hover:bg-white/60 dark:hover:bg-black/30
                   text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-1 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/20 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm cursor-pointer transition-all ${
                  value === opt.value 
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}