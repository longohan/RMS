import type { ReactNode } from "react";

interface LoginTemplateProps {
    children: ReactNode;
}

export default function LoginTemplate({ children }: LoginTemplateProps) {
    return (
        <main className="w-full h-screen overflow-hidden flex items-center justify-center">
            {children}
        </main>
    );
}