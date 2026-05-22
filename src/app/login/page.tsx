import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/features/auth/actions";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";

type LoginPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const session = await auth();
    const { error } = await searchParams;

    if (session?.user?.role === "ADMIN") {
        redirect("/admin");
    }

    if (session?.user?.role === "STAFF") {
        redirect("/staff");
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>ログイン</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            メールアドレスまたはパスワードが正しくありません。
                        </div>
                    )}

                    <form action={loginAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                                required
                            />
                        </div>

                        <SubmitButton className="w-full" pendingText="ログイン中...">
                            ログイン
                        </SubmitButton>
                    </form>

                    <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-600">
                        <p className="font-medium">デモ用アカウント</p>
                        <p className="mt-2">管理者：admin@example.com / password</p>
                        <p>スタッフ：staff1@example.com / password</p>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/login" className="text-slate-500 hover:text-slate-900">
                            ログイン画面に戻る
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;