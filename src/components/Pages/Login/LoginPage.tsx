import LoginTemplate from "@/components/Templates/LoginTemplate";
import LoginForm from "@/components/Organisms/LoginForm/LoginForm";
import ThemeSwitcher from "@/components/Atoms/ThemeMode/ThemeSwitch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hook/useAuth";
import { useActionState, useEffect } from "react";

const loginAction = async (previousState: any, formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: 'Đăng nhập thành công' };
};

export default function LoginPage() {
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
            <div className="flex items-center justify-center w-full h-screen bg-linear-to-tr from-bg-start via-bg-middle to-bg-end">
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