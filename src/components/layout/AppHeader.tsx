import Link from "next/link";
import { auth } from "@/auth";

export const AppHeader = async () => {
    const session = await auth();
    const role = session?.user?.role;

    const homeHref =
        role === "ADMIN" ? "/admin" : role === "STAFF" ? "/staff" : "/";

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href={homeHref} className="text-xl font-bold">
                    Shift Manager
                </Link>

                <nav className="flex gap-4 text-sm">
                    {role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="text-slate-700 hover:text-slate-950"
                        >
                            管理メニュー
                        </Link>
                    )}

                    {role === "STAFF" && (
                        <Link
                            href="/staff"
                            className="text-slate-700 hover:text-slate-950"
                        >
                            スタッフメニュー
                        </Link>
                    )}

                    {!role && (
                        <Link
                            href="/login"
                            className="text-slate-700 hover:text-slate-950"
                        >
                            ログイン
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};