import { useState, type ChangeEvent, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    maxLength?: number;
    minLength?: number;
}

export default function Input({
    name,
    type = "text",
    placeholder,
    required = false,
    className = "",
    icon,
    iconPosition = "left",
    maxLength = 255,
    minLength = 0,
}: InputProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [Error, setError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const handlechecklength = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (required && value.trim() === "") {
            setError("Trường này là bắt buộc");
            return;
        }
        if (maxLength && value.length > maxLength) {
            setError(`Vui lòng nhập tối đa ${maxLength} ký tự (Hiện tại: ${value.length})`);
            return;
        }
        if (minLength && value.length < minLength) {
            setError(`Vui lòng nhập tối thiểu ${minLength} ký tự (Hiện tại: ${value.length})`);
            return;
        }
        if (maxLength && value.length > maxLength && minLength && value.length < minLength) {
            setError(`Vui lòng nhập tối đa ${maxLength} ký tự (Hiện tại: ${value.length})`);
            return;
        }
        else {
            setError(null);
        }

    }

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="relative">
                {icon && iconPosition === "left" && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-input-icon">
                        {icon}
                    </div>
                )}

                <input
                    name={name}
                    type={type === "password" && passwordVisible ? "text" : type}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength + 1}
                    minLength={minLength}
                    onChange={handlechecklength}
                    onBlur={handlechecklength}
                    className={`w-full py-3 rounded-lg bg-input-bg ${icon
                            ? iconPosition === "left"
                                ? "pl-11 pr-4"
                                : "pl-4 pr-11"
                            : "px-4"
                        } ${type === "password" ? "pr-12!" : ""} ${className}`}
                />
                {icon && iconPosition === "right" && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-input-icon">
                        {icon}
                    </div>
                )}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {Error && <span className="text-input-error text-sm ml-1 mt-1">{Error}</span>}
        </div>
    );
}