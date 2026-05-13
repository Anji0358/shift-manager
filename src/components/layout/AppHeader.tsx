import Link from "next/link";

export const AppHeader = () => {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href="/" className="text-xl font-bold">
                    Shift Manager
                </Link>

                <nav className="flex gap-4 text-sm">
                    <Link href="/admin" className="text-slate-700 hover:text-slate-950">
                        管理者画面
                    </Link>
                    <Link href="/staff" className="text-slate-700 hover:text-slate-950">
                        従業員画面
                    </Link>
                </nav>
            </div>
        </header>
    );
};