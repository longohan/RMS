// src/components/Atoms/Select/MasterSelect.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string | number;
}

interface MasterSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string; // Dùng để ghi đè CSS từ ngoài vào nếu cần (ví dụ trong Form)
}

export default function MasterSelect({
  value,
  onChange,
  options,
  placeholder = "",
  className = ""
}: MasterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Tự động đóng dropdown khi click ra ngoài màn hình
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // --- BỘ CSS CHUẨN MẶC CÓ SẴN VIỀN, NỀN CỦA DROPDOWN ---
  // Đảm bảo không truyền className từ form thì nút vẫn có viền bo góc tròn trịa cực đẹp
  const defaultSelectClasses = `
    flex items-center justify-between gap-2
    w-full px-4 py-2.5 
    bg-btn-glass-bg backdrop-blur-md 
    border border-btn-glass-border hover:border-blue-400/50
    rounded-xl font-bold text-sm text-card-text 
    transition-all duration-300 cursor-pointer whitespace-nowrap
  `;

  return (
    <div ref={selectRef} className="relative w-auto min-w-35">
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={className ? `flex items-center justify-between text-left cursor-pointer ${className}` : defaultSelectClasses}
      >
        <span className={selectedOption ? "text-layout-text" : "text-input-icon/70"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          size={16} 
          className={`text-input-icon/70 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 mt-2 z-50 min-w-full max-h-60 overflow-y-auto bg-card-bg/95 border border-card-border rounded-xl shadow-xl backdrop-blur-xl liquid-scrollbar animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1 flex flex-col gap-0.5">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-lg transition-all hover:bg-btn-glass-hover text-card-text whitespace-nowrap cursor-pointer
                    ${isSelected ? "bg-btn-solid text-white hover:bg-btn-solid/90" : ""}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}