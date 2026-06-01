import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center w-25 h-10 p-1 backdrop-blur-md rounded-full shadow-inner overflow-hidden cursor-pointer
                       bg-switch-bg border border-switch-border"
        >
            <div className={`absolute top-1 bottom-1 w-11 rounded-full shadow-md transition-transform duration-500 ease-out bg-switch-thumb
                            ${isDarkMode ? "translate-x-12" : "translate-x-0"}`} 
            />

            <div className={`relative z-10 flex-1 flex justify-center items-center h-full transition-all duration-500 
                            ${isDarkMode ? "opacity-40 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100 text-switch-sun"}`}>
                <Sun size={18} strokeWidth={2.5} />
            </div>

            <div className={`relative z-10 flex-1 flex justify-center items-center h-full transition-all duration-500 
                            ${isDarkMode ? "opacity-100 rotate-0 scale-100 text-switch-moon" : "opacity-40 -rotate-90 scale-75"}`}>
                <Moon size={18} strokeWidth={2.5} />
            </div>
        </button>
    );
}