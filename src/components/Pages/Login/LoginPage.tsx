import LoginTemplate from "@/components/Templates/LoginTemplate";
import LoginForm from "@/components/Organisms/LoginForm/LoginForm";
import ThemeSwitcher from "@/components/Atoms/ThemeMode/ThemeSwitch";
import { useTheme } from "next-themes";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/hook/useAuth";
import { useActionState, useEffect } from "react";


const loginAction = async (previousState: any, formData: FormData) => {

    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: 'Đăng nhập thành công' };
};

export default function LoginPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [status, formAction, isPending] = useActionState(loginAction, null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (status?.success) {
            login();
            navigate('/dashboard', { replace: true });
        }
    }, [status, login, navigate]);

    return (
        <LoginTemplate>
            <div className={`flex items-center justify-center w-full h-screen transition-colors duration-500 
                ${isDark ? "bg-linear-to-tr from-slate-900 via-slate-800 to-slate-950" :
                    "bg-linear-to-tr from-[#E0C3FC] via-[#8EC5FC] to-[#E2F0D9]"}`}>
                <div className="absolute top-4 right-4">
                    <ThemeSwitcher />
                </div>
                <LoginForm
                    onSubmit={formAction}
                    isPending={isPending}
                    status={status}
                />
            </div>
        </LoginTemplate>
    );
}