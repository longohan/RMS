import { useTheme } from "next-themes";
import type { ReactNode } from "react";

interface Props {
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "solid" | "glass" | "liquidGlass";
    size?: "sm" | "md" | "lg";
    className?: string;
    type?: "button" | "submit" | "reset";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    children?: ReactNode;
}

export default function Button({
    text,
    onClick,
    disabled = false,
    variant = "liquidGlass",
    size = "md",
    className = "",
    type = "button",
    icon,
    iconPosition = "left",
    children,
}: Props) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Size mapping
    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    // Variant styles
    const variantClasses = {
        solid: "bg-blue-600 hover:bg-blue-700 text-white",
        glass: isDark
            ? "bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-100 border border-white/20"
            : "bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-900 border border-white/30",
        liquidGlass: isDark
            ? "bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/20 backdrop-blur-xl hover:from-blue-500/40 hover:via-purple-500/30 hover:to-pink-500/30  shadow-purple-500/20"
            : "bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/20 backdrop-blur-xl hover:from-blue-400/40 hover:via-purple-400/30 hover:to-pink-400/30 text-white border border-white/40 shadow-lg hover:shadow-xl shadow-purple-400/20",
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center justify-center gap-2 group
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${disabledClasses}
                rounded-lg font-semibold transition-all duration-300 ease-out
                hover:scale-105 active:scale-95
                ${className}
            `}
        >
            {icon && iconPosition === "left" && (
                <span className="transition-all duration-300 origin-center">
                    {icon}
                </span>
            )}
            {children || text}
            {icon && iconPosition === "right" && (
                <span className="transition-all duration-300 origin-center">
                    {icon}
                </span>
            )}
        </button>
    );
}