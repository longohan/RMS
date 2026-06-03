import { Search } from "lucide-react";

interface MasterSearchProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
}

export default function MasterSearch({ searchQuery, onSearchChange, placeholder = "Search..." }: MasterSearchProps) {
  return (
    <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl w-full
                    bg-input-bg backdrop-blur-md border border-card-border
                    focus-within:ring-2 focus-within:ring-blue-400/50 transition-all duration-300">
      <Search size={20} className="text-input-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-sm font-medium
                   text-layout-text placeholder:text-input-icon/70"
      />
    </div>
  );
}