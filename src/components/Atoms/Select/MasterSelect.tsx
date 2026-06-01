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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-full p-2 px-3 rounded-2xl backdrop-blur-md transition-all text-sm font-medium outline-none cursor-pointer
                   bg-select-bg hover:bg-select-hover border border-select-border text-select-text"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-select-icon">{icon}</span>}
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-1 p-1 backdrop-blur-xl rounded-2xl shadow-lg max-h-60 overflow-y-auto
                         bg-select-menu-bg border border-select-menu-border">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm cursor-pointer transition-all ${
                  value === opt.value 
                    ? "font-bold bg-select-active-bg text-select-active-text" 
                    : "text-select-item-text hover:bg-select-item-hover"
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