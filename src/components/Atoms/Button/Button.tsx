import type { ReactNode } from "react";

interface Props {
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "solid" | "glass" | "liquidGlass" | "volumetric" ;
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

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
        solid: "bg-btn-solid hover:bg-btn-solid-hover text-white",
        
        glass: "bg-btn-glass-bg hover:bg-btn-glass-hover text-btn-glass-text border border-btn-glass-border backdrop-blur-md",
        
        liquidGlass: "bg-gradient-to-br from-liquid-from via-liquid-via to-liquid-to hover:from-liquid-from-hover hover:via-liquid-via-hover hover:to-liquid-to-hover text-white border border-liquid-border backdrop-blur-xl shadow-lg hover:shadow-xl shadow-purple-500/20",
        
        volumetric: `
                bg-[var(--color-volumetric-bg)] 
                text-[var(--color-volumetric-text)] 
                shadow-[var(--shadow-emboss)] 
                border border-transparent
                hover:brightness-105
                active:shadow-[var(--shadow-deboss)] active:translate-y-[1px]
            `,
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