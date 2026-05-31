import TextInput from "../../Atoms/Input/TextInput";
import Button from "../../Atoms/Button/Button";

interface LoginFormProps {
    onSubmit: (formData: FormData) => void;
    isPending: boolean;
    status?: { success: boolean; message: string } | null;
}

export default function LoginForm({ onSubmit, isPending, status }: LoginFormProps) {
    return (
        <form action={onSubmit} className="glass-panel w-full max-w-md p-8 flex flex-col gap-4 bg-white/30 rounded-2xl">
            <div className="flex p-3 items-center justify-center gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                    RMS
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 leading-tight">Boarding Hub</h2>
                    <p className="text-xs text-slate-700 dark:text-gray-400 font-medium">Management System</p>
                </div>
            </div>

            <TextInput
                name="email"
                type="email"
                placeholder="Email"
                required
                maxLength={255}
            />
            <TextInput
                name="password"
                type="password"
                placeholder="Password"
                minLength={6}
                required
            />
            <div className="text-right">
                <a href="#forgot" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Quên mật khẩu?
                </a>
            </div>
            {status?.success === false && (
                <div className="p-3 text-sm text-red-600 bg-red-100/80 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-center font-medium border border-red-200 dark:border-red-800">
                    {status.message}
                </div>
            )}
            <Button
                type="submit"
                disabled={isPending}
                variant="solid"
                size="md"
            >
                {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
        </form>
    );
}